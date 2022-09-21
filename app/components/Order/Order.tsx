import Image from 'next/image'
import { useEffect, useState } from 'react'
import Button from '../ui/Button'
import {markets, ModelMarket} from '../../utils/markets'
import Tab from '../ui/Tab'
import styles from './Order.module.css'
import Select from '../ui/Select/Select'
import Input from './Input'
import Link from 'next/link'
import { useContract } from 'wagmi'

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

const executions = [
  {
    id: 0,
    title: 'Instant market execution'
  },
  {
    id: 1,
    title: 'Limit order'
  }
]

const Order = ({order, coin} : {order : OrderModel, coin: any}) => {
  const [ showMarket, setShowMarket ] = useState<ModelMarket>(markets[0])
  const [ showExecution, setShowExecution ] = useState(executions[0])
  const [ checked, setChecket ] = useState(tabs[0])
  const [ active, setActive ] = useState(switchList[0])
  const [ value, setValue ] = useState<string>('100')
  const [ activeCurrency, setActiveCurrency ] = useState(markets[0].currency[0]);

  const [ valueInputPool, setValuePool ] = useState("10.000")
  const [ valueInputPoolSecond, setValuePoolSecond ] = useState('10.000')

  useEffect(() => {
    setActiveCurrency(showMarket.currency[0])
  }, [showMarket])

  // const contract = useContract({
  //   addressOrName: '0x79057B7d5342486a3197401aF64b3189D33baf2d',
  //   contractInterface: 
  // })

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
      <Select markets={markets} active={showMarket} setActive={setShowMarket}/>
      { switchList[0] === active ?
        <div>
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
          <Input
            setActiveCurrency={setActiveCurrency}
            activeCurrency={activeCurrency}
            value={value}
            setValue={setValue}
            icon={showMarket.icons[0].icon}
            currencies={showMarket?.currency} />
          {/* <WidgetOrder /> */}

          <div className={styles.rate}>
            <span style={{"color" : '#EB5757'}}>Stop loss at rate</span>
            <div className={styles.rateBody}>
              <div className={styles.icons}>
                {
                  showMarket?.icons?.map(icon => {
                    return (
                      <div key={icon?.icon}>
                        <Image src={icon?.icon} height={24} width={24} alt="icon" />
                      </div>
                    )
                  })
                }
              </div>
              <div className={styles.rateAmount}>0.9988</div>
              <span>
                {showMarket.currency[0].title} for 1 {showMarket.currency[1].title}
              </span>
            </div>
          </div>

          <div className={styles.rate}>
            <span style={{"color" : '#6FCF97'}}>Take profit at rate</span>
            <div className={styles.rateBody}>
              <div className={styles.icons}>
                {
                  showMarket?.icons?.map(icon => {
                    return (
                      <div key={icon?.icon}>
                        <Image src={icon?.icon} height={24} width={24} alt="icon" />
                      </div>
                    )
                  })
                }
              </div>
              <div className={styles.rateAmount}>1.0096</div>
              <span>
                {showMarket.currency[0].title} for 1 {showMarket.currency[1].title}
              </span>
            </div>
          </div>
          
          <div className={styles.options}>
            <p>
              My position <span style={{"color" : '#FFFFFF', "fontWeight" : '700'}}>10,000</span></p>
            <p>
              My potential loss <span style={{"color" : '#EB5757', "fontWeight" : '700'}}>99,325</span>
            </p>
            <p>
            My potential profit <span style={{"color" : '#9DE7BD', "fontWeight" : '700'}}>98,675</span>
            </p>
          </div>
          
          <Select
            execution
            markets={executions}
            active={showExecution}
            setActive={setShowExecution}/>

          <div className={styles.options}>
            <p>Curent rate <span style={{"color" : '#9DE7BD', "fontWeight" : '700'}}>0,99979325</span> USDC for 1 DAI </p>
            <p>Margin Call on rate <span style={{"color" : '#EB5757', "fontWeight" : '700'}}>0,99</span> tUSD for 1 DAI</p>
          </div>
        </div>
      :
      <div className={styles.pool}>
        <Input
          pool
          activeCurrency={showMarket.currency[0]}
          value={valueInputPool}
          setValue={setValuePool}
          icon={showMarket.icons[0].icon} />

        <Input
          pool
          activeCurrency={showMarket.currency[1]}
          value={valueInputPoolSecond}
          setValue={setValuePoolSecond}
          icon={showMarket.icons[1].icon} />
        <div className={styles.staked}>Staked amount <span style={{"color" : '#31C471', "fontWeight" : '700'}}>20,000</span> DAIUSDC</div>

        <div className={styles.options}>
          <p>TVL <span style={{"color" : '#31C471', "fontWeight" : '700'}}>1,000,000,000</span> USD</p>
          <p>My share <span style={{"color" : '#31C471', "fontWeight" : '700'}}>0.002% </span></p>
          <p>Est. APY <span style={{"color" : '#31C471', "fontWeight" : '700'}}>17.84% </span></p>
        </div>
      </div>
      }
      
      <Link href="/dashboard">
        <a>
          <div className={styles.btn}>
            <Button onClick={() => console.log("order")} title="Create Order" />
          </div>
        </a>
      </Link>
    </div>
  )
}
export default Order