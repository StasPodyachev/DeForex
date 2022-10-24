// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;

import './interfaces/IAlpDeployer.sol';

import './ALP.sol';

contract AlpDeployer is IAlpDeployer {
    struct Parameters {
        address factory;
        address token0;
        address token1;
    }

    /// @inheritdoc IAlpDeployer
    Parameters public override parameters;

    /// @dev Deploys a pool with the given parameters by transiently setting the parameters storage slot and then
    /// clearing it after deploying the pool.
    /// @param factory The contract address of the Uniswap V3 factory
    /// @param token0 The first token of the pool by address sort order
    /// @param token1 The second token of the pool by address sort order
    function deploy(
        address factory,
        address token0,
        address token1
    ) internal returns (address pool) {
        parameters = Parameters({factory: factory, token0: token0, token1: token1});
        pool = address(new ALP{salt: keccak256(abi.encode(token0, token1))}());
        delete parameters;
    }
}