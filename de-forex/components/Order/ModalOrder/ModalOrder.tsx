import Image from "next/image"
import Button from "../../ui/Button"
import Coin from "../../ui/Coin"
import Modal from "../../ui/Modal"
import styles from './ModalOrder.module.css'
interface OrderDetailsModel {
  type: string
  price: string
  rounded: string,
  leverageRate: string
}
interface ContractsModel {
  id: string
  rate: string
  available: number
  leverage: number
  date: string
}

const Contract = ({contract, leverageRate, type, coin} : {contract : ContractsModel, leverageRate: string, type: string, coin: any}) => {
  return (
    <div className={styles.contract}>
      <div className={styles.contractHeader}>
        <div className={styles.id}>Contract #{contract?.id}</div>
        <div className={styles.expires}><span>Expires at</span><span>{contract?.date}</span></div>
      </div>

      <div className={styles.contractBody}>
        <div className={type === "buy" ? styles.contractRateBuy : styles.contractRateSell }>
          <span>Rate</span>
          <div><Coin coin={coin}/></div>
        </div>
        <div className={type === "buy" ? styles.contractAvailableBuy : styles.contractAvailableSell }>
          <span>Available</span>
          <div>{contract.available}</div>
        </div>
        <div className={type === "buy" ? styles.contractLeverageBuy : styles.contractLeverageSell }>
          <span>Leverage</span>
          <div><p>{leverageRate}</p>{contract?.leverage}</div>
        </div>
      </div>
      <div className={styles.btn}>
        <Button title={type === "buy" ? "Buy" : "Sell"} onClick={() => console.log(type)} />
      </div>
    </div>
  )
}

const ModalOrder = ({contracts, orderDetails, show, close, coin}
    : {contracts: ContractsModel[], orderDetails: OrderDetailsModel, show: boolean, close: () => void, coin : any }) => {
  return (
    <Modal isShow={show}>
      <div className={styles.header}>
        <div onClick={() => close()} className={styles.arrow}>
          <Image src="/icons/orderIcon/arrow.svg" width={28} height={28} alt="close"/>
        </div>
        <div className={styles.title}>
          <span>Price</span>
          <p className={orderDetails?.type === "buy" ? styles.priceBuy : styles.priceSell }><Coin coin={coin}/></p>
          <div className={styles.rounded}>rounded {orderDetails?.rounded}</div>
        </div>
        <div onClick={() => close()} className={styles.close}>
          <Image src="/icons/orderIcon/close.svg" width={28} height={28} alt="close"/>
        </div>
      </div>
      {contracts?.map(contract => <Contract coin={coin} type={orderDetails?.type} leverageRate={orderDetails?.leverageRate} contract={contract} key={contract?.id} />)}
    </Modal>
  )
}

export default ModalOrder