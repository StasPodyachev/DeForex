import { ethers, waffle } from "hardhat"
import { BigNumber, BigNumberish, constants, Wallet } from "ethers"
import { TestERC20 } from "../typechain/TestERC20"
import { Factory } from "../typechain/Factory"
import { ALP } from "../typechain/ALP"
import { expect, use } from "chai"
import { alpFixture } from "./shared/fixtures"

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

const createFixtureLoader = waffle.createFixtureLoader

describe("ALP", () => {
  let wallet: Wallet, other: Wallet

  let token0: TestERC20
  let token1: TestERC20
  let token2: TestERC20

  let factory: Factory
  let alp: ALP

  let loadFixture: ReturnType<typeof createFixtureLoader>
  let createAlp: ThenArg<ReturnType<typeof alpFixture>>["createAlp"]

  before("create fixture loader", async () => {
    ;[wallet, other] = await (ethers as any).getSigners()
    loadFixture = createFixtureLoader([wallet, other])
  })

  beforeEach("deploy fixture", async () => {
    ; ({ token0, token1, token2, factory, createAlp } = await loadFixture(
      alpFixture
    ))

    alp = await createAlp(token0, token1)

    token0.approve(alp.address, constants.MaxUint256)
    token1.approve(alp.address, constants.MaxUint256)
    token2.approve(alp.address, constants.MaxUint256)
  })

  it("constructor initializes immutables", async () => {
    expect(await alp.factory()).to.eq(
      factory.address,
      "factory addresses not equals"
    )
    expect(await alp._token()).to.eq(
      token0.address,
      "token addresses not equals"
    )
  })

  describe("#deposit", () => {
    it("success cases", async () => {
      const amount: number = 10

      let oldReserve: BigNumber
      let reserve: BigNumber

      oldReserve = await alp.getReserve()

      const oldBalanceToken0 = await token0.balanceOf(wallet.address)

      await alp.deposit(amount)

      const balanceToken0 = await token0.balanceOf(wallet.address)

      expect(balanceToken0).to.eq(oldBalanceToken0.sub(amount))
      reserve = await alp.getReserve()

      expect(reserve).to.eq(oldReserve.add(amount))
    })
  })

  describe("#withdraw", () => {
    it("success cases", async () => {
      const amount: number = 10

      let oldReserve: BigNumber
      let reserve: BigNumber

      await alp.deposit(amount)
      oldReserve = await alp.getReserve()


      await alp.withdraw(amount)
      reserve = await alp.getReserve()

      expect(reserve).to.eq(oldReserve.sub(amount))
    })

    it("fails when insufficient balance for token", async () => {
      await alp.deposit(0)
      await expect(alp.withdraw(10)).to.be.revertedWith(
        "ALP: Insufficient reserve for token"
      )
    })

  })

  describe("#requestReserve", () => {
    it("success cases", async () => {
      const amount: number = 10
      const leverage: number = 10

      let oldReserve: BigNumber
      let reserve: BigNumber

      await alp.deposit(100000)

      const oldBalance = await token0.balanceOf(wallet.address)


      oldReserve = await alp.getReserve()

      await alp.requestReserve(leverage, amount)

      const val = amount * (leverage - 1)
      const balance = await token0.balanceOf(wallet.address)

      expect(oldBalance.add(val)).to.eq(balance)
      reserve = await alp.getReserve()

      expect(oldReserve.sub(val)).to.eq(reserve)

    })

    it("fails when leverage is too much", async () => {
      await expect(
        alp.requestReserve(1000, 10)
      ).to.be.revertedWith("ALP: too much leverage")
    })

    it("fails when insufficient funds in reserve", async () => {
      await expect(
        alp.requestReserve(10, 10)
      ).to.be.revertedWith("ALP: Insufficient in reserve")
    })
  })
})
