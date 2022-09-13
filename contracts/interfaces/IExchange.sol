// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IExcange {
    struct SwapParams{
        uint256 type_;
    }

    function swap(SwapParams memory params) external;
}