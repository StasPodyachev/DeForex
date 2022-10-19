import Layout from '../../components/Layouts/Layout'
import Order from '../../components/Order/Order';
import { useContract, useSigner } from 'wagmi'
import addresses from '../../contracts/addresses';
import DEFOREX_ABI from '../../contracts/ABI/Deforex.sol/Deforex.json'

export default function OrderBook() {
  const { data: signer } = useSigner()
  const contract = useContract({
    addressOrName: addresses?.deforex?.address,
    contractInterface: DEFOREX_ABI.abi ,
    signerOrProvider: signer,
  })

  return (
      contract ?
      <Layout title="OrderBook">
      <Order contract={contract} />
    </Layout> : null
    
  )
}