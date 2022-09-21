import { task } from "hardhat/config";
import { IDeployment } from "../utils";
import { TaskArguments } from "hardhat/types";
import deployment from "../../deployment/deployments.json";
import { Deforex, Factory, IERC20 } from "../../typechain";
import { BIG_1E18, deployNames } from "../constants";
import readline from "readline";

var rl = readline.createInterface(process.stdin, process.stdout);

import IERC20_JSON from "../../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json";

const deployments: IDeployment = deployment;

task("dev:order").setAction(async function (
  _taskArguments: TaskArguments,
  hre
) {
  const network = await hre.getChainId();

  const deforexDeployment = deployments[network][deployNames.DEFOREX];
  const factoryDeployment = deployments[network][deployNames.FACTORY];

  const factory = (await hre.ethers.getContractAt(
    deployNames.FACTORY,
    factoryDeployment.address
  )) as Factory;

  const addr = await factory.getExchange(0);

  console.log(addr);

  const deforex = (await hre.ethers.getContractAt(
    deployNames.DEFOREX,
    deforexDeployment.address
  )) as Deforex;

  const dai = (await hre.ethers.getContractAt(
    IERC20_JSON.abi,
    "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60"
  )) as IERC20;

  const usdc = (await hre.ethers.getContractAt(
    IERC20_JSON.abi,
    "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C"
  )) as IERC20;

  const amount = BigInt(5) * BIG_1E18;

  await dai.approve(deforex.address, amount);

  await deforex.createPosition(dai.address, usdc.address, amount, 90, 0);
});
