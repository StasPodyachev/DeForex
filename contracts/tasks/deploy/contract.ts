import { task } from "hardhat/config";
import { recordAllDeployments } from "../utils";
import fs from "fs";
import { TaskArguments } from "hardhat/types";

task("deploy:contract")
  .addParam("contractName")
  .setAction(async function (_taskArguments: TaskArguments, hre) {
    const network = await hre.getChainId();
    const contractFactory = await hre.ethers.getContractFactory(
      _taskArguments.nameFile ?? _taskArguments.contractName
    );

    console.log(`Contract for deployment Started`);

    let contract;

    if (_taskArguments.args) {
      contract = await contractFactory.deploy(..._taskArguments.args);
    } else {
      contract = await contractFactory.deploy();
    }

    console.log("Contract Deployment Ended");
    console.log("***************************************");

    const writeData = await recordAllDeployments(
      network,
      _taskArguments.contractName,
      "",
      contract.address
    );
    fs.writeFileSync(
      "./deployment/deployments.json",
      JSON.stringify(writeData)
    );
  });
