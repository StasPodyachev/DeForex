import { Interface } from '@ethersproject/abi'
import { AGGREGATOR_INTERFACE_ABI } from 'contracts/index'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'
// import useBlockNumber from 'lib/hooks/useBlockNumber'
// import { CurrencyAmount, Token } from '@uniswap/sdk-core'
// import { useWeb3React } from '@web3-react/core'
import { useMultipleContractSingleData } from 'lib/hooks/multicall'
import { AggregatorInterfaceInterface } from 'contracts/abis/types/AggregatorInterface'
import { SupportedChainId } from 'constants/chains'
import { useWeb3React } from '@web3-react/core'

const oracleInterface = new Interface(AGGREGATOR_INTERFACE_ABI) as AggregatorInterfaceInterface
const tokenBalancesGasRequirement = { gasRequired: 185_000 }

const useOracleAmount = (currencyOracleAddress: any): BigNumber => {
  const { chainId } = useWeb3React()
  // console.log('CALL')

  const validAddress = useMemo(
    () => [currencyOracleAddress[chainId ?? SupportedChainId.OPTIMISTIC_KOVAN]],
    [chainId, currencyOracleAddress]
  )

  const results = useMultipleContractSingleData(
    validAddress,
    oracleInterface,
    'latestAnswer',
    useMemo(() => [], []),
    tokenBalancesGasRequirement
  )

  // console.log({ results })

  const anyLoading: boolean = useMemo(() => results.some((callState) => callState.loading), [results])

  return useMemo(() => {
    const value = results?.[0]?.result?.[0]
    const amount = value ? BigNumber.from(value.toString()) : BigNumber.from(0)
    return amount
  }, [results, currencyOracleAddress, anyLoading])
}

// export const useOracleCurrencyAmount = (currencyOracleAddress: any): CurrencyAmount<Token> => {
//   const oracleContract = useContract(currencyOracleAddress, ORACLE_ABI)
//   const block = useBlockNumber()
//   const token = new Token(1, '', 8, '', '')
//   const [result, setResult] = useState(CurrencyAmount.fromRawAmount(token, 0))

//   useMemo(async () => {
//     const answer = await getAnswer(oracleContract)

//     setResult(CurrencyAmount.fromRawAmount(token, answer.toString()))
//   }, [block])

//   return result
// }

export default useOracleAmount
