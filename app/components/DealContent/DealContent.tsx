import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import WidgetOrder from '../Order/WidgetOrder'
import Button from '../ui/Button'
import Coin from '../ui/Coin'
import Tab from '../ui/Tab'
import styles from './DealContent.module.css'
import InputDeal from './InputDeal'

const switchList = [
  {
    id: 0,
    title: 'Buy'
  },
  {
    id: 1,
    title: 'Sell'
  }
]

const tabs = [
  {
    id: 0,
    title: 'x2',
    checked: false
  },
  {
    id: 1,
    title: 'x5',
    checked: false
  },
  {
    id: 2,
    title: 'x10',
    checked: true
  },
  {
    id: 3,
    title: 'x20',
    checked: false
  },

  {
    id: 4,
    title: 'x30',
    checked: false
  },
]

const DealContent = ({coin} : any) => {
  const [ active, setActive ] = useState(switchList[0])
  const [ checked, setChecket ] = useState(tabs[2])
  const { push } = useRouter()
 
  return (
    <div className={styles.deal}>
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

      <div className={styles.title}>
        <div className={styles.icons}>
          <div className={styles.leftIcon}>
            <Image src="/icons/iconsCurrency/EthereumETH.svg" width={24} height={24} alt="eth" />
          </div>
          <div className={styles.rightIcon}>
            <Image src="/icons/iconsCurrency/Tether.svg" width={24} height={24} alt="eth" />
          </div>
        </div>
        <span>ETHtUSD</span>
      </div>
      <div className={styles.rate}>
        <div className={styles.rateTitle}>
            <span>Last rate</span>
            <div className={styles.rateIcon}>
              <Image alt='icon' src="/icons/orderIcon/question.svg" width={18} height={18} />
            </div>
          </div>
        <div><Coin coin={coin}/></div>
      </div>
      <div className={styles.block}>
        <div className={styles.currencyDrop}>
          <div className={styles.icons}>
            <div className={styles.rightIcon}>
              <Image src="/icons/iconsCurrency/Tether.svg" width={24} height={24} alt="eth" />
            </div>
          </div>
          <InputDeal />
          <div className={styles.dropdawn}>
            <div>tUSD</div>
          </div>
        </div>
      </div>

      <div className={styles.units}>
        <div>
          <span>0.90872</span>
          <span>ETH Units</span>
        </div>
        <div>
          <span>Exposure x30</span>
          <span>100,000 tUSD</span>
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.loss}>
          <span>1,073.01</span>
          <div>
            <div>Max Loss</div>
            <div>-10,000 tUSD</div>
          </div>
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

      <div className={styles.block}>
        <div className={styles.profit}>
          <span>1,437.09</span>
          <div>
            <div>Max Profit</div>
            <div>10,000 tUSD</div>
          </div>
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.duration}>
          <div>
            <div>Duration</div>
            <div>30 days</div>
          </div>
          <div className={styles.arrow}><Image src="/icons/orderIcon/arroww.svg" width={24} height={24} alt="eth" /></div>
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.duration}>
          <div>
            <div>Slipage</div>
            <div>{checked?.title}</div>
          </div>
          <div className={styles.arrow}><Image src="/icons/orderIcon/arroww.svg" width={24} height={24} alt="eth" /></div>
        </div>
      </div>
      <WidgetOrder />
      <div className={styles.paymentSlipage}>Payment with Slippage <span>10,100 tUSD</span> </div>
      <div className={styles.btn}>
        <Button title='Open Trade' onClick={() => push('/deal-info')} />
      </div>
    </div>
  )
}

export default DealContent