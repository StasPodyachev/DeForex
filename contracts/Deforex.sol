// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IFactory.sol";
import "./interfaces/IExchange.sol";
import "./interfaces/IDeforex.sol";
import "./ALP.sol";

import "hardhat/console.sol";

abstract contract Deforex is IDeforex, Ownable {

  uint256 public orderId;
  ALP internal _alp;
  Exchange internal _exchange;

  mapping(uint256 => mapping(address => address)) public _orders;


  function createOrder(address tokenSell, address tokenBuy, uint256 amount, uint256 leverage, uint256 slippage) external payable {

    IERC20(tokenSell).transferFrom(msg.sender, this, amount);
    
    _alp.requestReserve(leverage, amount, tokenSell);
    _exchange.swap(SwapParams(1, UNISWAP));

    _orderId++;

    // TODO: save more fields to OrderParams

    _orders[_orderId] = OrderParams(1, amount, leverage);
  }

  function closeOrder(uint256 id) external payable {
    OrderParams memory params = _orders[id];

    _exchange.swap(params);

    // TODO: return reserve to ALP
  }

  function setAlp(ALP alp){
    _alp = alp;
  }

  function openPosition() external {
  }

  function closePosition() external {
  }
}
