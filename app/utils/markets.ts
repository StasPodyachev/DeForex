import addresses from "../contracts/addresses"
export const markets = [
  {
    id: 1,
    title: 'DAI vs USDC at Uniswap v.3',
    icons: [{icon: '/icons/iconsCurrency/DAI.svg'}, {icon: '/icons/iconsCurrency/USDC.svg',}],
    orderName: 'DAIvsUSDC',
    alpaddress: addresses.AlpDaiUsdc.address,
    currency: [
      {
        id: 0,
        title: 'DAI',
        icon: '/icons/iconsCurrency/DAI.svg',
        address: addresses.DAI.address,
        rate: 1.0018
      },
      {
        id: 1,
        title: 'USDC',
        icon: '/icons/iconsCurrency/USDC.svg',
        address: addresses.USDC.address,
        rate: 0.9988
      }
    ]
  },
  {
    id: 2,
    title: 'DAI vs USDt at Uniswap v.3',
    icons: [ {icon: '/icons/iconsCurrency/DAI.svg'}, {icon: '/icons/iconsCurrency/Tether.svg',} ],
    orderName: 'DAIvsUSDt',
    alpaddress: addresses.AlpDaiUsdt.address,
    currency: [
      {
        id: 0,
        title: 'DAI',
        icon: '/icons/iconsCurrency/DAI.svg',
        address: addresses.DAI.address,
        rate: 1.0021
      },
      {
        id: 2,
        title: 'USDT',
        icon: '/icons/iconsCurrency/Tether.svg',
        address: addresses.USDT.address,
        rate: 0.9975
      }
    ]
  },
  {
    id: 3,
    title: 'USDt vs USDC at Uniswap v.3',
    icons: [ {icon: '/icons/iconsCurrency/Tether.svg'}, {icon: '/icons/iconsCurrency/USDC.svg',} ],
    orderName: 'USDtvsUSDC',
    alpaddress: addresses.AlpDaiUsdt.address,
    currency: [
      {
        id: 2,
        title: 'USDT',
        icon: '/icons/iconsCurrency/Tether.svg',
        address: addresses.USDT.address,
        rate: 0.9995
      },
      {
        id: 1,
        title: 'USDC',
        icon: '/icons/iconsCurrency/USDC.svg',
        address: addresses.USDC.address,
        rate: 1.0005
      }
    ]
  }
]
export interface ModelMarket {
  id: number
  icons: {
    icon: string
  }[]
  title: string
  orderName: string
  alpaddress: string
  currency: {id: number, title: string, icon: string, address: string, rate: number}[]
}