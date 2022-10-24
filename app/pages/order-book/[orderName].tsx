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
  }, [provider])
  
  const contract = useContract({
    address: addresses[0]?.deforex?.address,
    abi: DEFOREX_ABI.abi ,
    signerOrProvider: signer,
  })

  return (
      contract ?
      <Layout title="OrderBook">
      <Order contract={contract} networkId={networkId} />
    </Layout> : null
    
  )
}