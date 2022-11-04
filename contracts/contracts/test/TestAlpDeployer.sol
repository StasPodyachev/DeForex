// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./../interfaces/IAlpDeployer.sol";
import "./../ALP.sol";

contract TestAlpDeployer is IAlpDeployer {
    struct Parameters {
        address factory;
        address token;
    }

    event PoolDeployed(address pool);

    Parameters public override parameters;

    function deploy(address factory, address token)
        external
        returns (address pool)
    {
        parameters = Parameters({factory: factory, token: token});
        pool = address(new ALP{salt: keccak256(abi.encode(token))}());

        emit PoolDeployed(pool);
        delete parameters;
    }
}
