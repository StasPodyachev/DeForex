import { ethers, waffle } from 'hardhat'
import { BigNumber, BigNumberish, constants, Wallet } from 'ethers'
import { TestERC20 } from '../typechain/TestERC20';
import { Factory } from '../typechain/Factory';
import { ALP } from '../typechain/ALP';
import { expect, use } from 'chai'
import { alpFixture } from './shared/fixtures'

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

const createFixtureLoader = waffle.createFixtureLoader

describe('ALP', () => {
    let wallet: Wallet, other: Wallet

    let token0: TestERC20
    let token1: TestERC20
    let token2: TestERC20

    let factory: Factory
    let alp: ALP

    let loadFixture: ReturnType<typeof createFixtureLoader>
    let createAlp: ThenArg<ReturnType<typeof alpFixture>>['createAlp']

    before('create fixture loader', async () => {
        ;[wallet, other] = await (ethers as any).getSigners()
        loadFixture = createFixtureLoader([wallet, other])
    })

    beforeEach('deploy fixture', async () => {
        ; ({ token0, token1, token2, factory, createAlp } = await loadFixture(alpFixture))

        alp = await createAlp(token0, token1)

        token0.approve(alp.address, constants.MaxUint256)
        token1.approve(alp.address, constants.MaxUint256)
        token2.approve(alp.address, constants.MaxUint256)
    })

    it('constructor initializes immutables', async () => {
        expect(await alp.factory()).to.eq(factory.address, "factory addresses not equals")
        expect(await alp.token0()).to.eq(token0.address, "token0 addresses not equals")
        expect(await alp.token1()).to.eq(token1.address, "token1 addresses not equals")
    })

    describe('#deposit', () => {
        it('success cases', async () => {
            const amount: number = 10;

            let oldReserve0: BigNumber;
            let oldReserve1: BigNumber;
            let reserve0: BigNumber;
            let reserve1: BigNumber;

            let oldBalance0: BigNumber;
            let oldBalance1: BigNumber;
            let balance0: BigNumber;
            let balance1: BigNumber;

            [oldReserve0, oldReserve1] = await alp.getReserves()

            oldBalance0 = await alp.balanceOf(wallet.address, 0)
            oldBalance1 = await alp.balanceOf(wallet.address, 1)

            const oldBalanceToken0 = await token0.balanceOf(wallet.address)
            const oldBalanceToken1 = await token1.balanceOf(wallet.address)

            await alp.deposit(amount, amount);

            const balanceToken0 = await token0.balanceOf(wallet.address)
            const balanceToken1 = await token1.balanceOf(wallet.address)

            expect(balanceToken0).to.eq(oldBalanceToken0.sub(amount));
            expect(balanceToken1).to.eq(oldBalanceToken1.sub(amount));

            [reserve0, reserve1] = await alp.getReserves()

            expect(reserve0).to.eq(oldReserve0.add(amount))
            expect(reserve1).to.eq(oldReserve1.add(amount))

            balance0 = await alp.balanceOf(wallet.address, 0)
            balance1 = await alp.balanceOf(wallet.address, 1)

            expect(balance0).to.eq(oldBalance0.add(amount))
            expect(balance1).to.eq(oldBalance1.add(amount))
        })

    })

    describe('#withdraw', () => {
        it('success cases', async () => {
            const amount: number = 10;

            let oldReserve0: BigNumber;
            let oldReserve1: BigNumber;
            let reserve0: BigNumber;
            let reserve1: BigNumber;

            let oldBalance0: BigNumber;
            let oldBalance1: BigNumber;
            let balance0: BigNumber;
            let balance1: BigNumber;

            await alp.deposit(amount, amount);

            [oldReserve0, oldReserve1] = await alp.getReserves()

            oldBalance0 = await alp.balanceOf(wallet.address, 0)
            oldBalance1 = await alp.balanceOf(wallet.address, 1)

            await alp.withdraw(amount, amount);

            [reserve0, reserve1] = await alp.getReserves()

            expect(reserve0).to.eq(oldReserve0.sub(amount))
            expect(reserve1).to.eq(oldReserve1.sub(amount))

            balance0 = await alp.balanceOf(wallet.address, 0)
            balance1 = await alp.balanceOf(wallet.address, 1)

            expect(balance0).to.eq(oldBalance0.sub(amount))
            expect(balance1).to.eq(oldBalance1.sub(amount))
        })

        it('fails when insufficient balance for token0', async () => {
            await alp.deposit(0, 10);
            await expect(alp.withdraw(10, 10)).to.be.revertedWith("ALP: Insufficient balance for token0");
        })
        it('fails when insufficient balance for token1', async () => {
            await alp.deposit(10, 0);
            await expect(alp.withdraw(10, 10)).to.be.revertedWith("ALP: Insufficient balance for token1");
        })
    })

    describe('#requestReserve', () => {
        it('success cases', async () => {
            const amount: number = 10;
            const leverage: number = 10;

            let oldReserve0: BigNumber;
            let reserve0: BigNumber;


            await alp.deposit(100000, 100000);
            const oldBalance = await token0.balanceOf(wallet.address);
            [oldReserve0,] = await alp.getReserves()

            await alp.requestReserve(leverage, amount, token0.address)

            const val = amount * (leverage - 1);

            const balance = await token0.balanceOf(wallet.address)
            expect(balance).to.eq(oldBalance.add(val));

            [reserve0,] = await alp.getReserves()

            expect(reserve0).to.eq(oldReserve0.sub(val))
        })

        it('fails when leverage is too much', async () => {
            await expect(alp.requestReserve(1000, 10, token0.address)).to.be.revertedWith("ALP: too much leverage");
        })

        it('fails when insufficient funds in reserve', async () => {

            const a = await wallet.getBalance()

            console.log(a.toString())

            await expect(alp.requestReserve(10, 10, token0.address)).to.be.revertedWith("ALP: Insufficient funds in reserve");
        })
    })
})

