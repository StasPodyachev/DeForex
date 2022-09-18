import { useState, useEffect, ReactNode } from "react"
import Coin from "../ui/Coin"
import ModalOrder from "./ModalOrder"
import { gql, useQuery } from '@apollo/client'
import { formatChange } from '../../utils/toSignificant'
import styles from './Order.module.css'
const LIMIT = 5
interface ModelProps {
  checked: string,
  coin: any,
  type: string,
}
interface ModelItem {
  setShowModal: (b: boolean) => void
  type: string
  coin: any
  checked: string
  count: string
  total: number
  collateral: number
  closeModal: () => void
  showModal: boolean
  id: string
}
interface ModelOrder {
  id: string
  count: string
  total: number
  collateral: number
}

function numberWithSpaces(x: string | number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const ItemBook = (
  {setShowModal, id, type, coin, checked, collateral, total, closeModal, showModal}
  : ModelItem) => {
  const contracts = [
    {
      id,
      rate: "111",
      available: total,
      leverage: collateral,
      date: '2021.08.2022',
    }
  ]

  const orderDetails = {
    type: type,
    price: "100",
    rounded: '100',
    leverageRate: checked
  }
  return (
    <>
    <ModalOrder
      coin={coin}
      close={closeModal}
      show={showModal}
      contracts={contracts}
      orderDetails={orderDetails}/>
    <div onClick={() => setShowModal(true)} className={styles.orderBuy}>
      <div className={type === "buy" ? styles.orderBuyRate : styles.orderSellRate}>
        <span>~ </span>
        <Coin coin={coin}/>
        <span> tUSD</span>
      </div>
      <div className={styles.orderBuySum}>{numberWithSpaces(total)}</div>
      <div className={type === "buy" ? styles.orderBuyLeverage : styles.orderSellLeverage}>
        {collateral}
        <span className={type === "buy" ? styles.checkedBuy : styles.checkedSell}>{checked}</span>
      </div>
      <div>
        { type === "buy" ?
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 16L14 12L10 8" stroke="url(#paint0_linear_5411_14383)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient
                id="paint0_linear_5411_14383" x1="12.7185" y1="21.3" x2="8.34306" y2="21.0328" gradientUnits="userSpaceOnUse">
                <stop stopColor="#9DE7BD"/>
                <stop offset="1" stopColor="#36CD77"/>
              </linearGradient>
              </defs>
            </svg> :
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 16L14 12L10 8" stroke="url(#paint0_linear_5411_14527)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="paint0_linear_5411_14527" x1="10" y1="-13.5" x2="15.6196" y2="-13.3016" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FF8597"/>
                <stop offset="1" stopColor="#FF3A58"/>
                </linearGradient>
              </defs>
            </svg>}
      </div>
    </div>
    </>
  )
}

export const Book = ({checked, coin, type} : ModelProps) => {
  const depositPercent =  checked === '10%' ? 100000000000000000 : checked === '15%' ? 150000000000000000 : 200000000000000000
  const [ showModal, setShowModal ] = useState(false)
  const [ orderList, setOrderList ] = useState<[] | [ModelOrder]>();
  const maker = type === "buy" ? 1 : 0
  let orders: ReactNode[] = []
  const GET_DEALS = 
  maker === 1 ? 
  gql`
    query DealsDashboard {
      deals (
        first: ${LIMIT}
        orderBy: dateOrderCreation
        orderDirection: desc
        where: {derivativeID: "1", makerPosition: ${maker}, depositLPercent: ${depositPercent}}
      ) {
        dealID
        count
        price
        depositLAmount
        depositLPercent
        derivativeSetting {
          coinOfContract
          coinDepositL
          coinPaymentL
        }
      }
    }
  ` :
  gql`
    query DealsDashboard {
      deals (
        first: ${LIMIT}
        orderBy: dateOrderCreation
        orderDirection: desc
        where: {derivativeID: "1", makerPosition: ${maker}, depositSPercent: ${depositPercent}}
      ) {
        dealID
        count
        price
        depositSPercent
        depositSAmount
        derivativeSetting {
          coinOfContract
          coinDepositS
          coinPaymentS
        }
      }
    }
  `
  const { loading, error, data } = useQuery(GET_DEALS, {})
  useEffect(() => {
    if (data) {
      const deals = data?.deals?.map((deal : any) => {
        const percent = maker === 1 ? Number(deal?.depositLPercent) / 1e16 : Number(deal?.depositSPercent) / 1e16
        console.log(percent);
        const totalPrice = Number(formatChange(deal?.count)) * Number(formatChange(deal?.price))
        // {totalPrice.div(100).mul(depositSPercent).mul(100).div(100).toFixed(2)} {coinDepositS}{' '}
        // console.log(formatChange(deal?.count), formatChange(deal?.price));
        
        return {
          count: formatChange(deal?.count),
          id: deal?.dealID,
          total: totalPrice.toFixed(2),
          collateral: (totalPrice / 100 * percent).toFixed(2)
        }
      })
      setOrderList(deals)
    } 
  }, [data])
  
  const closeModal = () => setShowModal(false)
  return (
    orderList?.length ? 
      <div>       
        {orderList?.map((order : ModelOrder) => {
          return (
            <ItemBook
              id={order?.id}
              closeModal={closeModal}
              showModal={showModal}
              collateral={order.collateral}
              key={order?.id}
              count={order?.count}
              total={order?.total}
              setShowModal={setShowModal}
              coin={coin}
              checked={checked}
              type={type}/>)})}
      </div>
    : null
  )
}