import addresses from "../contracts/addresses"
export const markets = [
  {
    id: 1,
    title: 'DAI vs USDC at Uniswap v.3',
    icons: [{icon: '/icons/iconsCurrency/DAI.svg'}, {icon: '/icons/iconsCurrency/USDC.svg',}],
    orderName: 'DAIvsUSDC',
    currency: [
      {
        id: 0,
        title: 'DAI',
        icon: '/icons/iconsCurrency/DAI.svg',
        address: [addresses[0].DAI.address, addresses[1].DAI.address],
        rate: 1.0018
      },
      {
        id: 1,
        title: 'USDC',
        icon: '/icons/iconsCurrency/USDC.svg',
        address: [addresses[0].USDC.address, addresses[1].USDC.address],
        rate: 0.9988
      }
    ]
  },
  {
    id: 2,
    title: 'DAI vs USDt at Uniswap v.3',
    icons: [ {icon: '/icons/iconsCurrency/DAI.svg'}, {icon: '/icons/iconsCurrency/Tether.svg',} ],
    orderName: 'DAIvsUSDt',
    currency: [
      {
        id: 0,
        title: 'DAI',
        icon: '/icons/iconsCurrency/DAI.svg',
        address: [addresses[0].DAI.address, addresses[1].DAI.address],
        rate: 1.0021
      },
      {
        id: 2,
        title: 'USDT',
        icon: '/icons/iconsCurrency/Tether.svg',
        address: [addresses[0].USDT.address, addresses[1].USDT.address],
        rate: 0.9975
      }
    ],
  }
]
export interface ModelMarket {
  id: number
  icons: {
    icon: string
  }[]
  title: string
  orderName: string
  currency: {id: number, title: string, icon: string, address: string[], rate: number}[]
}