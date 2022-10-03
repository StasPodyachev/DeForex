// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.9;
pragma abicoder v2;

import "./Exchange.sol";
import "interfaces/IDeBridgeGate.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/lib/contracts/libraries/TransferHelper.sol";

contract DebridgeExchange is
    Exchange
{
    IDebridge public immutable deBridge;
    IUniswapV2Router02 public immutable router;

    bytes DEF_PERMIT = '0x';
    bool DEF_USE_ASSET_FEE = false;
    uint32 DEF_REFRAL_CODE = 0;
    bytes DEF_AUTO_PARAMS = '0x';


    constructor(address bridge, address router_) {
        deBridge = IDebridge(bridge);
        router = router_;
    }

    // const gateSendArguments: GateSendArguments = {
    //     tokenAddress: process.env.TOKEN_ADDRESS as string,
    //     amount: toWei(amount),
    //     chainIdTo,
    //     receiver: senderAddress,
    // }

    //   function send(
    //     address _tokenAddress,
    //     uint256 _amount,
    //     uint256 _chainIdTo,
    //     bytes memory _receiver,
    //     bytes memory _permit,
    //     bool _useAssetFee,
    //     uint32 _referralCode,
    //     bytes calldata _autoParams
    // ) external payable;

    function swap(IExchange.SwapParams memory params) {
        require(msg.value > 0, "DebridgeExchange: msg.value must be not empty");

        safeTransferWithApprove(amountIn, address(deBridge));
    
        // const autoParamsTo = ['tuple(uint256 executionFee, uint256 flags, bytes fallbackAddress, bytes data)'];
        // const autoParams = ethers.utils.defaultAbiCoder.encode(autoParamsTo, [[
        //     normalizeToDecimals(executionFee, decimalsMultiplierForSentToken).toString(),
        //     parseInt('100', 2), // set only PROXY_WITH_SENDER flag, see Flags.sol and CallProxy.sol
        //     web3To.eth.accounts.privateKeyToAccount(SENDER_PRIVATE_KEY).address,
        //     callToUniswapRouterEncoded,
        // ]]);

        bytes autoParams = abi.encode([10**18, '1100100', msg.sender, callToUniswapRouterEncoded(params.user, params.amount)]);

        deBridge.send(params.token, params.amount, block.chainid, msg.sender, DEF_PERMIT, DEF_USE_ASSET_FEE, DEF_REFRAL_CODE, autoParams);
    }

    function callToUniswapRouterEncoded(address sender, uint256 amount) returns(string result){
        
        // TODO: generate path for swap
        
        uint[] memory amounts = router.swapExactTokensForTokens();
        return '';
    }

    function safeTransferWithApprove(uint256 amountIn, address routerAddress)
        internal
    {
        TransferHelper.safeTransferFrom(
            DAI,
            msg.sender,
            address(this),
            amountIn
        );

        TransferHelper.safeApprove(DAI, routerAddress, amountIn);
    }
}
