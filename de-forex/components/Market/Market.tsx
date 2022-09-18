import ListMarket from './ListMarket/ListMarket'
import styles from './Market.module.css'

const Market = ({coin} : any) => {
  return (
    <div className={styles.main}>
      <p className={styles.title}>
        <span>A contract for difference (CFD)</span> is a contract between a buyer and a seller that stipulates that the buyer must pay the seller the difference between the current value of an asset and its value at contract time. FDs allow traders and investors an opportunity to profit from price movement without owning the underlying assets.
      </p>

      <ListMarket coin={coin} />
    </div>
  )
}

export default Market