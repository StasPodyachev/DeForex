// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IDeforex {

    struct OrderParams {
        uint256 type_;      // 0 - buy, 1 - sell
        uint256 amount;     // amount without leverage
        uint256 leverage;
        uint256 totalAmount; // amount with leverage
        
    }

    function createOrder(address tokenSell, address tokenBuy, uint256 amount, uint256 leverage, uint256 slippage) external payable;

    function closeOrder(uint256 id) external payable;
}
