const hre = require("hardhat");
import { deployNames } from "./constants";
import deployment from "../deployment/deployments.json";
import { Deforex, Exchange } from "../typechain";
const deployments: IDeployment = deployment;

let NETWORK: string;

const contracts = [
  {
    name: "factory",
    contractName: "Factory",
    f: factory,
  },
  {
    name: "deforex",
    contractName: "Deforex",
    f: deforex,
  },
  {
    name: "exchange",
    contractName: "Exchange",
    f: exchange,
  },
];

async function main() {
  NETWORK = await hre.getChainId();
  for (let i in contracts) {
    const contract = contracts[i];

    console.log(`configuring ${contract.contractName} started`);

    await hre.run(`configure:${contract.name}`);

    console.log(`${contract.contractName} configured success`);
    console.log("-------------------------------------------");
  }
}

async function factory() {
  const factoryDeployed = deployments[NETWORK].Factory;
  const uniswapExchange = deployments[NETWORK][deployNames.UNISWAP_EXCHANGE];
  const daiDeployed = deployments[NETWORK].DAI;
  const usdtDeployed = deployments[NETWORK].USDT;
  const usdcDeployed = deployments[NETWORK].USDC;

  const factory = await hre.ethers.getContractAt(
    "Factory",
    factoryDeployed.address
  );

  // 0 - UNISWAP
  // 1 - 1INCH

  await factory.createAlp(daiDeployed.address, usdtDeployed.address); // DAI/USDT
  await factory.createAlp(daiDeployed.address, usdcDeployed.address); // DAI/USDC

  await factory.registerExchange(0, uniswapExchange.address);
}

async function exchange() {
  const factoryDeployed = deployments[NETWORK][deployNames.FACTORY];
  const exchangeDeployed = deployments[NETWORK][deployNames.EXCHANGE];

  const exchange = (await hre.ethers.getContractAt(
    deployNames.EXCHANGE,
    exchangeDeployed.address
  )) as Exchange;

  await exchange.setFactory(factoryDeployed.address);
}

async function deforex() {
  const deforexDeployed = deployments[NETWORK][deployNames.DEFOREX];
  const factoryDeployed = deployments[NETWORK][deployNames.FACTORY];
  const exchangeDeployed = deployments[NETWORK][deployNames.EXCHANGE];

  const deforex = (await hre.ethers.getContractAt(
    "Deforex",
    deforexDeployed.address
  )) as Deforex;

  await deforex.setFactory(factoryDeployed.address);
  await deforex.setExchange(exchangeDeployed.address);
}
