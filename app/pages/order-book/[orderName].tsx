import Layout from '../../components/Layouts/Layout'
import Order from '../../components/Order/Order';
import { useContract, useProvider, useSigner } from 'wagmi'
import addresses from '../../contracts/addresses';
import DEFOREX_ABI from '../../contracts/ABI/Deforex.sol/Deforex.json'
import { useEffect, useState } from 'react';

export default function OrderBook() {
  const { data: signer } = useSigner()
  const provider = useProvider()
  const [ networkId, setNetworkId ] = useState(provider?._network?.chainId)

  useEffect(() =>{
    if(provider) setNetworkId(provider?._network?.chainId)
  }, [(provider?._network?.chainId)])

  useEffect(() =>{
    console.log(networkId, 'networkId');
  }, [networkId])
  
  // const contract = useContract({
  //   address: addresses[networkId === 420 ? 0 : 1]?.deforex?.address,
  //   abi: DEFOREX_ABI.abi ,
  //   signerOrProvider: signer,
  // })

  return (
    <Layout title="OrderBook">
      <Order networkId={networkId} />
    </Layout>
    
  )
}