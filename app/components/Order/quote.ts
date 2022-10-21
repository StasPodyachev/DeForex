import { AlphaRouter, ChainId } from '@uniswap/smart-order-router'
import { Token, CurrencyAmount, Percent, TradeType } from '@uniswap/sdk-core'
import { Protocol } from '@uniswap/router-sdk'
import { JsonRpcProvider } from '@ethersproject/providers'

const router = new AlphaRouter({
  chainId: ChainId.MAINNET,
  provider: new JsonRpcProvider('https://mainnet.infura.io/v3/8d74aa62de8e44f1807e65f4ba122e8d'),
})

interface ModelToken {
  address: string
  range: number
  title: string
}

async function getRoute(a: ModelToken, b: ModelToken) {  
  const tokenSell = new Token(ChainId.MAINNET, a?.address, a.range, a.title, a.title)
  const tokenBuy = new Token(ChainId.MAINNET, b?.address, b?.range, b.title, b.title)
  const amount = CurrencyAmount.fromRawAmount(tokenSell, '1000000000000000000000') // tokenSell
  const route = await router.route(
    amount,
    tokenBuy,
    TradeType.EXACT_INPUT,
    {
      recipient: '0xF552f5223D3f7cEB580fA92Fe0AFc6ED8c09179b',
      slippageTolerance: new Percent(5, 100),
      deadline: Math.floor(Date.now() / 1000 + 1800),
    },
    {
      protocols: [Protocol.V2, Protocol.V3],
    }
  )
  return route?.trade.outputAmount.toSignificant()
}
 export default getRoute