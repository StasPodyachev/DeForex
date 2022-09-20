// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.9;
pragma abicoder v2;

import "./interfaces/IExchange.sol";
import "./interfaces/IFactory.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract Exchange is
    IExchange, Ownable
{
    IFactory public _factory;

    function setFactory(IFactory factory) external{
        _factory = factory;
    }

    function swap(IExchange.SwapParams memory params) virtual external returns (uint256 amountIn, uint256 amountOut) {
        // maybe check best DEX

        IExchange exchange = _factory.getExchange(DEX.UNISWAP);

        require(address(exchange) != address(0), "Exchange: ZERO_ADDRESS");

        (amountIn, amountOut) = exchange.swap(params);
    }
}