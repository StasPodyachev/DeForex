import { ethers, waffle } from "hardhat"
import { BigNumber, constants, ContractFactory, Wallet } from "ethers"
import { TestERC20 } from "../typechain/TestERC20"
import { Factory } from "../typechain/Factory"
import { ALP } from "../typechain/ALP"
import { expect } from "chai"
import { deforexFixture } from "./shared/fixtures"
import { Deforex } from "../typechain/Deforex"
import { TestSwapRouter02 } from "../typechain/TestSwapRouter02"

const createFixtureLoader = waffle.createFixtureLoader

const NUM = 1
const DEN = 1

describe("Deforex", () => {
  let wallet: Wallet, other: Wallet

  let token0: TestERC20
  let token1: TestERC20
  let token2: TestERC20

  let factory: Factory
  let deforex: Deforex
  let alp: ALP
  let swapRouter: TestSwapRouter02
  let ALPFactory: ContractFactory

  let loadFixture: ReturnType<typeof createFixtureLoader>
  //let createAlp: ThenArg<ReturnType<typeof deforexFixture>>['createAlp']

  before("create fixture loader", async () => {
    ;[wallet, other] = await (ethers as any).getSigners()
    loadFixture = createFixtureLoader([wallet, other])

    ALPFactory = await ethers.getContractFactory("ALP")
  })

  beforeEach("deploy fixture", async () => {
    ;({ token0, token1, token2, factory, deforex, swapRouter } =
      await loadFixture(deforexFixture))

    await factory.createAlp(token0.address, token1.address)
    let alpAddress = await factory.getAlp(token0.address, token1.address)
    alp = ALPFactory.attach(alpAddress) as ALP

    await token0.approve(alpAddress, constants.MaxUint256)
    await token1.approve(alpAddress, constants.MaxUint256)

    await alp.deposit(constants.MaxUint256.div(5), constants.MaxUint256.div(5))

    await token0.approve(deforex.address, constants.MaxUint256)
    await token1.approve(deforex.address, constants.MaxUint256)

    await swapRouter.setRate(NUM, DEN)

    //await token2.approve(deforex.address, constants.MaxUint256);
  })

  describe("#createPosition", () => {
    it("success case", async () => {
      const amount: number = 100
      const leverage: number = 100
      const expectAmountOut = 10000

      const oldBalanceToken0 = await token0.balanceOf(wallet.address)
      const oldBalanceToken1 = await token0.balanceOf(wallet.address)

      await deforex.createPosition(
        token0.address,
        token1.address,
        amount,
        leverage,
        "0x"
      )

      const balanceToken0 = await token0.balanceOf(wallet.address)
      const balanceToken1 = await token1.balanceOf(wallet.address)

      expect(oldBalanceToken0.sub(amount)).to.eq(balanceToken0)
      expect(oldBalanceToken1).to.eq(balanceToken1)

      const positionId = await deforex._positionId()
      const position = await deforex._positions(positionId)

      expect(expectAmountOut).to.eq(position.amountOut)
    })

    it("fails when alp address is ZERO_ADDRESS", async () => {
      const amount: number = 100
      const leverage: number = 100
      await expect(
        deforex.createPosition(
          token0.address,
          token0.address,
          amount,
          leverage,
          "0x"
        )
      ).to.be.revertedWith("Deforex: alp address is ZERO_ADDRESS")
    })

    it("fails when tokenSell is not approved", async () => {
      await expect(
        deforex.createPosition(token2.address, token1.address, 10, 10, "0x")
      ).to.be.reverted
    })

    it("fails when exchange address is ZERO_ADDRESS", async () => {
      await factory.registerExchange(0, constants.AddressZero)
      await expect(
        deforex.createPosition(token0.address, token1.address, 10, 10, "0x")
      ).to.be.revertedWith("Deforex: exchange address is ZERO_ADDRESS")
    })
  })

  describe("#closePosition", () => {
    it("success case", async () => {
      const amount: number = 100
      const leverage: number = 100

      // Rate = 1.001 (token0-token1)
      let num = 10010
      let den = 10000

      await deforex.createPosition(
        token0.address,
        token1.address,
        amount,
        leverage,
        "0x"
      )

      const oldTraderBalance = await token0.balanceOf(wallet.address)
      const oldAlpBalance = await token0.balanceOf(alp.address)

      const positionId = await deforex._positionId()
      let position = await deforex._positions(positionId)

      console.log("out", position.amountOut.toString())

      // Rate closing fact = 0.985 (token0 -> token1)
      num = 10000
      den = 9850

      await deforex.closePosition(positionId, "0x")

      const amountToTrader = 262
      const amountToAlp = 9990

      // 10162.44 - return token0

      const traderBalance = await token0.balanceOf(wallet.address)
      const alpBalance = await token0.balanceOf(alp.address)

      position = await deforex._positions(positionId)

      expect(position.status).eq(1)
      expect(oldTraderBalance.add(amountToTrader)).to.be.eq(traderBalance)
      expect(oldAlpBalance.add(amountToAlp)).to.be.eq(alpBalance)
    })

    it("fails when position does not exist", async () => {
      await expect(deforex.closePosition(1, "0x")).to.be.reverted
    })

    it("fails when exchange address is ZERO_ADDRESS", async () => {
      await factory.registerExchange(0, constants.AddressZero)
      await expect(deforex.closePosition(1, "0x")).to.be.reverted
    })
  })

  describe("#liquidation", () => {
    it("success case", async () => {
      const amount: number = 100
      const leverage: number = 100

      // Rate = 1.001 (token0)
      let num = 10010
      let den = 10000

      const leverageAmount = 9900

      await deforex.createPosition(
        token0.address,
        token1.address,
        amount,
        leverage,
        "0x"
      )

      const positionId = await deforex._positionId()
      let position = await deforex._positions(positionId)

      const amountOutFact = 9920

      const oldTraderBalance = await token0.balanceOf(wallet.address)
      const oldAlpBalance = await token0.balanceOf(alp.address)
      const oldLiquidatorBalance = await token0.balanceOf(other.address)

      num = 10090
      den = 10000

      await swapRouter.setRate(num, den)

      await deforex
        .connect(other)
        ["liquidation(uint256,bytes)"](positionId, "0x")

      const ALP_FEE_PERCENT = 0.1
      const LIQUIDATOR_FEE_PERCENT = 0.05

      const alpAmount =
        (leverageAmount + amountOutFact * (ALP_FEE_PERCENT / 100)) | 0
      const liquidatorAmount =
        (amountOutFact * (LIQUIDATOR_FEE_PERCENT / 100)) | 0

      const expectTraderAmount = oldTraderBalance.add(
        amountOutFact - alpAmount - liquidatorAmount
      )

      const traderBalance = await token0.balanceOf(wallet.address)
      const alpBalance = await token0.balanceOf(alp.address)
      const liquidatorBalance = await token0.balanceOf(other.address)

      position = await deforex._positions(positionId)
      expect(2).eq(position.status)

      expect(expectTraderAmount).eq(traderBalance)
      expect(oldAlpBalance.add(alpAmount)).eq(alpBalance)
      expect(oldLiquidatorBalance.add(liquidatorAmount)).eq(liquidatorBalance)
    })
  })

  it("fails when position does not exist", async () => {
    await expect(deforex["liquidation(uint256,bytes)"](1, "0x")).to.be.reverted
  })
})
