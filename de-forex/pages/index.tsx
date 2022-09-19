import type { NextPage } from 'next';
import dynamic from "next/dynamic";
const Layout = dynamic(() =>  import('../components/Layouts/Layout'),{ ssr: false });
const Market = dynamic(() =>  import('../components/Market/Market'),{ ssr: false });

const Home: NextPage = ({coin} : any) => {
  return (
    <Layout title="Market">
      <Market coin={coin} />
    </Layout>
  )
}

export default Home

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