import { BigNumber } from '@ethersproject/bignumber'
import { erc20ABI as any } from 'wagmi'

export const approve  = async (contractAprove, contract, MaxUint256 : any) => {
  await contractAprove?.approve(contract, MaxUint256).then((res) => {
    return res
  })
}

export const approved  = async (contractAprove, addressWallet, contract : any) => {
  return await contractAprove?.allowance(contract, addressWallet).then((res) => {
    return res._hex !== "0x00" ? true : false
  })
}

export const createPosition = async (contract, tokenSell,tokenBuy, amount, leverage, slippage : any) => {
  await contract?.createPosition(tokenSell,tokenBuy, BigInt(amount), leverage, "0x").then((res) => {
    return res
  })
}

export const deposit = async ( contract, amount1, amount2: any) => {
  await contract?.deposit(amount1, amount2).then((res) => {
    console.log(res, 'deposit');
    return res
  })
}

export const requiresApproval = async (
  contract,
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