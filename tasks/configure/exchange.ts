import { task } from "hardhat/config";
import { IDeployment } from "../utils";
import { TaskArguments } from "hardhat/types";
import deployment from "../../deployment/deployments.json";
import { Exchange } from "../../typechain";
import { deployNames } from "../constants";

const deployments: IDeployment = deployment;

task("configure:exchange").setAction(async function (
  _taskArguments: TaskArguments,
  hre
) {
  const network = await hre.getChainId();

  const factoryDeployed = deployments[network][deployNames.FACTORY];
  const exchangeDeployed = deployments[network][deployNames.EXCHANGE];

  const exchange = (await hre.ethers.getContractAt(
    deployNames.EXCHANGE,
    exchangeDeployed.address
  )) as Exchange;

  await exchange.setFactory(factoryDeployed.address);
});
