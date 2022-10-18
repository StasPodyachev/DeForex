import { useEffect } from "react";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import styles from "./Button.module.css";
import { BIG_1E18 } from "./misc";
import BigDecimal from "decimal.js-light";
import { useRouter } from "next/router";


const CreateDealBtn = ({
  title,
  contract,
  abi,
  tokenSell,
  tokenBuy,
  amount,
  leverage
}: any) => {

  const { push } = useRouter()

  const newCount =
    BigInt(new BigDecimal(amount).mul(BIG_1E18 + "").toFixed(0)) + "";
  // const newPercent =
  //   BigInt(new BigDecimal(percent).mul(BIG_1E18 + "").toFixed(0)) + "";
  // const newSlapagge =
  //   BigInt(new BigDecimal(slipagge).mul(BIG_1E18 + "").toFixed(0)) + "";
  const slippage = "0x"
  console.log(tokenSell, 'tokenSell')
  console.log(tokenBuy, 'tokenSell')
  console.log(amount, 'amount')
  console.log(leverage, 'leverage')
  const { config } = usePrepareContractWrite({
    addressOrName: contract.address,
    contractInterface: abi,
    functionName: "createPosition",
    args: [tokenSell ,tokenBuy, newCount, leverage, slippage],
    onError(error) {
      console.log("Error", error);
    },
  });

  const { write: create, isLoading, isSuccess } = useContractWrite(config);
  if (isSuccess) {
    push('/dashboard')
  }
  return (
    <div onClick={() => {
      create && create?.()
      // create?.()
      // console.log(tokenSell, 'tokenSell')
      // console.log(tokenBuy, 'tokenSell')
      // console.log(amount, 'amount')
      // console.log(leverage, 'leverage')
      // console.log(
      //   tokenSell,
      //   tokenBuy,
      //   amount,
      //   leverage)
    }} className={styles.btn}>
      {title}
    </div>
  );
};

export default CreateDealBtn;
