import { Contract } from '@ethersproject/contracts'
import { useMemo } from 'react'
import { useWeb3React } from '@web3-react/core'
import UniswapInterfaceMulticallJson from '@uniswap/v3-periphery/artifacts/contracts/lens/UniswapInterfaceMulticall.sol/UniswapInterfaceMulticall.json'

import { UniswapInterfaceMulticall } from 'types/v3'
import addresses from 'contracts/addresses'
import { ERC20_ABI } from 'contracts'
import { ERC20 } from 'contracts/abis/types'

import ERC20_BYTES32_ABI from 'contracts/abis/erc20_bytes32.json'
import { getContract } from 'utils/index'
import { isChainAllowed } from 'utils/switchChain'
import { MAINNET_PROVIDER } from 'constants/networks'
import { JsonRpcProvider } from '@ethersproject/providers'

const { abi: MulticallABI } = UniswapInterfaceMulticallJson

export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: any,
  withSignerIfPossible = true
): T | null {
  const { provider, account, chainId, connector } = useWeb3React()

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !provider || !chainId) return null
    let address: string | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      let predictProvider: JsonRpcProvider = provider

      if (!withSignerIfPossible) {
        const allow = isChainAllowed(connector, chainId)
        if (!allow) predictProvider = MAINNET_PROVIDER
      }

      return getContract(address, ABI, predictProvider, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, ABI, provider, chainId, withSignerIfPossible, account, connector]) as T
}

export function useInterfaceMulticall() {
  return useContract<UniswapInterfaceMulticall>(addresses.multicall, MulticallABI, false) as UniswapInterfaceMulticall
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<ERC20>(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}
