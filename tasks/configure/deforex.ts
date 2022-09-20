import { task } from "hardhat/config";
import { IDeployment } from "../utils";
import { TaskArguments } from "hardhat/types";
import deployment from "../../deployment/deployments.json";
import { Deforex } from "../../typechain";
import { deployNames } from "../constants";

const deployments: IDeployment = deployment;

task("configure:deforex").setAction(async function (
  _taskArguments: TaskArguments,
  hre
) {
  const network = await hre.getChainId();

  const deforexDeployed = deployments[network][deployNames.DEFOREX];
  const factoryDeployed = deployments[network][deployNames.FACTORY];
  const exchangeDeployed = deployments[network][deployNames.EXCHANGE];

  const deforex = (await hre.ethers.getContractAt(
    "Deforex",
    deforexDeployed.address
  )) as Deforex;

  await deforex.setFactory(factoryDeployed.address);
  await deforex.setExchange(exchangeDeployed.address);
});
