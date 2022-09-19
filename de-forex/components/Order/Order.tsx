import Image from 'next/image'
import { useState } from 'react'
import Button from '../ui/Button'
import {markets, ModelMarket} from '../../utils/markets'
import Tab from '../ui/Tab'
import styles from './Order.module.css'
import Select from '../ui/Select'

const tabs = [
  {
    id: 0,
    title: 'x10',
    checked: false
  },
  {
    id: 1,
    title: 'x50',
    checked: true
  },
  {
    id: 2,
    title: 'x100',
    checked: false
  },
  {
    id: 3,
    title: 'x500',
    checked: false
  },
  {
    id: 4,
    title: 'x1,000',
    checked: false
  },
  {
    id: 5,
    title: 'x5,000',
    checked: false
  },
  {
    id: 6,
    title: 'x10,000',
    checked: false
  }
]

const switchList = [
  {
    id: 0,
    title: 'Trade'
  },
  {
    id: 1,
    title: 'Pool'
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
  const [ showMarket, setShowMarket ] = useState<ModelMarket>(markets[0])
  const [ checked, setChecket ] = useState(tabs[0])
  const [ active, setActive ] = useState(switchList[0])
  return (
    <div className={styles.order}>
      <div className={styles.switchBtn}>
        {switchList.map(item => {
          return (
            <div
              onClick={() => setActive(item)}
              key={item.id}
              className={active?.id === item?.id ? styles.activeSwitch : styles.switchItem}>
              <span>{item.title}</span>
            </div>
          )
        })}
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

      {/* <WidgetOrder /> */}
      
      <div className={styles.btn}>
        <Button onClick={() => console.log("order")} title="Create Order" />
      </div>
    </div>
  )
}
export default Order