// import "hardhat-typechain";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-contract-sizer";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "hardhat-abi-exporter";
import "hardhat-gas-reporter";
import "solidity-coverage";
import * as dotenv from "dotenv";

// import "./tasks/deploy";
// import "./tasks/deployAll";

// import "./tasks/configure";
// import "./tasks/configureAll";

// import "./tasks/dev";

import "@nomiclabs/hardhat-etherscan";

dotenv.config();

const config = {
  networks: {
    hardhat: {
      accounts: {
        mnemonic: process.env.MNEMONIC,
      },
      allowUnlimitedContractSize: true,
      chainId: 2,
      mining: {
        auto: true,
        interval: 100,
      },
    },
    "optimism-kovan": {
      url:
        process.env.TESTNET_PROVIDER_URL ||
        "https://opt-kovan.g.alchemy.com/v2/GAcaN3sfNl9B_d_Ef86aQBa62lh7tCdV",
      chainId: 69,
      accounts: [process.env.TESTNET_DEPLOY_PRIVATE_KEY || ""],
    },
  },
  abiExporter: {
    path: "build/contracts",
    clear: false,
    flat: true,
    // only: [],
    // except: []
  },
  gasReporter: {
    coinmarketcap: "",
    currency: "ETH",
  },
  defaultNetwork: "hardhat",
  mocha: {
    timeout: 100000,
  },
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  // contractSizer: {
  //   alphaSort: true,
  //   runOnCompile: true,
  //   disambiguatePaths: false,
  // },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
};

export default config;
