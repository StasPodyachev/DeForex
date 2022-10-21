// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IDeforex {

    enum PositionStatus {
        OPEN,
        CLOSE,
        LIQUIDATION
    }

    struct PositionParams {
        uint256 amount;     // amount without leverage
        uint256 leverage;
        uint256 amountOut; // amount tokens after swap
        address tokenSell;
        address tokenBuy;
        address trader;
        PositionStatus status;
        // uint256 timestamp;
    }

    event PositionCreated(
        uint256 id
    );

    event PositionClose(
        uint256 id,
        uint256 amountToAlp,
        uint256 amountToTrader
    );

    event PositionLiquidation(
        uint256 id,
        uint256 amountToAlp,
        address liquidator
    );

    function createPosition(address tokenSell, address tokenBuy, uint256 amount, uint256 leverage, bytes calldata path) external;

    function closePosition(uint256 id, bytes calldata path) external;

    function liquidation(uint256 id, bytes calldata path) external;

    function liquidation(uint256[] memory ids, bytes[] calldata path) external;
}
