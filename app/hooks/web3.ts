import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'

// import { injected } from '../connectors'

import { NetworkContextName } from 'constrants'

export function useActiveWeb3React() {
  const context = useWeb3React<Web3Provider>()
  return context
  // const contextNetwork = useWeb3React<Web3Provider>(NetworkContextName)
  // return context.active ? context : contextNetwork
}

// export function useEagerConnect() {
//   const { activate, active } = useWeb3React()

//   const [tried, setTried] = useState(false)

//   useEffect(() => {
//     injected.isAuthorized().then((isAuthorized) => {
//       if (isAuthorized) {
//         activate(injected, undefined, true).catch(() => {
//           setTried(true)
//         })
//       } else {
//         setTried(true)
//       }
//     })
//   }, [activate])

//   // if the connection worked, wait until we get confirmation of that to flip the flag
//   useEffect(() => {
//     if (!tried && active) {
//       setTried(true)
//     }
//   }, [tried, active])

//   return tried
// }
/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
// export function useInactiveListener(suppress = false) {
//   const { active, error, activate } = useWeb3React()

//   useEffect(() => {
//     const { ethereum } = window as any

//     if (ethereum && ethereum.on && !active && !error && !suppress) {
//       const handleChainChanged = () => {
//         // eat errors
//         activate(injected, undefined, true).catch((error) => {
//           console.error('Failed to activate after chain changed', error)
//         })
//       }

//       const handleAccountsChanged = (accounts: string[]) => {
//         if (accounts.length > 0) {
//           // eat errors
//           activate(injected, undefined, true).catch((error) => {
//             console.error('Failed to activate after accounts changed', error)
//           })
//         }
//       }

//       ethereum.on('chainChanged', handleChainChanged)
//       ethereum.on('accountsChanged', handleAccountsChanged)

//       return () => {
//         if (ethereum.removeListener) {
//           ethereum.removeListener('chainChanged', handleChainChanged)
//           ethereum.removeListener('accountsChanged', handleAccountsChanged)
//         }
//       }
//     }
//     return undefined
//   }, [active, error, suppress, activate])
// }
