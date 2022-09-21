import Image from 'next/image';
import { useState } from 'react';
import Button from '../ui/Button';
// import Chart from './Chart';
import styles from './DashboardContent.module.css'
import UserInfo from './UserInfo'

const radioList = [
  {
    id: 1,
    icon: '/icons/orderIcon/exchange.svg'
  },
  {
    id: 2,
    icon: '/icons/orderIcon/radio.svg'
  },
  {
    id: 3,
    icon: '/icons/orderIcon/arrows.svg'
  }
]

const positionList = [
  {
    id: 1,
    leverage: 'x100',
    deposit: '$156',
    icons: [{icon: '/icons/iconsCurrency/DAI.svg'}, {icon: '/icons/iconsCurrency/USDC.svg',}],
    orderName: 'DAIvsUSDC',
    entryPrice: '$0.9995',
    oraclePrice: '$0.9998',
    liqPrice: '$0.9999',
    state: '15$ (15,25%)'
  }
]

const orderList = [
{
    id: 1,
    leverage: 'Sell x100,000',
    deposit: '$156',
    icons: [{icon: '/icons/iconsCurrency/DAI.svg'},
    {icon: '/icons/iconsCurrency/Tether.svg',}],
    orderName: 'DAIvsUSDT',
    entryPrice: '$0.9914',
    oraclePrice: '$0.9901',
    exitType: 'Liquidation',
    state: 'Closed P&L -$13',
    orderTime: '16:22:37'
  }
]

const stakingList = [
  {
    id: 11,
    leverage: '20,000',
    deposit: '$20,125.31',
    icons: [{icon: '/icons/iconsCurrency/DAI.svg'},
    {icon: '/icons/iconsCurrency/Tether.svg',}],
    orderName: 'DAIvsUSDt',
    orderTime: '13.09.2022 16:15:23',
    state: 'APY 17,84%',
  },
  {
    id: 12,
    leverage: '30,000',
    deposit: '$30,158.30',
    icons: [{icon: '/icons/iconsCurrency/USDC.svg'},
    {icon: '/icons/iconsCurrency/Tether.svg',}],
    orderName: 'USDCUSDt',
    orderTime: '04.09.2022 16:15:26',
    state: 'APY 14,93%',
  }
]

const Positions = () => {
  const [checked, setChecked ] = useState(radioList[0]);
  return (
    <>
    <div className={styles.title}>
      <span>Positions</span>
      <div className={styles.radio}>
        {radioList?.map(icon => {
          return (
            <div
              onClick={() => setChecked(icon)}
              className={icon?.id === checked.id ? styles.active : styles.inactive }
              key={icon?.id}>
              <Image src={icon?.icon} width={20} height={20} alt='icon' />
            </div>
          )
        })}
      </div>
    </div>
    <div className={styles.list}>
      {positionList?.map((item) => {
          return (
            <div key={item.id}>
              <div className={styles.item}>
                {<div className={styles.icons}>
                  {item?.icons?.map(icon => {
                    return (
                      <div key={icon?.icon}>
                        <Image src={icon?.icon} height={24} width={24} alt="icon"/>
                      </div>
                    )
                  })}
                </div>}
                <div className={styles.orderName}>{item?.orderName}</div>
                <div className={styles.leverage}>{item?.leverage}</div>
                <div className={styles.price}>{item?.deposit}</div>
                <div className={styles.state}>{item?.state}</div>
              </div>
              <Tab type='position'
              data={{entryPrice: item.entryPrice, oraclePrice: item.oraclePrice, liqPrice: item.liqPrice}}/>
            </div>
          )
        })}
      </div>
      </>
  )
}

const Orders = () => {
  const [checked, setChecked ] = useState(radioList[0]);
  return (
    <>
    <div className={styles.title}>
      <span>Orders</span>
      <div className={styles.radio}>
        {radioList?.map(icon => {
          return (
            <div
              onClick={() => setChecked(icon)}
              className={icon?.id === checked.id ? styles.active : styles.inactive }
              key={icon?.id}>
              <Image src={icon?.icon} width={20} height={20} alt='icon' />
            </div>
          )
        })}
      </div>
    </div>
      <div className={styles.list}>
        {orderList?.map((item) => {
            return (
              <>
              <div key={item.id} className={styles.item}>
                {<div className={styles.icons}>
                  {item?.icons?.map(icon => {
                    return (
                      <div key={icon?.icon}>
                        <Image src={icon?.icon} height={24} width={24} alt="icon"/>
                      </div>
                    )
                  })}
                </div>}
                <div className={styles.orderName}>{item?.orderName}</div>
                <div className={styles.leverage}>{item?.leverage}</div>
                <div className={styles.price}>{item?.deposit}</div>
                <div className={styles.stateR}>{item?.state}</div>
              </div>
              <Tab type='order'
              data={
                {
                  entryPrice: item?.entryPrice,
                  oraclePrice: item?.oraclePrice,
                  exitType:item?.exitType,
                  orderTime: item?.orderTime
                }}/>
              </>
            )
          })}
        </div>
      </>
  )
}

const Staking = () => {
  const [checked, setChecked ] = useState(radioList[0]);
  return (
    <>
    <div className={styles.title}>
      <span>Staking</span>
      <div className={styles.radio}>
        {radioList?.map(icon => {
          return (
            <div
              onClick={() => setChecked(icon)}
              className={icon?.id === checked.id ? styles.active : styles.inactive }
              key={icon?.id}>
              <Image src={icon?.icon} width={20} height={20} alt='icon' />
            </div>
          )
        })}
      </div>
    </div>
      <div className={styles.list}>
        {stakingList?.map((item) => {
            return (
              <>
              <div key={item.id} className={styles.item}>
                {<div className={styles.icons}>
                  {item?.icons?.map(icon => {
                    return (
                      <div key={icon?.icon}>
                        <Image src={icon?.icon} height={24} width={24} alt="icon"/>
                      </div>
                    )
                  })}
                </div>}
                <div className={styles.orderName}>{item?.orderName}</div>
                <div className={styles.leverage}>{item?.leverage}</div>
                <div className={styles.price}>{item?.deposit}</div>
                <div className={styles.state}>{item?.state}</div>
                
              </div>
              <Tab type='staking'
              data={{orderTime: item?.orderTime}}/>
              </>
            )
          })}
        </div>
      </>
  )
}

const Tab = ({type, data} : {type: string, data: any}) => {
  return (
    <div className={styles.tab}>
      {
        type === "position" ? 
        <>
          <div>
            <span>Entry Price</span>
            <span>{data?.entryPrice}</span>
          </div>
          <div>
            <span>Oracle Price</span>
            <span>{data?.oraclePrice}</span>
          </div>
          <div>
            <span>Liq. Price</span>
            <span style={{"color" : '#EB5757'}}>{data?.liqPrice}</span>
          </div>
        </>
        : type === "order" ?
        <>
          <div>
            <span>Entry Price</span>
            <span>{data?.entryPrice}</span>
          </div>
          <div>
            <span>Oracle Price</span>
            <span>{data?.oraclePrice}</span>
          </div>
          <div>
            <span>Exit Type</span>
            <span>{data?.exitType}</span>
          </div>

          <div style={{"marginTop" : '24px'}}>
            <span>Order Time</span>
            <span style={{"color" : '#7B61FF'}}>{data?.orderTime}</span>
          </div>
        </>
        : type === "staking" ?
          <>
            <div className={styles.staking} style={{"marginTop" : '24px'}}>
              <span>Date time</span>
              <span style={{"color" : '#7B61FF'}}>{data?.orderTime}</span>
            </div>
          </> : null}
    </div>
  )
}

const DashboardContent = () => {
  return (
    <div className={styles.dashboard}>
      <UserInfo />
      <div className={styles.chart}>
        <Image src="/icons/chart2.svg" width={327} height={208} alt="chart" />
      </div>
      {/* <Chart /> */}
      <Positions />
      <Orders />
      <Staking />
      <div className={styles.btns}>
        <Button onClick={() => console.log('Deposit')} title='Deposit' />
        <Button onClick={() => console.log('Withdraw')} title='Withdraw' />
      </div>
    </div>
  )
}

export default DashboardContent 