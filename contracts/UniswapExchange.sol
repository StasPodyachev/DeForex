// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.9;
pragma abicoder v2;

import "./Exchange.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/lib/contracts/libraries/TransferHelper.sol";
import "@uniswap/swap-router-contracts/contracts/interfaces/IV3SwapRouter.sol";

contract UniswapExchange is
    Exchange
{
    ISwapRouter public immutable swapRouter;
    IV3SwapRouter public immutable swapRouter02;

    constructor(address router, address router02) {
        swapRouter = ISwapRouter(router);
        swapRouter02 = IV3SwapRouter(router02);
    }


    function swap(IExchange.SwapParams memory params) {
        // 
    }

    function safeTransferWithApprove(uint256 amountIn, address routerAddress)
        internal
    {
        TransferHelper.safeTransferFrom(
            DAI,
            msg.sender,
            address(this),
            amountIn
        );

        TransferHelper.safeApprove(DAI, routerAddress, amountIn);
    }

    function swapExactInputSingle(uint256 amountIn, address tokenIn, address tokenOut)
        external
        returns (uint256 amountOut)
    {
        safeTransferWithApprove(amountIn, address(swapRouter));

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: 3000,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        amountOut = swapRouter.exactInputSingle(params);
    }

    function swapExactInputSingle02(uint256 amountIn, address tokenIn, address tokenOut)
        external
        returns (uint256 amountOut)
    {
        safeTransferWithApprove(amountIn, address(swapRouter02));

        IV3SwapRouter.ExactInputSingleParams memory params = IV3SwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: 3000,
                recipient: msg.sender,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        amountOut = swapRouter02.exactInputSingle(params);
    }
}