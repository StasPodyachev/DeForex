
import { signOut } from 'next-auth/react';
import Image from 'next/image'
import { useEffect, useState } from 'react';
import { useAccount, useDisconnect, useBalance } from 'wagmi'
import Modal from '../ui/Modal'
import styles from './Account.module.css'

const Account = ({showAcc, close} : {showAcc: boolean, close:() => void}) => {
  const { address } = useAccount()
  const { data, isError, isLoading } = useBalance({ addressOrName: address })
  const [ newAdress, setNewAdress ] = useState('')
  const { disconnectAsync } = useDisconnect()
  const handleDisconnect = async () => {
    await disconnectAsync()
    signOut({ callbackUrl: '/signin' })
  }
  useEffect(() => {
    address !== undefined && setNewAdress(`${address?.slice(0, 6)}...${address?.slice(address?.length - 4, address?.length)}`) 
  }, [address])

  return (
    <Modal isShow={showAcc}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span>Account</span>
        </div>
        <div onClick={() => close()} className={styles.close}>
          <Image src="/icons/orderIcon/close.svg" width={28} height={28} alt="close"/>
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.wallet}>
          <span>Connected with Metamask</span>
          <div onClick={handleDisconnect} className={styles.btnSmall}>Change</div>
        </div>
        <div className={styles.user}>
          <Image src="/icons/iconsDashboard/avatar.png" width={24} height={24} alt='wallet' />
          <span>{newAdress}</span>
        </div> 
        <div className={styles.copy}>
          <div>
            <Image src="/icons/orderIcon/copy_p.svg" width={16} height={16} alt="copy" />
            <span>Copy address</span>
          </div>
          <div>
            <Image src="/icons/orderIcon/transaction-end.svg" width={16} height={16} alt="copy" />
            <span>View on Explorer</span>
          </div>
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.balance}>
          <Image src="/icons/orderIcon/wallet_balances.svg" width={24} height={24} alt='wallet' />
          <span>Wallet balances</span>
        </div>
        <div className={styles.balanceItem}>
          <Image src="/icons/iconsCurrency/EthereumETH.svg" width={16} height={16} alt='wallet' />
          <span>{data?.formatted} {data?.symbol}</span>
        </div>

        {/* <div className={styles.balanceItem}>
          <Image src="/icons/iconsCurrency/Solana.svg" width={16} height={16} alt='wallet' />
          <span>{data?.formatted} {data?.symbol}</span>
        </div> */}
      </div>

      <div className={styles.block}>
        <div className={styles.balance}>
          <Image src="/icons/orderIcon/rocket.svg" width={24} height={24} alt='wallet' />
          <span>Current Deals</span>
        </div>
      </div>

    </Modal>
  )
}

export default Account