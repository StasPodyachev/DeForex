import { ethers, waffle } from "hardhat"
import { constants, Wallet } from "ethers"
import { TestERC20 } from "../typechain/TestERC20"
import { Factory } from "../typechain/Factory"
import { expect } from "chai"
import { deforexFixture } from "./shared/fixtures"
import { Exchange } from "../typechain/Exchange"
import { TestSwapRouter02 } from "../typechain/TestSwapRouter02"

const createFixtureLoader = waffle.createFixtureLoader

describe("Exchange", () => {
  let wallet: Wallet, other: Wallet

  let token0: TestERC20
  let token1: TestERC20
  let token2: TestERC20

  let factory: Factory
  let exchange: Exchange
  let swapRouter: TestSwapRouter02

  let loadFixture: ReturnType<typeof createFixtureLoader>

  before("create fixture loader", async () => {
    ;[wallet, other] = await (ethers as any).getSigners()
    loadFixture = createFixtureLoader([wallet, other])
  })

  beforeEach("deploy fixture", async () => {
    ; ({ token0, token1, token2, factory, exchange, swapRouter } = await loadFixture(
      deforexFixture
    ))

    await exchange.setFactory(factory.address)
  })

  describe("#setFactory", async () => {
    await exchange.setFactory(constants.AddressZero)
    let addr = await exchange._factory()
    expect(constants.AddressZero).to.be.eq(addr)

    await exchange.setFactory(exchange.address)
    addr = await exchange._factory()
    expect(exchange.address).to.be.eq(addr)
  })

  describe("#swap", async () => {
    it("success swap", async () => {
      const expectAmount = 10
      const amount = 10
      let amountIn
      let amountOut;


      await token0.transfer(exchange.address, amount)

        ;[amountIn, amountOut] = await exchange.callStatic.swap({
          amountIn: amount,
          amountOut: 0,
          tokenIn: token0.address,
          tokenOut: token1.address,
          timestamp: (Date.now() / 1000) | 0,
          path: "0x",
        })

      expect(expectAmount).to.be.eq(amountIn)
      expect(expectAmount).to.be.eq(amountOut)
    })

    it("fail swap if dex type not register", async () => {
      await factory.registerExchange(0, constants.AddressZero)
      const tx = exchange.swap({
        amountIn: 10,
        amountOut: 0,
        tokenIn: token0.address,
        tokenOut: token1.address,
        timestamp: (Date.now() / 1000) | 0,
        path: "0x",
      })
      await expect(tx).to.be.reverted
    })
  })
})
