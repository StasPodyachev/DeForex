export const markets = [
  {
    id: 1,
    title: 'DAI vs USDC at Uniswap v.3',
    icons: [{icon: '/icons/iconsCurrency/DAI.svg'}, {icon: '/icons/iconsCurrency/USDC.svg',}],
    orderName: 'DAIvsUSDC',
    currency: [
      {
        id: 0,
        title: 'DAI'
      },
      {
        id: 1,
        title: 'USDC'
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
        title: 'DAI'
      },
      {
        id: 2,
        title: 'USDT'
      }
    ]
  },
  {
    id: 3,
    title: 'USDt vs USDC at Uniswap v.3',
    icons: [ {icon: '/icons/iconsCurrency/Tether.svg'}, {icon: '/icons/iconsCurrency/USDC.svg',} ],
    orderName: 'USDtvsUSDC',
    currency: [
      {
        id: 2,
        title: 'USDT'
      },
      {
        id: 1,
        title: 'USDC'
      }
    ]
  },
  
]

export interface ModelMarket {
  id: number
  icons: {
    icon: string
  }[]
  title: string
  orderName: string
  currency: {id: number, title: string}[]
}