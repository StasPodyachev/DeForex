import Layout from '../../components/Layouts/Layout'
import Order from '../../components/Order/Order';
import {  GetServerSideProps } from 'next'
const testOrder = {
  id: 1,
  currencyName: 'ETHtUSD',
  price: 1643.60,
  icon: '/icons/iconsCurrency/EthereumETH.svg',
  description: 'Get profit from ETH price volatility with leverage.',
  duration: 'Duration 1 day - 30 days ',
  leverage: 'Leverage x2 - x30',
  currency: 'Currency USD, EUR',
  orderLink: '/',
  percent: '0.34 (0.10%)'
}

export default function OrderBook({coin} : any) {
  return (
    <Layout title="OrderBook">
      <Order order={testOrder} coin={coin} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { orderName } = context.query;
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/${orderName}`);
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