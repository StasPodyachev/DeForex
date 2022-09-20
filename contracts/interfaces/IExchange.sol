// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IExchange {

    enum DEX {
        UNISWAP,
        ONE_INCH,
        DE_SWAP
    }

    struct SwapParams {
        uint256 amountIn;
        uint256 amountOut; // if > 0 we used oracle price
        address tokenIn;
        address tokenOut;
        uint256 timestamp;
    }

    function swap(SwapParams memory params) external returns (uint256 amountIn, uint256 amountOut);
}