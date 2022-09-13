// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IDeforex {

    struct OrderParams {
        uint256 type_;
        uint256 summ;
        uint256 leverage;
    }

    function createOrder(address tokenSell, address tokenBuy, uint256 amount, uint256 leverage, uint256 slippage) external payable;

    function closeOrder(uint256 id) external payable;
}
