// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IFactory.sol";
import "./ALP.sol";

contract Factory is IFactory, Ownable {
    
    address public override owner;
    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    event AlpCreated(address indexed token0, address indexed token1, address pair, uint);

    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }

    function createAlp(address tokenA, address tokenB) external returns (address pair) {
        require(tokenA != tokenB, 'Factory: IDENTICAL_ADDRESSES');
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address(0), 'Factory: ZERO_ADDRESS');
        require(getPair[token0][token1] == address(0), 'Factory: PAIR_EXISTS'); // single check is sufficient
        bytes memory bytecode = type(ALP).creationCode;
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        assembly {
            pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
        }
        ALP(pair).initialize(token0, token1);
        getPair[token0][token1] = pair;
        getPair[token1][token0] = pair; // populate mapping in the reverse direction
        allPairs.push(pair);
        emit AlpCreated(token0, token1, pair, allPairs.length);
    }

    function setOwner(address _owner) external override {
        require(msg.sender == owner);
        emit OwnerChanged(owner, _owner);
        owner = _owner;
    }
}