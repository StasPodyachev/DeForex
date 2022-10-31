import { ethers, waffle } from "hardhat"
import { constants, Wallet } from "ethers"
import { TestERC20 } from "../typechain/TestERC20"
import { Factory } from "../typechain/Factory"
import { expect } from "chai"
import { uniswapExchangeFixture } from "./shared/fixtures"
import { UniswapExchange } from "../typechain/UniswapExchange"
import { TestSwapRouter02 } from "../typechain/TestSwapRouter02"

const createFixtureLoader = waffle.createFixtureLoader

describe("UniswapExchange", () => {
  let wallet: Wallet, other: Wallet

  let token0: TestERC20
  let token1: TestERC20
  let token2: TestERC20

  let factory: Factory
  let exchange: UniswapExchange
  let swapRouter: TestSwapRouter02

  let loadFixture: ReturnType<typeof createFixtureLoader>

  before("create fixture loader", async () => {
    ;[wallet, other] = await (ethers as any).getSigners()
    loadFixture = createFixtureLoader([wallet, other])
  })

  beforeEach("deploy fixture", async () => {
    ; ({
      token0, token1, token2, exchange, swapRouter
    } = await loadFixture(
      uniswapExchangeFixture
    ))
  })

  it("constructor initializes immutables", async () => {
    expect(await exchange._swapRouter()).to.eq(
      swapRouter.address,
      "swapRouter addresses not equals"
    )
  })


  describe("#swap", async () => {
    it("success swap", async () => {
      const expectAmount = 10
      const amount = 10

      await token0.approve(exchange.address, amount);

      await token0.transfer(swapRouter.address, constants.MaxUint256.div(10))
      await token1.transfer(swapRouter.address, constants.MaxUint256.div(10))

      const oldBalanceToken0 = await token0.balanceOf(wallet.address)
      const oldBalanceToken1 = await token1.balanceOf(wallet.address)

      await exchange.swap({
        amountIn: amount,
        amountOut: 0,
        tokenIn: token0.address,
        tokenOut: token1.address,
        timestamp: (Date.now() / 1000) | 0,
        path: "0x",
      })

      const balanceToken0 = await token0.balanceOf(wallet.address)
      const balanceToken1 = await token1.balanceOf(wallet.address)


      expect(oldBalanceToken0.sub(amount)).to.be.eq(balanceToken0)
      expect(oldBalanceToken1.add(amount)).to.be.eq(balanceToken1)

    })

    it("fails swap when token is not approved", async () => {
      await expect(exchange.swap({
        amountIn: 10,
        amountOut: 0,
        tokenIn: token0.address,
        tokenOut: token1.address,
        timestamp: (Date.now() / 1000) | 0,
        path: "0x",
      })).to.be.revertedWith("TransferHelper::transferFrom: transferFrom failed");
    })
  })
})
