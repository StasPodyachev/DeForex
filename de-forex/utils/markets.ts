export const markets = [
  {
    id: 1,
    title: 'DAI vs USDC at Uniswap v.3',
    icons: [{icon: '/icons/iconsCurrency/DAI.svg'}, {icon: '/icons/iconsCurrency/USDC.svg',}],
    orderName: 'DAIvsUSDC'
  },
  {
    id: 2,
    title: 'DAI vs USDt at Uniswap v.3',
    icons: [ {icon: '/icons/iconsCurrency/DAI.svg'}, {icon: '/icons/iconsCurrency/Tether.svg',} ],
    orderName: 'DAIvsUSDt'
  },
  {
    id: 3,
    title: 'USDt vs USDC at Uniswap v.3',
    icons: [ {icon: '/icons/iconsCurrency/Tether.svg'}, {icon: '/icons/iconsCurrency/USDC.svg',} ],
    orderName: 'USDtvsUSDC'
  },
  
]

export interface ModelMarket {
  id: number
  icons: {
    icon: string
  }[]
  title: string
  orderName: string
}