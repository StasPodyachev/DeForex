import Image from 'next/image'
import styles from './DashboardContent.module.css'

const UserInfo = () => {
  return (
    <div className={styles.user}>
      <Image src="/icons/iconsDashboard/avatar.png" width={40} height={40} alt='user' />
      <div className={styles.userInfo}>
        <div>0xBBB6...e96e </div>
        <div>5020.40 tUSD</div>
      </div>
    </div>
  )
}

export default UserInfo