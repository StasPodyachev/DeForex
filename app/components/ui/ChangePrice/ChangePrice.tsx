import styles from './ChangePrice.module.css'
const ChangePrice = ({coin} : {coin : any}) => {
  const priceChange = coin?.priceChange
  const percentChange = coin?.percentChange
  return (
    <div className={priceChange < 0 ? styles.priceR : styles.priceG}>
      <p>{priceChange}</p> 
      <p>({percentChange}%)</p>
    </div>
  )
}
export default ChangePrice