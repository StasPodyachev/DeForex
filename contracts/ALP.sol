pragma solidity ^0.8.9;

contract ALP {
    bytes4 private constant SELECTOR = bytes4(keccak256(bytes('transfer(address,uint256)')));

    address public factory;
    address public token0;
    address public token1;

    uint256 private reserve0;           
    uint256 private reserve1;           
    uint32  private blockTimestampLast;

    uint private unlocked = 1;
    uint private constant LEVERAGE = 100;

    modifier lock() {
        require(unlocked == 1, 'ALP: LOCKED');
        unlocked = 0;
        _;
        unlocked = 1;
    }

    function getReserves() public view returns (uint256 _reserve0, uint256 _reserve1, uint32 _blockTimestampLast) {
        _reserve0 = reserve0;
        _reserve1 = reserve1;
        _blockTimestampLast = blockTimestampLast;
    }

    function _safeTransfer(address token, address to, uint value) private {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(SELECTOR, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'ALP: TRANSFER_FAILED');
    }

    event Deposit(address indexed sender, address token, uint val);
    event Withdraw(address indexed sender, address token, uint val);
    event Sync(uint256 reserve0, uint256 reserve1);

    constructor() public {
        factory = msg.sender;
    }

    // called once by the factory at time of deployment
    function initialize(address _token0, address _token1) external {
        require(msg.sender == factory, 'ALP: FORBIDDEN'); // sufficient check
        token0 = _token0;
        token1 = _token1;
    }

    function requestReserve(uint256 leverage, uint256 amount, address token) internal{
        require(leverage <= LEVERAGE, "ALP: too much leverage");

        uint256 val = amount * (leverage - 1);
        uint256 reserve = token == token0 ? reserve0: reserve1;

        require(reserve > val, "ALP: Insufficient funds in reserve");
        _safeTransfer(token, msg.sender, val);

        if(token0 == token){
            reserve0 -= val;
        }else{
            reserve1 -= val;
        }
    }

    function deposit(address token, uint val) external {
      require(token == token0 || token == token1, "ALP: Token don't support");

      _safeTransfer(token, msg.sender, val);

      if(token0 == token){
        reserve0 += val;
      }else{
        reserve1 += val;
      }

      emit Deposit(msg.sender, token, val);
      emit Sync(reserve0, reserve1);
    }

    function withdraw(address token, uint val) external {
      require(token == token0 || token == token1, "ALP: Token don't support");

      _safeTransfer(token, msg.sender, val);

      if(token0 == token){
        reserve0 -= val;
      }else{
        reserve1 -= val;
      }

      emit Withdraw(msg.sender, token, val);
      emit Sync(reserve0, reserve1);
    }
}