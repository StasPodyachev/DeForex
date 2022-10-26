import { ethers, waffle } from 'hardhat'
import { BigNumber, BigNumberish, constants, ContractFactory, Wallet } from 'ethers'
import { TestERC20 } from '../typechain/TestERC20';
import { Factory } from '../typechain/Factory';
import { ALP } from '../typechain/ALP';
import { expect, use } from 'chai'
import { deforexFixture } from './shared/fixtures'
import { Deforex } from '../typechain/Deforex';

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

const createFixtureLoader = waffle.createFixtureLoader

describe('Deforex', () => {
    let wallet: Wallet, other: Wallet

    let token0: TestERC20
    let token1: TestERC20
    let token2: TestERC20

    let factory: Factory
    let deforex: Deforex
    let alp: ALP
    let ALPFactory: ContractFactory;

    let loadFixture: ReturnType<typeof createFixtureLoader>
    //let createAlp: ThenArg<ReturnType<typeof deforexFixture>>['createAlp']


    before('create fixture loader', async () => {
        ;[wallet, other] = await (ethers as any).getSigners()
        loadFixture = createFixtureLoader([wallet, other])

        ALPFactory = await ethers.getContractFactory('ALP');
    })

    beforeEach('deploy fixture', async () => {
        ; ({ token0, token1, token2, factory, deforex } = await loadFixture(deforexFixture))

        await factory.createAlp(token0.address, token1.address)
        let alpAddress = await factory.getAlp(token0.address, token1.address)
        alp = ALPFactory.attach(alpAddress) as ALP

        await token0.approve(alpAddress, constants.MaxUint256)
        await token1.approve(alpAddress, constants.MaxUint256)

        await alp.deposit(constants.MaxUint256.div(5), constants.MaxUint256.div(5));

        await token0.approve(deforex.address, constants.MaxUint256)
        await token1.approve(deforex.address, constants.MaxUint256)
        await token2.approve(deforex.address, constants.MaxUint256)
    })

    describe('#createPosition', () => {
        it('success cases', async () => {
            const amount: number = 10;
            const leverage: number = 10;

            const oldBalanceToken0 = await token0.balanceOf(wallet.address)
            const oldBalanceToken1 = await token1.balanceOf(wallet.address)

            await deforex.createPosition(token0.address, token1.address, amount, leverage, "0x");

            const balanceToken0 = await token0.balanceOf(wallet.address)
            const balanceToken1 = await token1.balanceOf(wallet.address)

            expect(balanceToken0).to.eq(oldBalanceToken0.sub(amount));
            expect(balanceToken1).to.eq(oldBalanceToken1.sub(amount));
        })

    })
})

