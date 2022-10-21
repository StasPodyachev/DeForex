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
  const slippage = "0x"
  const { config } = usePrepareContractWrite({
    addressOrName: contract.address,
    contractInterface: abi,
    functionName: "createPosition",
    args: [tokenSell,tokenBuy, amount, leverage, slippage],
  });

  const { write: create, isLoading, isSuccess } = useContractWrite(config);
  useEffect(() => {
    console.log(
      tokenBuy, 'tokenBuy');
  }, [create])
  if (isSuccess) {
    push('/dashboard')
  }
  return (
    <div onClick={() => {create?.()}} className={styles.btn}>
      {title}
    </div>
  );
};

export default CreateDealBtn;
