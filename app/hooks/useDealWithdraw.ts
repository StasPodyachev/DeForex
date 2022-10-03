import { useActiveWeb3React } from 'hooks/web3'

import { getBalanceByDeal, FACTORY_ABI } from 'contracts'
import { useQuery } from 'react-query'
import useDealStatus from './useDealStatus'
import { useContract } from './useContract'
import addresses from 'contracts/addresses'

const useDealWithdraw = (deal: any) => {
  const { account } = useActiveWeb3React()
  const { isCompleted, isCanceled } = useDealStatus(deal)
  const contract = useContract(addresses.factory, FACTORY_ABI)

  const { data, isLoading, isFetching, isFetched } = useQuery(
    ['balanceByDeal', deal?.derivativeID, deal?.dealID, account],
    async () => getBalanceByDeal(deal?.derivativeID, deal?.dealID, account, contract)
  )

  const [depositL, depositS, paymentL, paymentS] = data ?? []

  const isWithdrawETH = (isCompleted || isCanceled) && paymentS?.amount > 0
  const isWithdrawERC = (isCompleted || isCanceled) && depositS?.amount > 0

  const isWithdraw = isWithdrawETH || isWithdrawERC

  return {
    isLoading,
    isFetched,
    isFetching,
    isWithdraw,
    isWithdrawETH,
    isWithdrawERC,
    depositL,
    depositS,
    paymentL,
    paymentS,
  }
}

export default useDealWithdraw
