import { ethers, waffle } from "hardhat"
import { constants, Wallet } from "ethers"
import { TestERC20 } from "../typechain/TestERC20"
import { Factory } from "../typechain/Factory"
import { expect } from "chai"
import { deforexFixture } from "./shared/fixtures"
import { Exchange } from "../typechain/Exchange"

const createFixtureLoader = waffle.createFixtureLoader

describe("Factory", () => {
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

    await factory.registerExchange(0, constants.AddressZero)
  })

  describe("#registerExchange", async () => {
    it("doesn't exist type", async () => {
      let addr = await factory.getExchange(0)

      expect(constants.AddressZero).to.be.eq(addr)

      await factory.registerExchange(1, exchange.address)

      addr = await factory.getExchange(0)

      expect(constants.AddressZero).to.be.eq(addr)
    })

    it("type exist", async () => {
      await factory.registerExchange(0, exchange.address)

      const addr = await factory.getExchange(0)

      expect(exchange.address).to.be.eq(addr)
    })
  })

  describe("#getAlp", async () => {
    it("doesn't exist alp", async () => {
      const addr = await factory.getAlp(token0.address, token1.address)

      expect(constants.AddressZero).to.be.eq(addr)
    })
    it("alp exist", async () => {
      await factory.createAlp(token0.address, token1.address)
      const expectAddr = await factory.alps(0)

      expect(constants.AddressZero).to.be.not.eq(expectAddr)

      const addr = await factory.getAlp(token0.address, token1.address)

      expect(expectAddr).to.be.eq(addr)
    })
  })

  describe("#createAlp", () => {
    it("success created", async () => {
      await factory.createAlp(token0.address, token1.address)

      const expectAddr = await factory.alps(0)

      expect(constants.AddressZero).to.be.not.eq(expectAddr)

      const addr = await factory.getAlp(token0.address, token1.address)

      expect(expectAddr).to.be.eq(addr)

      const oldCount = await factory.countAlp()

      await factory.createAlp(token0.address, token2.address)

      const count = await factory.countAlp()

      expect(oldCount.add(1)).to.be.eq(count)
    })

    it("fail when token equals", async () => {
      await expect(factory.createAlp(token0.address, token0.address)).to.be
        .reverted
    })

    it("fail when token0 or token1 address(0)", async () => {
      await expect(factory.createAlp(constants.AddressZero, token0.address)).to
        .be.reverted

      await expect(factory.createAlp(token0.address, constants.AddressZero)).to
        .be.reverted
    })

    it("fail when alp exist", async () => {
      await factory.createAlp(token0.address, token1.address)

      await expect(
        factory.createAlp(token0.address, token1.address)
      ).to.be.revertedWith("Factory: ALP_EXIST")
    })
  })

  describe("#setOwner", () => {
    it("success changed", async () => {
      const owner = await factory.owner()

      console.log(owner)

      await factory.setOwner(other.address)

      expect(other.address).to.be.eq(owner)
    })

    it("fail if caller not owner", async () => {
      await expect(factory.connect(other).setOwner(wallet.address)).to.be
        .reverted
    })
  })
})
