import DealContent from '../components/DealContent'
import Layout from '../components/Layouts/Layout'

export default function Deal({coin} : any) {
  return (
    <Layout title="Create Deal">
      <DealContent coin={coin} />
    </Layout>
  )
}

export const getServerSideProps = async () => {
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/ethereum`);
  const data = await res.json();
  const price = data?.market_data?.current_price?.usd
  const percentChange = data?.market_data.price_change_24h_in_currency.usd.toFixed(2)
  const priceChange = data?.market_data.price_change_percentage_24h_in_currency.usd.toFixed(2)
  
  return {
      props: {
        coin: {
          price,
          priceChange,
          percentChange
        }
      }
  };
}