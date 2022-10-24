import { task } from "hardhat/config";
import { IDeployment } from "./utils";
import { TaskArguments } from "hardhat/types";
import { Deforex, Factory, IERC20 } from "../typechain";
import { BIG_1E18, deployNames } from "./constants";
import readline from "readline";

var rl = readline.createInterface(process.stdin, process.stdout);

const IERC20_JSON = require("../../data/abi/IERC20.json");
const deployments: IDeployment = require("../../deployment/deployments.json");

task("dev:order").setAction(async function (
  _taskArguments: TaskArguments,
  hre
) {
  const network = await hre.getChainId();

  const deforexDeployment = deployments[network][deployNames.DEFOREX];
  const factoryDeployment = deployments[network][deployNames.FACTORY];
  const daiDeployed = deployments[network].DAI;
  const usdtDeployed = deployments[network].USDT;
  const usdcDeployed = deployments[network].USDC;

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
    IERC20_JSON,
    daiDeployed.address
  )) as IERC20;

  const amount = BigInt(5) * BIG_1E18;

  let tx = await dai.approve(deforex.address, amount);
  await tx.wait();
  await deforex.createPosition(
    dai.address,
    usdcDeployed.address,
    amount,
    90,
    []
  );
});
