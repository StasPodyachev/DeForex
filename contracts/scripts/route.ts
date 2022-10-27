const hre: HardhatRuntimeEnvironment = require("hardhat");

import { abi as QOUTERV2_ABI } from "@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json";

import { BigNumber, ethers } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { QuoterV2 } from "../types/v3";
import { BIG_1E18 } from "./constants";

const amount = BigNumber.from(100000000).mul(BIG_1E18);

async function main() {
  const network = await hre.getChainId();

  const qouterv2 = (await hre.ethers.getContractAt(
    QOUTERV2_ABI,
    "0x61fFE014bA17989E743c5F6cB21bF9697530B21e"
  )) as QuoterV2;

  const { amountOut } = await qouterv2.callStatic.quoteExactInputSingle({
    tokenIn: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    tokenOut: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    amountIn: amount,
    fee: 500,
    sqrtPriceLimitX96: 0,
  });

  console.log({ amountOut: amountOut.toString() });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
