// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.9;

import "@uniswap/lib/contracts/libraries/TransferHelper.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ALP {
    address public factory;
    address public token0;
    address public token1;

    uint256 private reserve0;           
    uint256 private reserve1;           

    uint private unlocked = 1;
    uint private constant LEVERAGE = 100;

    mapping(address => uint256[2]) public balanceOf;

    modifier lock() {
        require(unlocked == 1, 'ALP: LOCKED');
        unlocked = 0;
        _;
        unlocked = 1;
    }

    function getReserves() public view returns (uint256 _reserve0, uint256 _reserve1) {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
    }

    event Deposit(address indexed sender, uint val0, uint val1, uint balance0, uint balance1);
    event Withdraw(address indexed sender, uint val0, uint val1, uint balance0, uint balance1);
    event Sync(uint256 reserve0, uint256 reserve1);

    constructor() {
        factory = msg.sender;
    }

    // called once by the factory at time of deployment
    function initialize(address _token0, address _token1) external {
        require(msg.sender == factory, 'ALP: FORBIDDEN'); // sufficient check
        token0 = _token0;
        token1 = _token1;
    }

    function requestReserve(uint256 leverage, uint256 amount, address token) external returns(uint256 val, uint256 leverageAv){
        require(leverage <= LEVERAGE, "ALP: too much leverage");

        leverageAv = leverage - 1;
        val = amount * leverageAv;
        
        uint256 reserve = token == token0 ? reserve0: reserve1;

        require(reserve > val, "ALP: Insufficient funds in reserve");

        TransferHelper.safeApprove(token, msg.sender, val);
        TransferHelper.safeTransfer(token, msg.sender, val);

        if(token0 == token){
            reserve0 -= val;
        }else{
            reserve1 -= val;
        }

        emit Sync(reserve0, reserve1);
    }

    function deposit(uint val0, uint256 val1) external {
      TransferHelper.safeTransferFrom(token0, msg.sender, address(this), val0);
      TransferHelper.safeTransferFrom(token1, msg.sender, address(this), val1);

      reserve0 += val0;
      reserve1 += val1;

      uint256[2] storage balance = balanceOf[msg.sender];
      balance[0] += val0;
      balance[1] += val1;

      emit Deposit(msg.sender, val0, val1, balance[0], balance[1]);
      emit Sync(reserve0, reserve1);
    }

    function withdraw(uint val0, uint val1) external {

      uint256[2] storage balance = balanceOf[msg.sender];
      
      require(balance[0]>=val0, "ALP: Insufficient balance for token0");
      require(balance[1]>=val1, "ALP: Insufficient balance for token1");

      balance[0] -= val0;
      balance[1] -= val1;

      reserve0 -= val0;
      reserve1 -= val1;

      TransferHelper.safeTransfer(token0, msg.sender, val0);
      TransferHelper.safeTransfer(token1, msg.sender, val1);

      emit Withdraw(msg.sender, val0, val1, balance[0], balance[1]);
      emit Sync(reserve0, reserve1);
    }
}