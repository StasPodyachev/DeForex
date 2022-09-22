
export const approve  = async (contractAprove, contract, MaxUint256 : any) => {
  await contractAprove?.approve(contract, MaxUint256).then((res) => {
    return res
  })
}

export const createPosition = async (contract, tokenSell,tokenBuy, amount, leverage, slippage : any) => {
  await contract?.createPosition(tokenSell,tokenBuy, BigInt(amount), leverage, slippage).then((res) => {
    return res
  })
}