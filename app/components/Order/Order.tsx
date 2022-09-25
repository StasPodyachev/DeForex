import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import Button from '../ui/Button'
import {markets, ModelMarket} from '../../utils/markets'
import Tab from '../ui/Tab'
import styles from './Order.module.css'
import Select from '../ui/Select/Select'
import Input from '../ui/Input/Input'
import { useSigner, useContract, erc20ABI, useAccount } from 'wagmi'
import addresses from '../../contracts/addresses'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { approve, approved, createPosition } from './utils'
import Pool from './Pool'
import ConnectWallet from '../Header/ConnectWallet'

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
  const [ activeCurrency, setActiveCurrency ] = useState<{id: number, title: string, icon: string, address: string, rate: number}>(markets[0].currency[0]);
  const [ activeCurrencySecond, setActiveCurrencySecond ] = useState<{id: number, title: string, icon: string, address: string, rate: number}>(markets[0].currency[1])
  const [ isApprove, isSetApprove ] = useState(false)
  const [ valueInputPool, setValuePool ] = useState("10000")
  const [ showAdvanced, setShowAdvanced ] = useState(false)

  //
  const [ marginCall, setMarginCall ] = useState(markets[0]?.currency[0]?.rate * ( checked.value - 1) /  checked.value)
  const [ takeProfitRate, setTakeProfitRate ] = useState(markets[0]?.currency[0]?.rate * 1.007)
  const [ stopLossRate, setStopLossRate ] = useState(markets[0]?.currency[0]?.rate * 0.998)
  const [ potentialProfit, setPotentialProfit ] = useState(0) // amountSell * (rateTakeProfit - rateMarket)
  const [ potentialLoss, setPotentialLoss ] = useState(0)
  //

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
    const amount = activeCurrency.title === "USDC" || activeCurrency.title === "USDT" ? +`${value}e6` : +`${value}e18`;
    const tokenSell = activeCurrency?.address
    const tokenBuy = showMarket?.currency?.find(currency => activeCurrency?.address !== currency.address).address
    createPosition(contract, tokenSell, tokenBuy, amount, checked.value , 0)
  }

  useEffect(() => {
    if(value) {
      const str = +value * checked?.value * activeCurrency?.rate
      setValueSecond(`${str}`)
    }
  }, [value, checked, activeCurrency])

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
    // if (!contract) {
    //   alert("-contract")
    // }
    // if (contract) {
    //   alert("+contract")
    // }    
    if (contract && address && signer && contractERC20Dai.allowance && contractERC20USDC.allowance) {
      approved(activeCurrency?.title === 'DAI' ? contractERC20Dai : contractERC20USDC, contract?.address, address).then((res) => {
        isSetApprove(res)
        console.log(res, 'res');
        
        if (res) {
          alert("ok")
        }
      }) } else {
      // alert("ne ok")
    }
  }, [address, signer, activeCurrency, contract?.allowance])

  useEffect(() => {
    setActiveCurrencySecond(showMarket?.currency?.find(cur => cur.id !== activeCurrency.id))
  }, [activeCurrency])

  useEffect(() => {
    setPotentialProfit(+value * checked?.value * (takeProfitRate - activeCurrency?.rate))
    setPotentialLoss(+value * checked?.value * (stopLossRate - activeCurrency?.rate))
  }, [value, checked, activeCurrency, takeProfitRate, stopLossRate])

  // useEffect(() => {
  //   if (activeCurrency) {
  //     const buyCurrency = showMarket?.currency?.find(cur => cur.id !== activeCurrency.id)
  //     const tokenBuy = {
  //       address: 
  //       buyCurrency?.title === "USDC" || buyCurrency.title === "USDT" ?
  //       '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' :
  //       '0x6b175474e89094c44da98b954eedeac495271d0f',
  //       range: buyCurrency?.title === "USDC" || buyCurrency.title === "USDT" ? 6 : 18,
  //       title: buyCurrency?.title
  //     }
  //     const tokenSell = {
  //       address: 
  //       activeCurrency?.title === "USDC" || activeCurrency.title === "USDT" ?
  //       '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' :
  //       '0x6b175474e89094c44da98b954eedeac495271d0f',
  //       range: activeCurrency?.title === "USDC" || activeCurrency.title === "USDT" ? 6 : 18,
  //       title: activeCurrency?.title
  //     }
  //     getRoute(tokenSell, tokenBuy).then(res => console.log(res, 'res'))
  //   }
  // }, [activeCurrency])

  useEffect(() => {
    if (checked && value) {
      setMarginCall(activeCurrency?.rate * ( checked.value - 1) /  checked.value)
    }
  }, [checked, activeCurrency])

  useEffect(() => {
    if (activeCurrency) {
      setStopLossRate(activeCurrency?.rate * 0.998)
      setTakeProfitRate(activeCurrency?.rate * 1.007)
    }
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
              <div className={styles.rateAmount}>{activeCurrency?.rate.toFixed(4)}</div>
              <span>
                {showMarket.currency.find(item => item.id != activeCurrency?.id).title} for 1 {activeCurrency?.title}
              </span>
            </div>
          </div>
          <div className={styles.options}>
            <p>Margin Call rate <span style={{"color" : '#EB5757', "fontWeight" : '700'}}>{marginCall.toFixed(4)} </span> <span>{showMarket.currency.find(item => item.id != activeCurrency?.id).title} for 1 {activeCurrency?.title}</span> </p>
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
                <div className={styles.rateAmount}>{takeProfitRate.toFixed(4)}</div>
                <span>
                  {showMarket.currency.find(item => item.id != activeCurrency?.id).title} for 1 {activeCurrency?.title}
                </span>
              </div>
            </div>
            
            <div className={styles.options}>
              <p>
                My potential profit <span style={{"color" : '#9DE7BD', "fontWeight" : '700'}}>{potentialProfit.toFixed(2)} </span> <span>{activeCurrency?.title}</span>
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
                <div className={styles.rateAmount}>{stopLossRate.toFixed(4)}</div>
                <span>
                {showMarket.currency.find(item => item.id != activeCurrency?.id).title} for 1 {activeCurrency?.title}
                </span>
              </div>
            </div>

            <div className={styles.options}>
              <p>
                My potential loss <span style={{"color" : '#EB5757', "fontWeight" : '700'}}>{potentialLoss.toFixed(2)} </span>
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
          {
            signer ?
            <div className={styles.btn}>
              <Button onClick={() => {
                isApprove ? createOrder() : approve(activeCurrency?.title === 'DAI' ? contractERC20Dai : contractERC20USDC , contract?.address, ethers?.constants?.MaxUint256)
              }} title={isApprove ? "Open Position" : "Approve token"} />
            </div>
            : 
            <div className={styles.btn}>
              <ConnectWallet />
            </div>
          }
        </div>
      :
      <Pool
        contractERC20Dai={contractERC20Dai}
        contractERC20USDC={contractERC20USDC}
        signer={signer}
        address={address}
        showMarket={showMarket}
        valueInputPool={valueInputPool}
        setValuePool={setValuePool}/>
      }
    </div>
  )
}
export default Order