const hre = require("hardhat");

import { IDeployment } from "../tasks/utils";
import deployment from "../deployment/deployments.json";

const deployments: IDeployment = deployment;

// const hre: any = hardhat;

const contracts = [
  {
    contractName: "Factory",
  },
  {
    contractName: "Deforex",
  },
  {
    contractName: "Exchange",
  },
  {
    contractName: "UniswapExchange",
    args: ["0x8DB3b09D50CA3E303A06d993A210ab61eB9f6Ea3"],
  },
  {
    contractName: "ALP",
  },
];

async function main() {
  const network = await hre.getChainId();

  for (let i in contracts) {
    const contract = contracts[i];

    const address = deployments[network][contract.contractName].address;

    await hre.run("verify:verify", {
      address,
      constructorArguments: contract.args ?? [],
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
