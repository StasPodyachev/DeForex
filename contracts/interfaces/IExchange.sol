// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IExchange {

     enum DEX {
        UNISWAP,
        ONE_INCH,
        DE_SWAP
    }

    struct SwapParams{
        uint256 type_;
        DEX dex;
    }

    function swap(SwapParams memory params) external;
}