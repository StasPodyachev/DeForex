
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
  await contract?.createPosition(tokenSell,tokenBuy, BigInt(amount), leverage, slippage).then((res) => {
    return res
  })
}

export const deposit = async ( contract, token, amount: any) => {
  await contract?.deposit(token, amount).then((res) => {
    console.log(res);
    return res
  })
}