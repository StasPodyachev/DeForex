// import ListMarket from './ListMarket/ListMarket'
import { useState } from 'react'
import styles from './Market.module.css'
import Select from './Select'

interface ModelMarket {
  id: number
  icons: {
    icon: string
  }[]
  title: string
}

const markets = [
  {
    id: 1,
    title: 'DAI vs USDC at Uniswap v.3',
    icons: [{icon: '/icons/iconsCurrency/DAI.svg'}, {icon: '/icons/iconsCurrency/USDC.svg',}]
  },
  {
    id: 2,
    title: 'USDC vs DAI at Uniswap v.2',
    icons: [ {icon: '/icons/iconsCurrency/USDC.svg'}, {icon: '/icons/iconsCurrency/DAI.svg',} ]
  }
]

const Market = ({coin} : any) => {
  const [ showMarket, setShowMarket ] = useState<ModelMarket>(markets[0])
  return (
    <div className={styles.main}>
      {/* <p className={styles.title}>
        <span>A contract for difference (CFD)</span> is a contract between a buyer and a seller that stipulates that the buyer must pay the seller the difference between the current value of an asset and its value at contract time. FDs allow traders and investors an opportunity to profit from price movement without owning the underlying assets.
      </p> */}
      <Select markets={markets} active={showMarket} setActive={setShowMarket} />
      {/* <ListMarket coin={coin} /> */}
    </div>
  )
}

export default Market