// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/lib/contracts/libraries/TransferHelper.sol";

import "./interfaces/IFactory.sol";
import "./interfaces/IExchange.sol";
import "./interfaces/IDeforex.sol";
import "./ALP.sol";

import "hardhat/console.sol";

contract Deforex is IDeforex, Ownable {
    uint256 public _positionId;
    IFactory public _factory;
    IExchange public _exchange;
    uint256 public liquidationDeltaPercent = 1e17; // 10%
    uint256 public liquidatorFeePercent = 5e14; // 0.05%
    uint256 public alpFeePercent = 1e15; // 0.10%

    mapping(uint256 => PositionParams) public _positions;

    function setFactory(IFactory factory) external {
        _factory = factory;
    }

    function setExchange(IExchange exchange) external {
        _exchange = exchange;
    }

    function setLiquidationDelta(uint256 val) external {
        liquidationDeltaPercent = val;
    }

    function setLiquidatorFeePercent(uint256 val) external {
        liquidatorFeePercent = val;
    }

    function setAlpFeePercent(uint256 val) external {
        alpFeePercent = val;
    }

    function createPosition(
        address tokenSell,
        address tokenBuy,
        uint256 amount,
        uint256 leverage,
        bytes calldata path
    ) external {
        TransferHelper.safeTransferFrom(
            tokenSell,
            msg.sender,
            address(this),
            amount
        );

        address alpAddr = _factory.getAlp(tokenSell, tokenBuy);

        require(alpAddr != address(0), "Deforex: alp address is ZERO_ADDRESS");

        ALP alp = ALP(alpAddr);
        (uint256 totalAmount, ) = alp.requestReserve(
            leverage,
            amount,
            tokenSell
        );

        IExchange exchange = _factory.getExchange(IExchange.DEX.UNISWAP);

        require(
            address(exchange) != address(0),
            "Deforex: exchange address is ZERO_ADDRESS"
        );

        totalAmount += amount;

        TransferHelper.safeApprove(tokenSell, address(exchange), totalAmount);

        (, uint256 amountOut) = exchange.swap(
            IExchange.SwapParams({
                amountIn: totalAmount,
                amountOut: 0,
                tokenIn: tokenSell,
                tokenOut: tokenBuy,
                timestamp: block.timestamp,
                path: path
            })
        );

        _positions[++_positionId] = PositionParams({
            amount: amount, // amount without leverage
            leverage: leverage,
            amountOut: amountOut, // amount tokens after swap
            tokenSell: tokenSell,
            tokenBuy: tokenBuy,
            trader: msg.sender,
            status: PositionStatus.OPEN
        });

        emit PositionCreated(_positionId);
    }

    function _closePosition(uint256 id, bytes calldata path)
        internal
        returns (PositionParams storage params, uint256 amountOut)
    {
        params = _positions[id];

        IExchange exchange = _factory.getExchange(IExchange.DEX.UNISWAP);
        TransferHelper.safeApprove(
            params.tokenBuy,
            address(exchange),
            params.amountOut
        );

        (, amountOut) = exchange.swap(
            IExchange.SwapParams({
                amountIn: params.amountOut,
                amountOut: 0,
                tokenIn: params.tokenBuy,
                tokenOut: params.tokenSell,
                timestamp: block.timestamp,
                path: path
            })
        );
    }

    function _distributionActive(
        PositionParams storage position,
        uint256 amountOutFact
    ) internal returns (uint256 amountToAlp, uint256 amountToTrader) {
        address alpAddr = _factory.getAlp(
            position.tokenSell,
            position.tokenBuy
        );

        amountToAlp = position.amount * (position.leverage - 1);

        if (amountOutFact >= amountToAlp) {
            amountToTrader = amountOutFact - amountToAlp;
        } else {
            amountToAlp = amountOutFact;
        }

        require(alpAddr != address(0), "Deforex: ZERO_ADDRESS");

        TransferHelper.safeTransfer(position.tokenSell, alpAddr, amountToAlp);

        if (amountToTrader > 0) {
            TransferHelper.safeTransfer(
                position.tokenSell,
                position.trader,
                amountToTrader
            );
        }
    }

    function closePosition(uint256 id, bytes calldata path) external {
        (
            PositionParams storage position,
            uint256 amountOutFact
        ) = _closePosition(id, path);

        (uint256 amountToAlp, uint256 amountToTrader) = _distributionActive(
            position,
            amountOutFact
        );

        position.status = PositionStatus.CLOSE;

        emit PositionClose(id, amountToAlp, amountToTrader);
    }

    function liquidation(uint256 id, bytes calldata path) external {
        (PositionParams storage position, uint256 amountOut) = _closePosition(
            id,
            path
        );

        uint256 leverageAmoutOut = position.amount * (position.leverage - 1);

        require(
            amountOut <=
                leverageAmoutOut +
                    ((leverageAmoutOut * liquidationDeltaPercent) / 1e18),
            "Deforex: Liquidation condition not met"
        );

        address alpAddr = _factory.getAlp(
            position.tokenSell,
            position.tokenBuy
        );

        uint256 alpAmount = leverageAmoutOut +
            (amountOut * alpFeePercent) /
            1e18;

        uint256 liquidatorAmount = (amountOut * liquidatorFeePercent) / 1e18;

        uint256 traderAmount = amountOut - alpAmount - liquidatorAmount;

        TransferHelper.safeTransfer(position.tokenSell, alpAddr, alpAmount);
        TransferHelper.safeTransfer(
            position.tokenSell,
            msg.sender,
            liquidatorAmount
        );
        TransferHelper.safeTransfer(
            position.tokenSell,
            position.trader,
            traderAmount
        );

        position.status = PositionStatus.LIQUIDATION;

        emit PositionLiquidation(id, amountOut, msg.sender);
    }

    function liquidation(uint256[] memory ids, bytes[] calldata path) external {
        for (uint256 i = 0; i <= ids.length; i++) {
            this.liquidation(ids[i], path[i]);
        }
    }
}
