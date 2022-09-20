// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/lib/contracts/libraries/TransferHelper.sol";

import "./interfaces/IFactory.sol";
import "./interfaces/IExchange.sol";
import "./interfaces/IDeforex.sol";
import "./ALP.sol";

import "hardhat/console.sol";

abstract contract Deforex is IDeforex, Ownable {

  uint256 public _orderId;
  IFactory public _factory;
  IExchange public _exchange;

  mapping(uint256 => OrderParams) public _orders;

  function setFactory(IFactory factory) external{
    _factory = factory;
  }

  function setExchange(IExchange exchange) external{
    _exchange = exchange;
  } 

  function createOrder(address tokenSell, address tokenBuy, uint256 amount, uint256 leverage, uint256 slippage) external payable {

    IERC20(tokenSell).transferFrom(msg.sender, address(this), amount);

    address alpAddr = _factory.getAlp(tokenSell, tokenBuy);

    require(alpAddr != address(0), "Deforex: ZERO_ADDRESS");

    ALP alp = ALP(alpAddr);
    alp.requestReserve(leverage, amount, tokenSell);
    
    (, uint256 amountOut) = _exchange.swap(IExchange.SwapParams({
      amountIn: amount,
      amountOut: 0,
      tokenIn: tokenSell,
      tokenOut: tokenBuy,
      timestamp: block.timestamp
    }));

    _orderId++;

    _orders[_orderId] = OrderParams({
        amount: amount,     // amount without leverage
        leverage: leverage,
        amountOut: amountOut, // amount tokens after swap
        tokenSell: tokenSell,
        tokenBuy: tokenBuy,
        trader: msg.sender
    });
  }

  function closeOrder(uint256 id) external payable {
    OrderParams memory params = _orders[id];

    (, uint256 amountOut) = _exchange.swap(IExchange.SwapParams({
      amountIn: params.amountOut,
      amountOut: 0,
      tokenIn: params.tokenBuy,
      tokenOut: params.tokenSell,
      timestamp: block.timestamp
    }));

    address alpAddr = _factory.getAlp(params.tokenSell, params.tokenBuy);

    require(alpAddr != address(0), "Deforex: ZERO_ADDRESS");

    // TODO: need transfer to trader

    TransferHelper.safeApprove(params.tokenSell, alpAddr, amountOut);
    TransferHelper.safeTransfer(params.tokenSell, alpAddr, amountOut);
  }

  function openPosition() external {
  }

  function closePosition() external {
  }
}
