import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from './DashboardContent.module.css'
import { useAccount } from 'wagmi';

const UserInfo = () => {
  const [ show, setShow ] = useState(false)
  const [ newAdress, setNewAdress ] = useState('')
  const { address } = useAccount()

  useEffect(() => {
    address !== undefined && setNewAdress(`${address?.slice(0, 6)}...${address?.slice(address?.length - 4, address?.length)}`)
  }, [address])

  return (
    <div>
      {newAdress ?
      <div>
        <div className={styles.user} onClick={() => setShow(!show)}>
          <div className={styles.arrow}
            style={!show ? {"transform": "rotate(-90deg)"} : {"transform": "rotate(90deg)"}}>
              <Image src='/icons/orderIcon/arroww.svg' width={34} height={34} alt="arrow" />
          </div> 
          <span>2,124.88 USDC</span>
          <div className={styles.userInfo}>
            <div>{newAdress}</div>
            <Image
              src="/icons/iconsDashboard/avatar.png"
              width={24}
              height={24}
              alt='user'/>
          </div>
        </div>
        {
          show ?
            <div className={styles.body}>
              <div className={styles.bodyItem}>
                <span>Total equity</span>
                <span>72469.60 USDt</span>
                <p>↑ 259 past week</p>
              </div>
              <div className={styles.bodyItem}>
                <span>Profit today</span>
                <span style={{"color" : "#6FCF97"}}>258 USDt</span>
              </div>
              <div className={styles.bodyItem}>
                <span>Contracts value</span>
                <span>51358.59 USDt</span>
                <p>x150,25 Leverage</p>
              </div>
            </div> : null
          }
      </div>
      : null}
    </div>
  )
}

export default UserInfo