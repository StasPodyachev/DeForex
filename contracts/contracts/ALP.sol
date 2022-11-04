// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;

import "@uniswap/lib/contracts/libraries/TransferHelper.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IAlpDeployer.sol";
import "./interfaces/IAlp.sol";
import "hardhat/console.sol";

contract ALP is IAlp {
    address public factory;
    address public _token;

    uint256 private _reserve;

    uint256 private unlocked = 1;
    uint256 private constant LEVERAGE = 100;

    mapping(address => bool) public availableTokens;

    constructor() {
        (factory, _token) = IAlpDeployer(msg.sender).parameters();
    }

    function getReserve() public view returns (uint256 reserve) {
        reserve = _reserve;
    }

    function requestReserve(uint256 leverage, uint256 amount)
        external
        returns (uint256 val, uint256 leverageAv)
    {
        require(leverage <= LEVERAGE, "ALP: too much leverage");

        leverageAv = leverage - 1;
        val = amount * leverageAv;

        require(_reserve > val, "ALP: Insufficient in reserve");

        TransferHelper.safeApprove(_token, msg.sender, val);
        TransferHelper.safeTransfer(_token, msg.sender, val);

        _reserve -= val;

        emit Sync(_reserve);
    }

    function deposit(uint256 val) external {
        TransferHelper.safeTransferFrom(_token, msg.sender, address(this), val);

        _reserve += val;

        emit Deposit(msg.sender, val);
        emit Sync(_reserve);
    }

    function withdraw(uint256 val) external {
        require(_reserve >= val, "ALP: Insufficient reserve for token");

        _reserve -= val;

        TransferHelper.safeTransfer(_token, msg.sender, val);

        emit Withdraw(msg.sender, val);
        emit Sync(_reserve);
    }

    function addAvailableTokens(address[] calldata tokens) external {
        for (uint256 i = 0; i < tokens.length; i++) {
            availableTokens[tokens[i]] = true;
        }
    }

    function removeAvailableTokens(address[] calldata tokens) external {
        for (uint256 i = 0; i < tokens.length; i++) {
            availableTokens[tokens[i]] = false;
        }
    }

    function isTokenAvailable(address token) external view returns (bool) {
        return availableTokens[token];
    }
}
