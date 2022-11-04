// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/IFactory.sol";
import "./interfaces/IExchange.sol";
import "./AlpDeployer.sol";
import "./ALP.sol";

contract Factory is IFactory, AlpDeployer {
    address public owner;
    mapping(address => address) private alpsMap;
    mapping(IExchange.DEX => IExchange) private exchanges;
    address[] public alps;

    constructor() {
        owner = msg.sender;
    }

    function countAlp() external view returns (uint256) {
        return alps.length;
    }

    function getAlp(address token) external view returns (address alp) {
        return alpsMap[token];
    }

    function getExchange(IExchange.DEX type_)
        external
        view
        returns (IExchange)
    {
        return exchanges[type_];
    }

    function registerExchange(IExchange.DEX type_, IExchange exchange)
        external
    {
        exchanges[type_] = exchange;
    }

    // TODO: register Exchanges and other

    function createAlp(address token) external returns (address alp) {
        require(token != address(0), "Factory: ZERO_ADDRESS");
        require(alpsMap[token] == address(0), "Factory: ALP_EXIST"); // single check is sufficient

        alp = deploy(address(this), token);

        alpsMap[token] = alp;
        alps.push(alp);
        emit AlpCreated(token, alp, alps.length);
    }

    function setOwner(address _owner) external override {
        require(msg.sender == owner);
        emit OwnerChanged(owner, _owner);
        owner = _owner;
    }
}
