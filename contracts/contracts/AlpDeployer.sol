// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;

import "./interfaces/IAlpDeployer.sol";

import "./ALP.sol";

contract AlpDeployer is IAlpDeployer {
    struct Parameters {
        address factory;
        address token;
    }

    /// @inheritdoc IAlpDeployer
    Parameters public override parameters;

    /// @dev Deploys a pool with the given parameters by transiently setting the parameters storage slot and then
    /// clearing it after deploying the pool.
    /// @param factory The contract address of the Uniswap V3 factory
    /// @param token The token of the pool
    function deploy(address factory, address token)
        internal
        returns (address pool)
    {
        parameters = Parameters({factory: factory, token: token});
        pool = address(new ALP{salt: keccak256(abi.encode(token))}());
        delete parameters;
    }
}
