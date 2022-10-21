import Image from 'next/image';
import { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client'
import styles from './DashboardContent.module.css'
import UserInfo from './UserInfo'
import { useAccount, useProvider, useSigner } from 'wagmi';
import { formatChange } from '../../utils/toSignificant';
import addresses from '../../contracts/addresses';
import { ConnectKitButton } from 'connectkit';

const Positions = ({address, addressesNetwork} : any) => {
  const [ positionList, setPositionList ] = useState([])
  const GET_POSITIONS =
  gql`
    query Positions {
      positions (first: 30,
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
  const { data: positions } = useQuery(GET_POSITIONS, {})

  useEffect(() => {
    if (positions?.positions?.length) {
      let arr = positions?.positions?.map(position => {
        const icons = [
          {
            icon: position?.tokenSell === addressesNetwork?.USDC?.address ? '/icons/iconsCurrency/USDC.svg' : position?.tokenSell === addressesNetwork?.USDT?.address ? '/icons/iconsCurrency/Tether.svg' :
            '/icons/iconsCurrency/DAI.svg'},
          {
            icon: position?.tokenBuy === addressesNetwork?.USDC?.address ?'/icons/iconsCurrency/USDC.svg':
            position?.tokenBuy === addressesNetwork?.USDT?.address ? '/icons/iconsCurrency/Tether.svg' :
            '/icons/iconsCurrency/DAI.svg'}]
        const firstName = position?.tokenSell === addressesNetwork?.USDC?.address ? 'USDC'
        : position?.tokenSell === addressesNetwork?.USDT?.address ? 'USDt' : 'DAI'
        const secondName = position?.tokenBuy === addressesNetwork?.USDC?.address ? 'USDC' :
          position?.tokenBuy === addressesNetwork?.USDT?.address ? 'USDt' : 'DAI'
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

  return (
    <>
    <div className={styles.title}>
      <span>Positions</span>
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

const Staking = ({address, addressesNetwork} : any) => {

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
const { data: balances } = useQuery(GET_STAKINGS, {})
const [ stakingList, setStakingList ] = useState([])

useEffect(() => {
  if (balances?.balances?.length){

    let arr = balances?.balances?.map(position => {
      const icons = [
        {
          icon: position?.alp?.token0 === addressesNetwork?.USDC?.address ? '/icons/iconsCurrency/USDC.svg' : position?.alp?.token0 === addressesNetwork?.USDT?.address ? '/icons/iconsCurrency/Tether.svg' :
          '/icons/iconsCurrency/DAI.svg'},
        {
          icon: position?.alp?.token1 === addressesNetwork?.USDC?.address ?'/icons/iconsCurrency/USDC.svg':
          position?.alp?.token1 === addressesNetwork?.USDT?.address ? '/icons/iconsCurrency/Tether.svg' :
          '/icons/iconsCurrency/DAI.svg'}
      ]
      const firstName = position?.alp.token0 === addressesNetwork?.USDC?.address ? 'USDC'
      : position?.alp.token0 === addressesNetwork?.USDT?.address ? 'USDt' : 'DAI'
      const secondName = position?.alp.token1 === addressesNetwork?.USDC?.address ? 'USDC' :
      position?.alp.token1 === addressesNetwork?.USDT?.address ? 'USDt' : 'DAI'
      const date = new Date(position?.timestampUp * 1000)
      const hours = date.getHours();
      const minutes = "0" + date.getMinutes();
      const seconds = "0" + date.getSeconds();
      const month = date?.getMonth() <= 9 ?   "0" + date?.getMonth() : date?.getMonth()
      const year = date?.getFullYear()
      const day = date?.getDay()  <= 9 ?   "0" + date?.getDay() : date?.getDay()
      const formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
      const formatData =  day + " " + month + ' ' + year
      
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
    <>
    <div className={styles.title}>
      <span>Staking</span>
      <div className={styles.radio}>
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

const DashboardContent = ({networkId}) => {
  const { address } = useAccount()
  const { data: signer } = useSigner()
  return (
    <div className={styles.dashboard}>
      <UserInfo />
      <div className={styles.chart}>
        <Image src="/icons/chart2.svg" width={327} height={208} alt="chart" />
      </div>
      {
        address && signer ?
        <>
          <Positions addressesNetwork={addresses?.find(item => item.id !== networkId)} address={address} />
          <Staking addressesNetwork={addresses?.find(item => item.id !== networkId)} address={address} />
        </> : <div className={styles.btn}><ConnectKitButton theme="midnight" showAvatar /></div>
      }
    </div>
  )
}

export default DashboardContent 