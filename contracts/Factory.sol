// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IFactory.sol";
import "./ALP.sol";

contract Factory is IFactory, Ownable {
    
    address public override owner;
    mapping(address => mapping(address => address)) internal alpsMap;
    address[] public alps;

    event AlpCreated(address indexed token0, address indexed token1, address alp, uint);

    function countAlp() external view returns (uint) {
        return alps.length;
    }

    function getAlp(address tokenA, address tokenB){
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);

        return alpsMap[token0][token1];
    }

    // TODO: register Exchanges and other  

    function createAlp(address tokenA, address tokenB) external returns (address alp) {
        require(tokenA != tokenB, 'Factory: IDENTICAL_ADDRESSES');
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'Factory: ZERO_ADDRESS');
        require(alpsMap[token0][token1] == address(0), 'Factory: ALP_EXIST'); // single check is sufficient
        bytes memory bytecode = type(ALP).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            alp := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        ALP(alp).initialize(token0, token1);
        alpsMap[token0][token1] = alp;
        alpsMap[token1][token0] = alp; // populate mapping in the reverse direction
        alps.push(alp);
        emit AlpCreated(token0, token1, alp, alps.length);
    }

    function setOwner(address _owner) external override {
        require(msg.sender == owner);
        emit OwnerChanged(owner, _owner);
        owner = _owner;
    }
}