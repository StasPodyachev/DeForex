import { ethers, waffle } from "hardhat"
import { constants, Wallet } from "ethers"
import { TestERC20 } from "../typechain/TestERC20"
import { Factory } from "../typechain/Factory"
import { expect } from "chai"
import { deforexFixture } from "./shared/fixtures"
import { Exchange } from "../typechain/Exchange"

const createFixtureLoader = waffle.createFixtureLoader

describe("Exchange", () => {
  let wallet: Wallet, other: Wallet

  let token0: TestERC20
  let token1: TestERC20
  let token2: TestERC20

  let factory: Factory
  let exchange: Exchange

  let loadFixture: ReturnType<typeof createFixtureLoader>

  before("create fixture loader", async () => {
    ;[wallet, other] = await (ethers as any).getSigners()
    loadFixture = createFixtureLoader([wallet, other])
  })

  beforeEach("deploy fixture", async () => {
    ;({ token0, token1, token2, factory, exchange } = await loadFixture(
      deforexFixture
    ))
  })

  describe("#swap", async () => {
    it("success swap", async () => {
      const expectAmount = 10

      let amountIn
      let amountOut
      ;[amountIn, amountOut] = await exchange.callStatic.swap({
        amountIn: 10,
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
