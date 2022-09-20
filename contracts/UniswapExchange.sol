// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.9;
pragma abicoder v2;

import "./Exchange.sol";
import "@uniswap/lib/contracts/libraries/TransferHelper.sol";
import "@uniswap/swap-router-contracts/contracts/interfaces/IV3SwapRouter.sol";

contract UniswapExchange is
    Exchange
{
    IV3SwapRouter public immutable _swapRouter;

    uint24 public constant POOL_FEE = 3000;

    constructor(IV3SwapRouter swapRouter) {
        _swapRouter = swapRouter;
    }

    function swap(IExchange.SwapParams memory params) override external returns (uint256 amountIn, uint256 amountOut) {
        amountIn = 0;
        amountOut = swapExactInputSingle(params.amountIn, params.amountOut, params.tokenIn, params.tokenOut);

        // Return result tokens to Deforex after swap

        TransferHelper.safeTransfer(
            params.tokenOut,
            msg.sender,
            amountOut
        );   
    }

    function safeTransferWithApprove(uint256 amountIn, address routerAddress, address token)
        internal
    {
        TransferHelper.safeTransferFrom(
            token,
            msg.sender,
            address(this),
            amountIn
        );

        TransferHelper.safeApprove(token, routerAddress, amountIn);
    }

    function swapExactInputSingle(uint256 amountIn, uint256 amountOutMinimum, address tokenIn, address tokenOut)
        internal
        returns (uint256 amountOut)
    {
        safeTransferWithApprove(amountIn, address(_swapRouter), tokenIn);

        IV3SwapRouter.ExactInputSingleParams memory params = IV3SwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: POOL_FEE,
                recipient: msg.sender,
                amountIn: amountIn,
                amountOutMinimum: amountOutMinimum,
                sqrtPriceLimitX96: 0
            });

        amountOut = _swapRouter.exactInputSingle(params);
    }

    function swapExactOutputSingle(uint256 amountOut, uint256 amountInMaximum, address tokenIn, address tokenOut) internal returns (uint256 amountIn) {
        // Transfer the specified amount of tokenIn to this contract.
        TransferHelper.safeTransferFrom(tokenIn, msg.sender, address(this), amountInMaximum);

        // Approve the router to spend the specifed `amountInMaximum` of toknIn.
        // In production, you should choose the maximum amount to spend based on oracles or other data sources to acheive a better swap.
        TransferHelper.safeApprove(tokenIn, address(_swapRouter), amountInMaximum);

        IV3SwapRouter.ExactOutputSingleParams memory params =
            IV3SwapRouter.ExactOutputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: POOL_FEE,
                recipient: msg.sender,
                amountOut: amountOut,
                amountInMaximum: amountInMaximum,
                sqrtPriceLimitX96: 0
            });

        // Executes the swap returning the amountIn needed to spend to receive the desired amountOut.
        amountIn = _swapRouter.exactOutputSingle(params);

        // For exact output swaps, the amountInMaximum may not have all been spent.
        // If the actual amount spent (amountIn) is less than the specified maximum amount, we must refund the msg.sender and approve the swapRouter to spend 0.
        if (amountIn < amountInMaximum) {
            TransferHelper.safeApprove(tokenIn, address(_swapRouter), 0);
            TransferHelper.safeTransfer(tokenIn, msg.sender, amountInMaximum - amountIn);
        }
    }
}