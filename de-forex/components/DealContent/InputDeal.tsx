import styles from './InputDeal.module.css'

function numberWithSpaces(x: string | number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const InputDeal = () => {
  
  return (
    <div className={styles.input}>
      <input type="text" placeholder='Input deposit' />
    </div>
  )
}

export default InputDeal