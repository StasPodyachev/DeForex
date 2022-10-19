const hre = require("hardhat");

import {
  abi as SWAP_ROUTER_ABI,
  bytecode as SWAP_ROUTER_BYTECODE,
} from "@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json";

import { AlphaRouter, ChainId } from "@uniswap/smart-order-router";
import { ethers } from "ethers";
import { Token, CurrencyAmount, Percent, TradeType } from "@uniswap/sdk-core";

// const hre: any = hardhat;

const router = new AlphaRouter({
  chainId: 5,
  provider: new ethers.providers.JsonRpcProvider(
    "https://goerli.infura.io/v3/8d74aa62de8e44f1807e65f4ba122e8d"
  ),
});

const DAI = new Token(
  ChainId.GÖRLI,
  "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
  18,
  "DAI",
  "DAI"
);

const USDC = new Token(
  ChainId.GÖRLI,
  "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C",
  6,
  "USDC",
  "USD//C"
);

const amount = CurrencyAmount.fromRawAmount(DAI, "1000000000000000000");

async function main() {
  const network = await hre.getChainId();

  const route = await router.route(amount, USDC, TradeType.EXACT_INPUT, {
    recipient: "0xF552f5223D3f7cEB580fA92Fe0AFc6ED8c09179b",
    slippageTolerance: new Percent(5, 100),
    deadline: Math.floor(Date.now() / 1000 + 1800),
  });

  console.log(route);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
