import Image from 'next/image'
import { useEffect, useState } from 'react'
import Button from '../ui/Button'
import {markets, ModelMarket} from '../../utils/markets'
import Tab from '../ui/Tab'
import styles from './Order.module.css'
import Select from '../ui/Select/Select'
import Input from '../ui/Input/Input'
import { useSigner, useContract, erc20ABI, useAccount } from 'wagmi'
import addresses from '../../contracts/addresses'
// import DEFOREX_ABI from '../../contracts/ABI/Deforex.sol/Deforex.json'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { approve, approved, createPosition } from './utils'

const tabs = [
  {
    id: 0,
    title: 'x10',
    value: 10,
    disbled: false
  },
  {
    id: 1,
    title: 'x50',
    disbled: false,
    value: 50,
  },
  {
    id: 2,
    title: 'x100',
    disbled: false,
    value: 100,
  },
  {
    id: 3,
    title: 'x500',
    disbled: true,
    value: 500,
  },
  {
    id: 4,
    title: 'x1,000',
    disbled: true,
    value: 1000,
  },
  {
    id: 5,
    title: 'x5,000',
    disbled: true,
    value: 5000,
  },
  {
    id: 6,
    title: 'x10,000',
    disbled: true,
    value: 10000,
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
    title: 'Execute by Market'
  },
  {
    id: 1,
    title: 'Execute by Limit order'
  }
]


const Order = ({order, coin, contract} : {order : OrderModel, coin: any, contract: any}) => {
  const { query } = useRouter()
  const [ showMarket, setShowMarket ] = useState<ModelMarket>(markets[0])
  const [ showExecution, setShowExecution ] = useState(executions[0])
  const [ checked, setChecket ] = useState(tabs[2])
  const [ active, setActive ] = useState(switchList[0])
  const [ value, setValue ] = useState<string>('100')
  const [ valueSecond, setValueSecond ] = useState<string>("1000")
  const [ activeCurrency, setActiveCurrency ] = useState(markets[0].currency[0]);
  const [ activeCurrencySecond, setActiveCurrencySecond ] = useState(markets[0].currency[1])
  const [ isApprove, isSetApprove ] = useState(false)
  const [ valueInputPool, setValuePool ] = useState("10.000")
  const [ valueInputPoolSecond, setValuePoolSecond ] = useState('10.000')
  const [ showAdvanced, setShowAdvanced ] = useState(false)
  const { data: signer } = useSigner() 
  const { address } = useAccount()
  const contractERC20Dai = useContract({
    addressOrName: addresses?.DAI?.address,
    contractInterface: erc20ABI,
    signerOrProvider: signer
  })
  const contractERC20USDC = useContract({
    addressOrName: addresses?.USDC?.address,
    contractInterface: erc20ABI,
    signerOrProvider: signer
  })

  const createOrder = () => {
    const amount = activeCurrency.title === "USDC" ? +`${value}e6` : +`${value}e18`;
    const tokenSell = activeCurrency?.address
    const tokenBuy = showMarket?.currency?.find(currency => activeCurrency?.address !== currency.address).address
    createPosition(contract, tokenSell, tokenBuy, amount, checked.value , 0)
  }

  useEffect(() => {
    if(value) {
      const str = +value * checked?.value
      setValueSecond(`${str}`)
    }
  }, [value, checked])

  useEffect(() => {
    setActiveCurrency(showMarket.currency[0])
  }, [showMarket])

  useEffect(() => {
    if (query?.orderName) {
      const active = markets.filter(item => {
        if (query?.orderName === item.orderName) {
          return item
        }
      })
      setShowMarket(active[0])
    }
  }, [query])

  useEffect(() => {
    if (address && signer) {
      approved(activeCurrency?.title === 'DAI' ? contractERC20Dai : contractERC20USDC, contract?.address, address).then((res) => isSetApprove(res))
    }
  }, [address, signer, activeCurrency])

  useEffect(() => {
    setActiveCurrencySecond(showMarket?.currency?.find(cur => cur.id !== activeCurrency.id))
  }, [activeCurrency])

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
          <div className={styles.inputAmount}>
            <Input
              setActiveCurrency={setActiveCurrency}
              activeCurrency={activeCurrency}
              value={value}
              setValue={setValue}
              icon={showMarket.icons[0].icon}
              currencies={showMarket?.currency} />
          </div>
          <div className={styles.tabs}>
            {
              tabs?.map(tab => {
                return <Tab
                  setChecket={() => setChecket(tab)} key={tab?.id}
                  tab={tab}
                  disbled={tab?.disbled}
                  checked={checked?.id === tab?.id} />
              })
            }
          </div>
          <div className={styles.inputAmount}>
            <Input
              setActiveCurrency={setActiveCurrency}
              activeCurrency={activeCurrency}
              secondCurrency={activeCurrencySecond}
              value={valueSecond}
              setValue={setValueSecond}
              disabled={true}
              icon={showMarket.icons[0].icon}
              currencies={showMarket?.currency} />
          </div>
          <div className={styles.rate}>
            <span style={{"color" : '#AC90FF'}}>Market rate</span>
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
          <div className={styles.options}>
            <p>Margin Call rate <span style={{"color" : '#EB5757', "fontWeight" : '700'}}>0,9971 </span> <span>{showMarket.currency[0].title} for 1 {showMarket.currency[1].title}</span> </p>
          </div>
          <div onClick={() => setShowAdvanced(!showAdvanced)} className={styles.advanced}>
            <span>Advanced</span>
            <div className={showAdvanced ? styles.settingsActive : styles.settings}>
              <Image src="/icons/orderIcon/settings.svg" width={24} height={24} alt='settings' />
            </div>
          </div>
          {
            showAdvanced ?
            <>
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
                My potential profit <span style={{"color" : '#9DE7BD', "fontWeight" : '700'}}>98,675 </span> <span>{activeCurrency?.title}</span>
              </p>
            </div>
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

            <div className={styles.options}>
              <p>
                My potential loss <span style={{"color" : '#EB5757', "fontWeight" : '700'}}>99,325 </span>
                <span>{activeCurrency?.title}</span>
              </p>
            </div>

            <div className={styles.chart}>
              <Image src="/icons/chart3.svg" width={327} height={225} alt='chart' />
            </div>

          </> : null
          } 
          
          <Select
            execution
            markets={executions}
            active={showExecution}
            setActive={setShowExecution}/>
        </div>
      :
      <div className={styles.pool}>
        <Input
          pool
          activeCurrency={showMarket?.currency[0]}
          value={valueInputPool}
          setValue={setValuePool}
          icon={showMarket.icons[0].icon} />

        <Input
          pool
          activeCurrency={showMarket.currency[1]}
          value={valueInputPool}
          setValue={setValuePool}
          icon={showMarket.icons[1].icon} />
        <div className={styles.staked}>Staked amount <span style={{"color" : '#31C471', "fontWeight" : '700'}}>20,000</span> DAIUSDC</div>

        <div className={styles.options}>
          <p>TVL <span style={{"color" : '#31C471', "fontWeight" : '700'}}>1,000,000,000</span> USD</p>
          <p>My share <span style={{"color" : '#31C471', "fontWeight" : '700'}}>0.002% </span></p>
          <p>Est. APY <span style={{"color" : '#31C471', "fontWeight" : '700'}}>17.84% </span></p>
        </div>
      </div>
      }
      <div className={styles.btn}>
        <Button onClick={() => {
          isApprove ? createOrder() : approve(activeCurrency?.title === 'DAI' ? contractERC20Dai : contractERC20USDC , contract?.address, ethers?.constants?.MaxUint256)
        }} title={isApprove ? "Open Position" : "Approve token"} />
      </div>
    </div>
  )
}
export default Order