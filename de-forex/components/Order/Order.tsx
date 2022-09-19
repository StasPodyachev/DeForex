import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Button from '../ui/Button'
import Coin from '../ui/Coin'
import Tab from '../ui/Tab'
import styles from './Order.module.css'
import WidgetOrder from './WidgetOrder'
import { Book } from './Book'

const tabs = [
  {
    id: 0,
    title: '10%',
    checked: false
  },
  {
    id: 1,
    title: '15%',
    checked: true
  },
  {
    id: 2,
    title: '20%',
    checked: false
  }
]
interface OrderModel {
  id: number,
  currencyName: string,
  price: number,
  icon: string,
  description: string,
  duration: string,
  leverage: string,
  currency: string,
  orderLink: string,
  percent: string
}
const Order = ({order, coin} : {order : OrderModel, coin: any}) => {
  const [ checked, setChecket ] = useState(tabs[0])
  const { push } = useRouter()
  return (
    <div className={styles.order}>
      <div className={styles.title}>
        <div className={styles.icons}>
          <div className={styles.leftIcon}>
            <Image src="/icons/iconsCurrency/EthereumETH.svg" width={24} height={24} alt="eth" />
          </div>
          <div className={styles.rightIcon}>
            <Image src="/icons/iconsCurrency/Tether.svg" width={24} height={24} alt="eth" />
          </div>
        </div>
        <span>{order?.currencyName}</span>
      </div>

      <div className={styles.rate}>
        <div className={styles.rateTitle}>
          <span>Last rate</span>
          <div className={styles.rateIcon}>
            <Image alt='icon' src="/icons/orderIcon/question.svg" width={18} height={18} />
          </div>
        </div>
        <div><Coin coin={coin}/></div>
        <div className={styles.days}>
          <div className={styles.rateIcon}>
            <Image alt='icon' src="/icons/orderIcon/exchange.svg" width={18} height={18} />
          </div>
          <span>30 days</span>
        </div>
      </div>

      <div className={styles.tabs}>
        {
          tabs?.map(tab => {
            return <Tab
              setChecket={() => setChecket(tab)} key={tab?.id}
              tab={tab}
              checked={checked?.id === tab?.id} />
          })
        }
      </div>

      <div className={styles.content}>
        <div className={styles.buy}>
          <div className={styles.titleBuy}>Buying orders</div>
          <Book type="buy" coin={coin} checked={checked?.title} />
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.sell}>
          <div className={styles.titleSell}>Selling orders</div>
          <Book type='sell' coin={coin} checked={checked?.title} />
        </div>
      </div>
      
      <WidgetOrder />
      
      <div className={styles.btn}>
        <Button onClick={() => push('/deal')} title="Create Order" />
      </div>
    </div>
  )
}
export default Order