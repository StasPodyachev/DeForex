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
    args: ["0xE592427A0AEce92De3Edee1F18E0157C05861564"],
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

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
