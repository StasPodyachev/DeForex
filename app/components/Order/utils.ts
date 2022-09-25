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