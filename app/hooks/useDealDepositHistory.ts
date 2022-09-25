import { Derivative_ETH_ABI, getDepositHistory } from 'contracts'
import addresses from 'contracts/addresses'
import { useQuery } from 'react-query'
import { useContract } from './useContract'
import useDealStatus from './useDealStatus'

const useDealDepositHistory = (deal: any) => {
  const { isCreated } = useDealStatus(deal)
  const enabled = !!deal?.dealID && !isCreated

  const contract = useContract(addresses.derivativeEthUsd, Derivative_ETH_ABI)

  const { data } = useQuery(['depositHistory', deal?.dealID], async () => getDepositHistory(deal?.dealID, contract), {
    retry: false,
    enabled,
  })

  return {
    isDepositHistory: enabled,
    data,
  }
}

export default useDealDepositHistory
