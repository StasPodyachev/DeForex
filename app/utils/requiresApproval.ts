import { BigNumber } from '@ethersproject/bignumber'
import { ERC20 } from 'contracts/abis/types'

export const requiresApproval = async (
  contract: any | null,
  account: string | null | undefined,
  spenderAddress: string,
  minimumRequired: number | BigNumber = 0
) => {
  if (!contract || !account) return false

  try {
    const response = await contract.allowance(account, spenderAddress)
    const hasMinimumRequired =
      (typeof minimumRequired === 'number' && minimumRequired > 0) ||
      (BigNumber.isBigNumber(minimumRequired) && minimumRequired.gt(0))
    if (hasMinimumRequired) {
      return response.lt(minimumRequired)
    }
    return response.lte(0)
  } catch (error) {
    console.error(error)

    return true
  }
}
