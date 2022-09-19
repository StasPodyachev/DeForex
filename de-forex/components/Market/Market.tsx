import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Button from '../ui/Button'
import styles from './Market.module.css'
import Select from '../ui/Select/Select'
import {markets, ModelMarket} from '../../utils/markets'

const trades = [
  {
    id: 1,
    rate: '0,9994',
    amount: '1,000,000.00',
    time: '14:22:36'
  },
  {
    id: 2,
    rate: '0,9995',
    amount: '500,000.00',
    time: '14:22:36'
  },
  {
    id: 1,
    rate: '0,9996',
    amount: '300,000.00',
    time: '14:22:36'
  },  {
    id: 1,
    rate: '0,9997',
    amount: '154,800.00',
    time: '14:22:36'
  },  {
    id: 1,
    rate: '0,9998',
    amount: '9,600.00',
    time: '14:22:36'
  },
]

const Market = ({coin} : any) => {
  const [ showMarket, setShowMarket ] = useState<ModelMarket>(markets[0])
  const { push } = useRouter()
  return (
    <div className={styles.main}>
      <Select markets={markets} active={showMarket} setActive={setShowMarket} />
      <div className={styles.title}>Recent Trades</div>
      <div className={styles.history}>
        <div className={styles.bodyH}>
          <span>Rate</span>
          <span>Amount</span>
          <span>Time</span>
        </div>
        {
          trades?.map((item, id) => {
            return (
              <div key={item?.id} className={id % 2 ? styles.orderRed : styles.orderGreen}>
                <span>{item.rate}</span>
                <span>{item.amount}</span>
                <span>{item.time}</span>
              </div>
            )
          })
        }
      </div>

      <div className={styles.btnH}>
        <Link href={`/order-book/${showMarket?.orderName}`}>
          <a>
            <Button onClick={() => console.log('order')
            } title='Open Position' />
          </a>
        </Link>
      </div>
    </div>
  )
}

export default Market