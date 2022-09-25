import Image from 'next/image';
import { useEffect, useState } from 'react';
import Button from '../ui/Button';
import { gql, useQuery } from '@apollo/client'
import styles from './DashboardContent.module.css'
import UserInfo from './UserInfo'
import { useAccount, useSigner } from 'wagmi';
import { formatChange } from '../../utils/toSignificant';
import addresses from '../../contracts/addresses';
import ConnectWallet from '../Header/ConnectWallet';

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

const positionListTest = [
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
    id: 2,
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
    id: 3,
    leverage: '20,000',
    deposit: '$20,125.31',
    icons: [{icon: '/icons/iconsCurrency/DAI.svg'},
    {icon: '/icons/iconsCurrency/Tether.svg',}],
    orderName: 'DAIvsUSDt',
    orderTime: '13.09.2022 16:15:23',
    state: 'APY 17,84%',
  },
  {
    id: 4,
    leverage: '30,000',
    deposit: '$30,158.30',
    icons: [{icon: '/icons/iconsCurrency/USDC.svg'},
    {icon: '/icons/iconsCurrency/Tether.svg',}],
    orderName: 'USDCUSDt',
    orderTime: '04.09.2022 16:15:26',
    state: 'APY 14,93%',
  }
]

const Positions = ({ positionList = []} : any) => {
  // const [checked, setChecked ] = useState(radioList[0]);
  return (
    <>
    <div className={styles.title}>
      <span>Positions</span>
      {/* <div className={styles.radio}>
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
      </div> */}
    </div>
    <div className={styles.list}>
      {positionList?.length && positionList?.map((item) => {
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
                <div className={styles.leverage}>x{item?.leverage}</div>
                <div className={styles.price}>{item?.deposit}{item?.positionSell}</div>
                <div className={styles.state}>{item?.state}</div>
              </div>
              <Tab type='position'
                data={{id: item?.id,
                  positionBuy:item?.positionBuy,
                  amountAout:item?.amountAout,
                  positionSell: item?.positionSell,
                  invested: +item?.deposit * +item.leverage,
                  investeAlp: +item?.deposit * +item.leverage - item?.deposit,
                  entryRate: item?.entryRate
                }}/>
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
              <div key={item?.id} className={styles.item}>
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

const Staking = ({stakingList} : any) => {
  // const [checked, setChecked ] = useState(radioList[0]);
  return (
    <>
    <div className={styles.title}>
      <span>Staking</span>
      <div className={styles.radio}>
        {/* {radioList?.map(icon => {
          return (
            <div
              onClick={() => setChecked(icon)}
              className={icon?.id === checked.id ? styles.active : styles.inactive }
              key={icon?.}>
              <Image src={icon?.icon} width={20} height={20} alt='icon' />
            </div>
          )
        })} */}
      </div>
    </div>
      <div className={styles.list}>
        {stakingList?.map((item) => {
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
                {/* <div className={styles.leverage}>{item?.leverage}</div> */}
                <div className={styles.price}>{item?.deposit}</div>
                <div className={styles.state}>{item?.state}</div>
                
              </div>
              <Tab type='staking' data={{orderTime: item?.orderTime}}/>
              </div>
            )
          })}
        </div>
      </>
  )
}

const Tab = ({type, data} : {type: string, data: any}) => {
  // console.log(data, 'data');
  return (
    <div className={styles.tab}>
      {
        type === "position" ? 
        <>
          <div>
            <span>Order ID</span>
            <span>#{data?.id}</span>
          </div>
          <div>
            <span>Position in {data?.positionBuy}</span>
            <span>{data?.amountAout}</span>
          </div>
          <div>
            <span>Entry rate</span>
            <span>{data?.entryRate}</span>
          </div>
          <div>
            <span>Invested in {data?.positionSell}</span>
            <span>{data?.invested} {data?.positionSell}</span>
          </div>
          <div>
            <span>Invested by ALP</span>
            <span>{data?.investeAlp} {data?.positionSell}</span>
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
  const { data: signer } = useSigner()
  const { address } = useAccount()
  const GET_POSITIONS =  
    gql`
      query Positions {
        positions (first: 10,
          where: { trader: "${address}"}) {
          id
          timestamp
          amount
          leverage
          tokenSell
          trader
          tokenBuy
          status
          amountOut
        }
      }
    `
  const GET_STAKINGS =
    gql`
      query Positions {
        balances (first: 10, where: { owner: "${address}"}) {
          id
          alp {
            token0
            token1
          }
          balance0
          balance1
          timestampUp
        }
      }
    `
  const { data: positions } = useQuery(GET_POSITIONS, {})
  const { data: balances } = useQuery(GET_STAKINGS, {})
  const [ positionList, setPositionList ] = useState()
  const [ stakingList, setStakingList ] = useState()

  useEffect(() => {
    if (positions?.positions?.length) {
      let arr = positions?.positions?.map(position => {
        const icons = [
          {
            icon: position?.tokenSell === addresses?.USDC?.address ? '/icons/iconsCurrency/USDC.svg' : position?.tokenSell === addresses?.USDT?.address ? '/icons/iconsCurrency/Tether.svg' :
            '/icons/iconsCurrency/DAI.svg'},
          {
            icon: position?.tokenBuy === addresses?.USDC?.address ?'/icons/iconsCurrency/USDC.svg':
            position?.tokenBuy === addresses?.USDT?.address ? '/icons/iconsCurrency/Tether.svg' :
            '/icons/iconsCurrency/DAI.svg'}]
        const firstName = position?.tokenSell === addresses?.USDC?.address ? 'USDC'
        : position?.tokenSell === addresses?.USDT?.address ? 'USDt' : 'DAI'
        const secondName = position?.tokenBuy === addresses?.USDC?.address ? 'USDC' :
          position?.tokenBuy === addresses?.USDT?.address ? 'USDt' : 'DAI'
        const entryRate = +formatChange(position?.amountOut) / (+formatChange(position?.amount) * position?.leverage)
        return {
          id: position?.id,
          leverage: position?.leverage,
          deposit: `${formatChange(position?.amount)} `,
          icons: icons,
          orderName: `${firstName}vs${secondName}`,
          state: '15$ (15,25%)',
          positionBuy: secondName,
          positionSell: firstName,
          amountAout: `${formatChange(position?.amountOut)} ${secondName}`,
          entryRate: `${entryRate.toFixed(4)} ${secondName} for 1 ${firstName}`
        }
      })
      setPositionList(arr)
    }
  }, [positions])

  useEffect(() => {
    if (balances?.balances?.length){

      let arr = balances?.balances?.map(position => {
        const icons = [
          {
            icon: position?.alp?.token0 === addresses?.USDC?.address ? '/icons/iconsCurrency/USDC.svg' : position?.alp?.token0 === addresses?.USDT?.address ? '/icons/iconsCurrency/Tether.svg' :
            '/icons/iconsCurrency/DAI.svg'},
          {
            icon: position?.alp?.token1 === addresses?.USDC?.address ?'/icons/iconsCurrency/USDC.svg':
            position?.alp?.token1 === addresses?.USDT?.address ? '/icons/iconsCurrency/Tether.svg' :
            '/icons/iconsCurrency/DAI.svg'}
        ]
        const firstName = position?.alp.token0 === addresses?.USDC?.address ? 'USDC'
        : position?.alp.token0 === addresses?.USDT?.address ? 'USDt' : 'DAI'
        const secondName = position?.alp.token1 === addresses?.USDC?.address ? 'USDC' :
        position?.alp.token1 === addresses?.USDT?.address ? 'USDt' : 'DAI'
        const date = new Date(position?.timestampUp * 1000)
        const hours = date.getHours();
        const minutes = "0" + date.getMinutes();
        const seconds = "0" + date.getSeconds();
        const month = date?.getMonth() <= 9 ?   "0" + date?.getMonth() : date?.getMonth()
        const year = date?.getFullYear()
        const day = date?.getDay()  <= 9 ?   "0" + date?.getDay() : date?.getDay()
        const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        const formatData =  day + " " + month + ' ' + year
        console.log(year , 'date');
        
        return {
          id: position?.id,
          icons,
          orderName: `${firstName} ${secondName}`,
          deposit: `$${+formatChange((position?.balance0)) + +formatChange((position?.balance1))}`,
          leverage: `${+formatChange((position?.balance0)) + +formatChange((position?.balance1))}`,
          state: "APY 17,84%",
          orderTime: `${formatData} ${formattedTime}`
        }
      })
      setStakingList(arr)
    }
  }, [balances])

  return (
    <div className={styles.dashboard}>
      <UserInfo />
      <div className={styles.chart}>
        <Image src="/icons/chart2.svg" width={327} height={208} alt="chart" />
      </div>
      {
        signer ?
        <>
          <Positions positionList={positionList} />
            <Staking stakingList={stakingList} />
            <div className={styles.btns}>
              <Button onClick={() => console.log('Deposit')} title='Deposit' />
              <Button onClick={() => console.log('Withdraw')} title='Withdraw' />
            </div>
        </> : <div className={styles.btn}><ConnectWallet /></div>
      }
    </div>
  )
}

export default DashboardContent 