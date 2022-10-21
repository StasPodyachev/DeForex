import { task } from "hardhat/config";
import { IDeployment } from "../utils";
import { TaskArguments } from "hardhat/types";
import { ALP, IERC20 } from "../../typechain";
import { BIG_1E18, BIG_1E6, deployNames } from "../constants";

import { ethers } from "ethers";

const IERC20_JSON = require("../../data/abi/IERC20.json");
const deployments: IDeployment = require("../../deployment/deployments.json");

task("dev:deposit").setAction(async function (
  _taskArguments: TaskArguments,
  hre
) {
  const network = await hre.getChainId();

  const alpDeployed = deployments[network]["ALP"];
  const daiDeployed = deployments[network].DAI;
  const usdtDeployed = deployments[network].USDT;
  const usdcDeployed = deployments[network].USDC;

  // 0xf3cc0d1aa68d2f15cd99862bd5f58bdc0657486d - alp
  // 0x7850d400366ce643bdb2fefb2315e7e15cc84ed1
  // 0xb2ee4d34b28d06f3b0e717ec874e18de134232b4
  // 0xd13fb1fcb425327f51ef80e5cb622f6b4454f8a8

  const alp = (await hre.ethers.getContractAt(
    "ALP",
    alpDeployed.address
  )) as ALP;

  const dai = (await hre.ethers.getContractAt(
    IERC20_JSON,
    daiDeployed.address
  )) as IERC20;

  const usdc = (await hre.ethers.getContractAt(
    IERC20_JSON,
    usdcDeployed.address
  )) as IERC20;

  let tx = await dai.approve(alp.address, BigInt(20000) * BIG_1E18);
  await tx.wait();
  tx = await usdc.approve(alp.address, ethers.constants.MaxUint256);
  await tx.wait();

  console.log("deposit ...");

  tx = await alp.deposit(BigInt(20000) * BIG_1E18, BigInt(20000) * BIG_1E18);

  await tx.wait();
  const result = await alp.getReserves();

  console.log(
    "reserves",
    result._reserve0.toString(),
    result._reserve1.toString()
  );
});
