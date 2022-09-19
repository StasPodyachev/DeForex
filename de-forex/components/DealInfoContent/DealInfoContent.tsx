import Image from 'next/image'
import { useState } from 'react'
import Button from '../ui/Button'
import styles from '../Dashboard/DashboardContent.module.css'
import UserInfo from '../Dashboard/UserInfo'

interface OrderModel   {
  id: number,
  available: string,
  dateStart: string,
  dateEnd: string,
  title: string,
  icon: string,
  buy: {
    type: string,
    amount: string,
    units: string,
    oracle: string,
    duration: string,
    slippage: string,
    leverage: string,
    exprosure: string,
  },
  etherscan: {
    addressBuyer: string,
    addressSeller: string,
    transactionCreate: string,
    transactionTake: string,
    transactionComplete: string
  },
  history: {
    created: string,
    taken: string,
    contractEnd: string,
    sentCollateralWithSlippage: string[],
    returnSlippage: string[],
    receivePayoutBuyer: string[],
    receivePayoutSeller: string[],
    resultBuyer: string,
    resultSeller: string,
    sentCollateralCertaine: string[]
  }
}
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
const orderList = [
  {
    id: 5890,
    available: '1,231.05',
    dateStart: '06.07 10:45',
    dateEnd: '06.08 10:45',
    title: 'ETHtUSD',
    icon: '/icons/iconsCurrency/EthereumETH.svg',
    buy: {
      type: 'Buying',
      amount: '10.000 tUSD',
      units: '0.90872 ETH',
      oracle: '1,270.00 ETH/tUSD',
      duration: '1 day',
      slippage: '12.31 tUSD',
      leverage: 'X10',
      exprosure: '100.000 tUSD',
    },
    etherscan: {
      addressBuyer: '20xc3F...ED56',
      addressSeller: '34xc3F...EА45',
      transactionCreate: '0x5eb39...6884e',
      transactionTake: '0x6eb48...7888n',
      transactionComplete: '0x4eb97...6854e'
    },
    history: {
      created: '2021.08.20 17:57',
      taken: '2021.08.20 18:55',
      contractEnd: '2021.08.30 18:55',
      sentCollateralWithSlippage: ['-10,500.00 tUSD', '2021.08.20 17:57'],
      returnSlippage: ['430.00 tUSD', '2021.08.20 17:57'],
      receivePayoutBuyer: ['11,070.00 tUSD', '2021.08.20 17:57'],
      receivePayoutSeller: ['430.00 tUSD', '2021.08.20 17:57'],
      resultBuyer: '1,000.00 tUSD',
      resultSeller: '1,000.00 tUSD',
      sentCollateralCertaine: ['-10,500.00 tUSD', '2021.08.20 17:57']
    }
  },
]
const tabs = [
  {
    id: 0,
    title: "Buy",
  },
  {
    id: 1,
    title: "Etherscan",
  },
  {
    id: 2,
    title: "History",
  },
  {
    id: 3,
    title: "Action",
  },
]

const ActiveContent = ({activeTab, order} : {activeTab : string, order: OrderModel}) => {
  return (
    <div className={styles.tabsContent}>
      {
        activeTab === "Buy" ? 
        <>
          <div className={styles.titleBuy}>
            <div>#{order.id}</div>
            <div>Created</div>
          </div>
          <div className={styles.positionBuy}>
            <div>Mу position</div>
            <div>{order?.buy?.type}</div>
          </div>
          <div className={styles.amountBuy}>
            <div>Amount</div>
            <div>{order?.buy?.amount}</div>
          </div>
          <div className={styles.unitsBuy}>
            <div>Units</div>
            <div>{order?.buy?.units}</div>
          </div>
          <div className={styles.oracle}>
            <div>Oracle</div>
            <div>{order?.buy?.oracle}</div>
          </div>

          <div className={styles.duration}>
            <div>Duration</div>
            <div>{order?.buy?.duration}</div>
          </div>
          <div>
            <div>Slipagge</div>
            <div>{order?.buy?.slippage}</div>
          </div>
          <div>
            <div>Leverage</div>
            <div>{order?.buy?.leverage}</div>
          </div>
          <div>
            <div>Exprosure</div>
            <div>{order?.buy?.exprosure}</div>
          </div>
        </> :
        activeTab === "Etherscan" ?
        <>
          <div className={styles.adress}>
            <div>Address Buyer</div>
            <div>
              <span>{order?.etherscan?.addressBuyer}</span>
              <Image src="/icons/orderIcon/copy.svg" width={16} height={16} alt="copy" />
            </div>
          </div>
          <div className={styles.adress}>
            <div>Address Seller</div>
            <div>
              <span>{order?.etherscan?.addressSeller}</span>
              <Image src="/icons/orderIcon/copy.svg" width={16} height={16} alt="copy" />
            </div>
          </div>
          <div className={styles.adress}>
            <div>Transaction Create</div>
            <div>
              <span>{order?.etherscan?.transactionCreate}</span>
              <Image src="/icons/orderIcon/copy.svg" width={16} height={16} alt="copy" />
            </div>
          </div>
          <div className={styles.adress}>
            <div>Transaction Take</div>
            <div>
              <span>{order?.etherscan?.transactionTake}</span>
              <Image src="/icons/orderIcon/copy.svg" width={16} height={16} alt="copy" />
            </div>
          </div>
          <div className={styles.adress}>
            <div>Transaction Complete</div>
            <div>
              <span>{order?.etherscan?.transactionComplete}</span>
              <Image src="/icons/orderIcon/copy.svg" width={16} height={16} alt="copy" />
            </div>
          </div>
        </> :
        activeTab === "History" ?
        <>
          <div className={styles.adress}>
            <div>Created</div>
            <div>
              {order?.history?.created}
            </div>
          </div>
          <div className={styles.adress}>
            <div>Taken</div>
            <div>
              {order?.history?.taken}
            </div>
          </div>
          <div className={styles.adress}>
            <div>Contract End</div>
            <div>
              {order?.history?.contractEnd}
            </div>
          </div>
          <div className={styles.historyTitle}>Payments Buyer</div>
          <div className={styles.adress}>
            <div>Sent collateral with slippage</div>
            <div className={styles.historyPayments}>
              <span>{order?.history?.sentCollateralWithSlippage[0]}</span>
              <span>{order?.history?.sentCollateralWithSlippage[1]}</span>
            </div>
          </div>

          <div className={styles.adress}>
            <div>Return slippage</div>
            <div className={styles.historyPaymentsGreen}>
              <span>{order?.history?.returnSlippage[0]}</span>
              <span>{order?.history?.returnSlippage[1]}</span>
            </div>
          </div>

          <div className={styles.adress}>
            <div>Receive payout</div>
            <div className={styles.historyPaymentsGreen}>
              <span>{order?.history?.receivePayoutBuyer[0]}</span>
              <span>{order?.history?.receivePayoutBuyer[1]}</span>
            </div>
          </div>

          <div className={styles.adress}>
            <div>Result</div>
            <div className={styles.resultBuyer}>
              <span>{order?.history?.resultBuyer}</span>
            </div>
          </div>

          <div className={styles.historyTitle}>Payments Seller</div>
          <div className={styles.adress}>
            <div>Sent collateral certaine</div>
            <div className={styles.historyPayments}>
              <span>{order?.history?.sentCollateralCertaine[0]}</span>
              <span>{order?.history?.sentCollateralCertaine[1]}</span>
            </div>
          </div>

          <div className={styles.adress}>
            <div>Receive payout</div>
            <div className={styles.historyPaymentsGreen}>
              <span>{order?.history?.receivePayoutSeller[0]}</span>
              <span>{order?.history?.receivePayoutSeller[1]}</span>
            </div>
          </div>

          <div className={styles.adress}>
            <div>Result</div>
            <div className={styles.resultBuyer}>
              <span>{order?.history?.resultSeller}</span>
            </div>
          </div>
        </> :
         activeTab === "Action" ? 
          <>
            <div className={styles.actionTitle}>
              <Image src="/icons/orderIcon/info.svg" width={16} height={16} alt="info" />
              <span className={styles.action}>Finalise the contract to be able to withdraw payout.</span>
            </div>
            <p className={styles.btn}>
              <Button title='Receive payout' onClick={() => console.log("Receive payout")} />
            </p>
          </>
        : null
      }
    </div>
  )
}
const Order = ({order} : {order: OrderModel}) => {
  const [ activeTab, setActiveTab ] = useState(tabs[0])

  return (
    <>
    <div
      style={{"background" : "#09080C", "borderRadius" : "8px 8px 0px 0px"}}
      className={styles.order}>
      <Image src={order?.icon} width={24} height={24} alt="icon currency" />
      <div className={styles.currency}>{order?.title}</div>
      <div className={styles.available}>{order?.available}</div>
      <div className={styles.date}>
        <div>{order?.dateStart}</div>
        <div>{order?.dateEnd}</div>
      </div>
    </div>
    <div className={styles.tabs}>
      {
        tabs?.map(tab => {
          return (
            <div
              onClick={() => setActiveTab(tab)}
              key={tab?.id}
              className={tab?.id === activeTab?.id ? styles.activeTab : styles.tab}>
              {tab.title}
            </div>
          )
        })
      }
    </div>
    <ActiveContent order={order} activeTab={activeTab?.title} />
    </>
  )
}

const DealInfoContent = () => {
    const [ checked, setChecked ] = useState(radioList[0]);
    return (
      <div className={styles.dashboard}>
        <UserInfo />
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

        <div className={styles.orderList}>
          {orderList?.map(order => <Order key={order.id} order={order}/>)}
        </div>
        <div className={styles.btn}>
          <Button title='Take'  onClick={() => console.log("deal")}/> 
        </div>
      </div>
    )
}

export default DealInfoContent