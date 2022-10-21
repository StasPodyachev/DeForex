import { useEffect, useState } from 'react'
import { useProvider } from 'wagmi'
import DashboardContent from '../components/Dashboard'
import Layout from '../components/Layouts/Layout'

export default function Dashboard() {
  const provider = useProvider()
  const [ networkId, setNetworkId ] = useState(provider?._network?.chainId)

  useEffect(() =>{
    if(provider) setNetworkId(provider?._network?.chainId)
  }, [provider])

  return (
    <Layout title="Dashboard">
      <DashboardContent networkId={networkId} />
    </Layout>
  )
}