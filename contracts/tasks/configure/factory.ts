import { task } from "hardhat/config";
import { IDeployment } from "../utils";
import { TaskArguments } from "hardhat/types";
import deployment from "../../deployment/deployments.json";
import { deployNames } from "../constants";
const deployments: IDeployment = deployment;

task("configure:factory").setAction(async function (
  _taskArguments: TaskArguments,
  hre
) {
  const network = await hre.getChainId();

  const factoryDeployed = deployments[network].Factory;
  const uniswapExchange = deployments[network][deployNames.UNISWAP_EXCHANGE];
  const daiDeployed = deployments[network].DAI;
  const usdtDeployed = deployments[network].USDT;
  const usdcDeployed = deployments[network].USDC;

  const factory = await hre.ethers.getContractAt(
    "Factory",
    factoryDeployed.address
  );

  // 0 - UNISWAP
  // 1 - 1INCH

  // await factory.createAlp(daiDeployed.address, usdtDeployed.address); // DAI/USDT
  // await factory.createAlp(daiDeployed.address, usdcDeployed.address); // DAI/USDC

  await factory.registerExchange(0, uniswapExchange.address);
});
