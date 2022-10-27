// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./../interfaces/IAlpDeployer.sol";
import "./../ALP.sol";

contract TestAlpDeployer is IAlpDeployer {
    struct Parameters {
        address factory;
        address token0;
        address token1;
    }

    event PoolDeployed(address pool);

    Parameters public override parameters;

    function deploy(
        address factory,
        address token0,
        address token1
    ) external returns (address pool) {
        parameters = Parameters({
            factory: factory,
            token0: token0,
            token1: token1
        });
        pool = address(new ALP{salt: keccak256(abi.encode(token0, token1))}());

        emit PoolDeployed(pool);
        delete parameters;
    }
}
