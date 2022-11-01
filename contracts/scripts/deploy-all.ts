const hre = require('hardhat')
import { TaskArguments } from 'hardhat/types'
import { deployNames } from './constants'
import { IDeployment, writeDeployData } from '../scripts/utils'
import deployment from '../deployment/deployments.json'
const deployments: IDeployment = deployment

interface ContractDeploy {
  contractName: string
  nameFile?: string
  args?: any
}

const contracts: ContractDeploy[] = [
  {
    contractName: 'Factory',
  },
  {
    contractName: 'Deforex',
  },
  {
    contractName: 'Exchange',
  },
  {
    contractName: 'UniswapExchange',
    args: ['0x8DB3b09D50CA3E303A06d993A210ab61eB9f6Ea3'],
  },
]

async function main() {
  for (let i in contracts) {
    const contract = contracts[i]

    console.log(`deploying ${contract.contractName} started`)

    await deployContract(
      contract.contractName,
      contract.nameFile,
      contract.args
    )

    console.log(`${contract.contractName} deployed success`)
    console.log('-------------------------------------------')
  }
}

export async function deployContract(
  contractName: string,
  nameFile?: string,
  args?: any
) {
  const network = await hre.getChainId()
  const contractFactory = await hre.ethers.getContractFactory(
    nameFile ?? contractName
  )

  console.log(`Contract for deployment Started`)

  let contract

  if (args) {
    contract = await contractFactory.deploy(...args)
  } else {
    contract = await contractFactory.deploy()
  }

  await writeDeployData(network, contractName, '', contract.address)

  console.log('Contract Deployment Ended')
  console.log('***************************************')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
