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

  const factory = await hre.ethers.getContractAt(
    "Factory",
    factoryDeployed.address
  );

  // 0 - UNISWAP
  // 1 - 1INCH

  // 0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60 - DAI
  // 0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C - USDC

  // await factory.createAlp(
  //   "0xdc31Ee1784292379Fbb2964b3B9C4124D8F89C60",
  //   "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C"
  // ); // DAI/USDC

  await await factory.registerExchange(0, uniswapExchange.address);
});
