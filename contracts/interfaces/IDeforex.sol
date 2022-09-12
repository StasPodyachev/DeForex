// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IDeforex {
    function createOrder() external payable;

    function closeOrder() external payable;
}
