// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.9;
pragma abicoder v2;

import "@uniswap/lib/contracts/libraries/TransferHelper.sol";
import "./../interfaces/ISwapRouter02.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract TestSwapRouter02 is ISwapRouter02 {
    uint256 num;
    uint256 den;

    function setRate(uint256 num_, uint256 den_) external {
        num = num_;
        den = den_;
    }

    function exactInputSingle(ExactInputSingleParams calldata params)
        external
        payable
        returns (uint256 amountOut)
    {
        TransferHelper.safeTransferFrom(
            params.tokenIn,
            msg.sender,
            address(this),
            params.amountIn
        );
        amountOut = (params.amountIn * num) / den; // params.amountIn * rate = < 1

        TransferHelper.safeTransfer(
            params.tokenOut,
            params.recipient,
            amountOut
        );
    }

    function exactInput(ExactInputParams calldata params)
        external
        payable
        returns (uint256 amountOut)
    {}

    function exactOutputSingle(ExactOutputSingleParams calldata params)
        external
        payable
        returns (uint256 amountIn)
    {}

    function exactOutput(ExactOutputParams calldata params)
        external
        payable
        returns (uint256 amountIn)
    {}
}
