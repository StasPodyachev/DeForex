// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IDeforex {

    struct OrderParams {
        uint256 amount;     // amount without leverage
        uint256 leverage;
        uint256 amountOut; // amount tokens after swap
        address tokenSell;
        address tokenBuy;
        address trader;
    }

    function createPosition(address tokenSell, address tokenBuy, uint256 amount, uint256 leverage, uint256 slippage) external payable;

    function closePosition(uint256 id) external payable;
}
