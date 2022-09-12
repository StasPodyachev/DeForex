// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IFactory.sol";
import "./interfaces/IDeforex.sol";

import "hardhat/console.sol";

abstract contract Deforex is IDeforex, Ownable {

}
