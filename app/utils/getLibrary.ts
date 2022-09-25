// import { Web3Provider } from '@ethersproject/providers'

// export default function getLibrary(provider: any): Web3Provider {
//   const library = new Web3Provider(provider)
//   library.pollingInterval = 12000
//   return library
// }

import { ethers } from 'ethers'

export default function getLibrary(provider: any): ethers.providers.Web3Provider {
  const library = new ethers.providers.Web3Provider(provider, 'any')
  library.pollingInterval = 12000
  return library
}
