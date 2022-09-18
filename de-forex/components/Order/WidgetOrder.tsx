
import Image from 'next/image'
import styles from './Order.module.css'

const WidgetOrder = () => {
  return (
    <div className={styles.widget}>
      <div className={styles.itemWidget}>
        <Image src="/icons/orderIcon/clock.svg" alt='clock' width={24} height={24} />
        <p>History</p>
      </div>
      <div className={styles.itemWidget}>
        <Image src="/icons/orderIcon/graph.svg" alt='clock' width={24} height={24} />
        <p>Graphic</p>
      </div>
      <div className={styles.itemWidget}>
        <Image src="/icons/orderIcon/settings.svg" alt='clock' width={24} height={24} />
        <p>Settings</p>
      </div>
    </div>
  )
}

export default WidgetOrder