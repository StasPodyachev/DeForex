import { Fixture } from "ethereum-waffle";
import { ethers, waffle } from "hardhat";
import { Contract } from "@ethersproject/contracts";
import { constants } from "ethers";

import {
  abi as SWAP_ROUTER_ABI,
  bytecode as SWAP_ROUTER_BYTECODE,
} from "@uniswap/swap-router-contracts/artifacts/contracts/SwapRouter02.sol/SwapRouter02.json";

export const swapRouterFixture: Fixture<{ swapRouter: Contract }> = async ([
  wallet,
]) => {
  const swapRouter = await waffle.deployContract(wallet, {
    bytecode: SWAP_ROUTER_BYTECODE,
    abi: SWAP_ROUTER_ABI,
  });

  return { swapRouter };
};
