// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IAlp {
    event Deposit(address indexed sender, uint256 val);
    event Withdraw(address indexed sender, uint256 val);
    event Sync(uint256 reserve);

    function getReserve() external view returns (uint256 reserve);

    function requestReserve(uint256 leverage, uint256 amount)
        external
        returns (uint256 val, uint256 leverageAv);

    function deposit(uint256 val) external;

    function withdraw(uint256 val) external;

    function addAvailableTokens(address[] calldata tokens) external;

    function removeAvailableTokens(address[] calldata tokens) external;

    function isTokenAvailable(address token) external view returns (bool);
}
