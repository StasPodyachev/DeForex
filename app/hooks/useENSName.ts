import type { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'

export default function useENSName(address: string) {
  const { provider, chainId } = useWeb3React<Web3Provider>()
  const [ENSName, setENSName] = useState('')

  useEffect(() => {
    if (provider && typeof address === 'string') {
      let stale = false

      provider
        .lookupAddress(address)
        .then((name) => {
          if (!stale && typeof name === 'string') {
            setENSName(name)
          }
        })
        .catch(() => {})

      return () => {
        stale = true
        setENSName('')
      }
    }

    return
  }, [provider, address, chainId])

  return ENSName
}
