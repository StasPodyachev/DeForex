function numberWithSpaces(x: string | number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
const Coin = ({coin} : {coin: any}) => {
  const price = coin?.price
  return (
    price ? <span>{numberWithSpaces(price)}</span> : <span>0</span>
  )
}
export default Coin