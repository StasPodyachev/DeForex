// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Faucet
 * @dev Very simple ERC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `ERC20` functions.
 * Based on https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.5.1/contracts/examples/SimpleToken.sol
 */
contract Faucet is Ownable {
    uint256 valueToken = 5000;
    uint256 valueETH = 5 * 10**9;

    mapping(address => uint256) internal _nextTime;

    function setValueToken(uint256 value_) external onlyOwner {
        valueToken = value_;
    }

    function setValueETH(uint256 value_) external onlyOwner {
        valueETH = value_;
    }

    function sendTokens(address payable wallet, ERC20 token) external payable {
        uint256 next = _nextTime[wallet];
        require(block.timestamp >= next, "Many request for last 24 hours");

        uint8 decimals = token.decimals();

        token.transfer(wallet, valueToken * 10 ** decimals);

        if (wallet.balance < valueETH && address(this).balance >= valueETH) {
            (bool sent, ) = wallet.call{value: valueETH}("");
            require(sent, "Failed to send Ether");
        }

        _nextTime[wallet] = block.timestamp + 86400;
    }

    receive() external payable {}
}
