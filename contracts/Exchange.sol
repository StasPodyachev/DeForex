// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.9;
pragma abicoder v2;

import "./interfaces/IExchange.sol";

abstract contract Exchange is
    IExchange
{
    function swap(IExchange.SwapParams memory params) virtual external  {
        
    }
}