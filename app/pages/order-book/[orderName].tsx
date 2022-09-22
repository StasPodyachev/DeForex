import Layout from '../../components/Layouts/Layout'
import Order from '../../components/Order/Order';
import { useContract, useSigner } from 'wagmi'
import {  GetServerSideProps } from 'next'
import addresses from '../../contracts/addresses';
import DEFOREX_ABI from '../../contracts/ABI/Deforex.sol/Deforex.json'
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
  const { data: signer, isError, isLoading } = useSigner()
  const contract = useContract({
    addressOrName: addresses?.deforex?.address,
    contractInterface: DEFOREX_ABI.abi ,
    signerOrProvider: signer,
  })

  return (
      contract ?
      <Layout title="OrderBook">
      <Order contract={contract} order={testOrder} coin={coin} />
    </Layout> : null
    
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { orderName } = context?.query;
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/dai`);
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