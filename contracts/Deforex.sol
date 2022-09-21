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

  function createPosition(address tokenSell, address tokenBuy, uint256 amount, uint256 leverage, uint256 slippage) external payable {

    TransferHelper.safeTransferFrom(tokenSell, msg.sender, address(this), amount);

    address alpAddr = _factory.getAlp(tokenSell, tokenBuy);

    require(alpAddr != address(0), "Deforex: ZERO_ADDRESS");

    ALP alp = ALP(alpAddr);
    (uint256 totalAmount, uint256 leverageAv) = alp.requestReserve(leverage, amount, tokenSell);

    IExchange exchange = _factory.getExchange(IExchange.DEX.UNISWAP);
    
    require(address(exchange) != address(0), "Deforex: ZERO_ADDRESS");

    totalAmount += amount;

    TransferHelper.safeApprove(tokenSell, address(exchange), totalAmount);

    (, uint256 amountOut) = exchange.swap(IExchange.SwapParams({
      amountIn: totalAmount,
      amountOut: 0,
      tokenIn: tokenSell,
      tokenOut: tokenBuy,
      timestamp: block.timestamp
    }));

    _orders[++_orderId] = OrderParams({
        amount: amount,     // amount without leverage
        leverage: leverage,
        amountOut: amountOut, // amount tokens after swap
        tokenSell: tokenSell,
        tokenBuy: tokenBuy,
        trader: msg.sender
    });
  }
  
  function closePosition(uint256 id) external payable {
    OrderParams memory params = _orders[id];

    IExchange exchange = _factory.getExchange(IExchange.DEX.UNISWAP);  
    TransferHelper.safeApprove(params.tokenBuy, address(exchange), params.amountOut);

    (, uint256 amountOut) = exchange.swap(IExchange.SwapParams({
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

  function closeOrder() external {
  }
}
