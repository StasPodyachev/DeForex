
import ItemMarket from '../ItemMarket/ItemMarket'
import styles from './ListMarket.module.css'

const items = 
  [
    {
      id: 1,
      currencyName: 'ethereum',
      derevativeName: 'ETHtUSD',
      price: 1643.60,
      icon: '/icons/iconsCurrency/EthereumETH.svg',
      description: 'Get profit from ETH price volatility with leverage.',
      duration: 'Duration 1 day - 30 days ',
      leverage: 'Leverage x2 - x30',
      currency: 'Currency USD, EUR',
      orderLink: '/',
      percent: '0.34 (0.10%)'
    },
    // {
    //   id: 2,
    //   currencyName: 'wti',
    //   derevativeName: 'WTI',
    //   price: 1143.60,
    //   icon: '/icons/iconsCurrency/TRON.svg',
    //   description: 'Get profit from Tron price volatility with leverage.',
    //   duration: 'Duration 1 day - 30 days ',
    //   leverage: 'Leverage x2 - x30',
    //   currency: 'Currency USD, EUR',
    //   orderLink: '/',
    //   percent: '0.34 (0.10%)'
    // },
    // {
    //   id: 3,
    //   currencyName: 'Solana',
    //   price: 143.60,
    //   icon: '/icons/iconsCurrency/Solana.svg',
    //   description: 'Get profit from Solana price volatility with leverage.',
    //   duration: 'Duration 1 day - 30 days ',
    //   leverage: 'Leverage x2 - x30',
    //   currency: 'Currency USD, EUR',
    //   orderLink: '/',
    //   percent: '0.34 (0.10%)'
    // }
  ]

const ListMarket = ({coin} : any) => {
  return (
    <div className={styles.listMarket}>
      {
        items?.map(item => {
          return (
            <div key={item?.id}>
              <ItemMarket coin={coin} order={item} />
            </div>
          )
        })
      }
    </div>
  )
}

export default ListMarket