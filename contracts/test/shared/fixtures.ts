import { Fixture } from 'ethereum-waffle'
import { Factory } from '../../typechain/Factory'
import { ethers } from 'hardhat'
import { TestERC20 } from '../../typechain/TestERC20'
import { BigNumber } from 'ethers'
import { Exchange } from '../../typechain/Exchange'
import { UniswapExchange } from '../../typechain/UniswapExchange'
import { swapRouterFixture } from './externalFixture'
import { ALP } from '../../typechain/ALP'
import { TestAlpDeployer } from '../../typechain/TestAlpDeployer'
import { Deforex } from '../../typechain'


interface FactoryFixture {
    factory: Factory
}

async function factoryFixture(): Promise<FactoryFixture> {
    const factoryFactory = await ethers.getContractFactory('Factory')
    const factory = (await factoryFactory.deploy()) as Factory
    return { factory }
}

interface TokensFixture {
    token0: TestERC20
    token1: TestERC20
    token2: TestERC20
}

async function tokensFixture(): Promise<TokensFixture> {
    const tokenFactory = await ethers.getContractFactory('TestERC20')
    const tokenA = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20
    const tokenB = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20
    const tokenC = (await tokenFactory.deploy(BigNumber.from(2).pow(255))) as TestERC20

    const [token0, token1, token2] = [tokenA, tokenB, tokenC].sort((tokenA, tokenB) =>
        tokenA.address.toLowerCase() < tokenB.address.toLowerCase() ? -1 : 1
    )

    return { token0, token1, token2 }
}

interface ExchangeFixture {
    exchange: Exchange
}

async function exchangeFixture(): Promise<ExchangeFixture> {
    const { factory } = await factoryFixture()

    const exchangeFactory = await ethers.getContractFactory('Exchange')
    const exchange = (await exchangeFactory.deploy()) as Exchange

    exchange.setFactory(factory.address)

    return { exchange }
}

interface UniswapExchangeFixture {
    exchange: UniswapExchange
}

export const uniswapExchangeFixture: Fixture<UniswapExchangeFixture> = async ([wallet], provider) => {
    const { swapRouter } = await swapRouterFixture([wallet], provider)

    const exchangeFactory = await ethers.getContractFactory('UniswapExchange')
    const exchange = (await exchangeFactory.deploy([swapRouter])) as UniswapExchange

    return { exchange }
}

type TokensAndFactoryFixture = FactoryFixture & TokensFixture

interface ALPFixture extends TokensAndFactoryFixture {
    createAlp(
        firstToken?: TestERC20,
        secondToken?: TestERC20
    ): Promise<ALP>
}

export const alpFixture: Fixture<ALPFixture> = async function (): Promise<ALPFixture> {
    const { factory } = await factoryFixture()
    const { token0, token1, token2 } = await tokensFixture()

    const AlpDeployerFactory = await ethers.getContractFactory('TestAlpDeployer')
    const ALPFactory = await ethers.getContractFactory('ALP')

    return {
        token0,
        token1,
        token2,
        factory,
        createAlp: async (firstToken = token0, secondToken = token1) => {
            const alpDeployer = (await AlpDeployerFactory.deploy()) as TestAlpDeployer

            const tx = await alpDeployer.deploy(factory.address, firstToken.address, secondToken.address)

            const receipt = await tx.wait()
            const poolAddress = receipt.events?.[0].args?.pool as string

            return ALPFactory.attach(poolAddress) as ALP
        }
    }
}

interface DeforexFixture {
    deforex: Deforex
}

async function deforexFixture(): Promise<DeforexFixture> {
    const { factory } = await factoryFixture()
    const { exchange } = await exchangeFixture()

    const deforexFactory = await ethers.getContractFactory('Deforex')
    const deforex = (await deforexFactory.deploy()) as Deforex

    deforex.setFactory(factory.address)
    deforex.setExchange(exchange.address)

    return { deforex }
}