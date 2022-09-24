import styles from './Order.module.css'
import Input from '../ui/Input/Input'
import Button from '../ui/Button'
import { useEffect, useState } from 'react'
import { approve, approved, deposit } from './utils'
import { useContract } from 'wagmi'
import addresses from '../../contracts/addresses'
import ALP_ABI from '../../contracts/ABI/ALP.sol/ALP.json'
import { ethers } from 'ethers'
import getRoute from './quote'

const Pool = ({
  showMarket,
  valueInputPool,setValuePool,
  address,
  signer,
  contractERC20Dai, contractERC20USDC} : any) => {

  const [ isApproveDAI, isSetApproveDAI ] = useState(false)
  const [ isApproveUSDC, isSetApproveUSDC ] = useState(false)

  const contract = useContract({
    addressOrName: addresses?.AlpDaiUsdc?.address,
    contractInterface: ALP_ABI.abi ,
    signerOrProvider: signer,
  })

  const depositCreation = () => {
    const amount = showMarket?.currency[0].title === "USDC" || showMarket?.currency[0].title === "USDT" ? +`${valueInputPool}e6` : +`${valueInputPool}e18`;
    deposit(contract, showMarket.currency[0].address, BigInt(amount))
  }

  useEffect(() => {
    if (address && signer) {
      approved(contractERC20USDC, contract?.address, address).then((res) => {
        console.log(res, 'contractERC20USDC');
        isSetApproveUSDC(res)
      })
      approved(contractERC20Dai, contract?.address, address).then((res) => {
        console.log(res, 'contractERC20Dai');
        isSetApproveDAI(res)
      })
    }
  }, [address, signer])

  return (
    <div className={styles.pool}>
        <Input
          pool
          activeCurrency={showMarket?.currency[0]}
          value={valueInputPool}
          setValue={setValuePool}
          icon={showMarket.icons[0].icon} />

        <Input
          pool
          activeCurrency={showMarket.currency[1]}
          value={valueInputPool}
          setValue={setValuePool}
          icon={showMarket.icons[1].icon} />
        <div className={styles.staked}>Staked amount <span style={{"color" : '#31C471', "fontWeight" : '700'}}>20,000</span> DAIUSDC</div>

        <div className={styles.options}>
          <p>TVL <span style={{"color" : '#31C471', "fontWeight" : '700'}}>1,000,000,000</span> USD</p>
          <p>My share <span style={{"color" : '#31C471', "fontWeight" : '700'}}>0.002% </span></p>
          <p>Est. APY <span style={{"color" : '#31C471', "fontWeight" : '700'}}>17.84% </span></p>
        </div>

        <div className={styles.btns}>
          {!isApproveUSDC ?
            <Button
              onClick={() =>approve(contractERC20USDC,contract?.address, ethers?.constants?.MaxUint256)} title="Approve USDT" />
          : null}
          {!isApproveDAI ?
          <Button
            onClick={() =>approve(contractERC20Dai,contract?.address, ethers?.constants?.MaxUint256)} title="Approve DAI" />
          : null}
        </div>

        <div className={styles.btns}>
          <Button
            disable={isApproveDAI && isApproveUSDC ? false : true}
            onClick={() => isApproveDAI && isApproveUSDC &&  depositCreation() } title="Deposit" />
          <Button disable={true} onClick={() => console.log()} title="Withdraw" />
        </div>
      </div>
  )
}

export default Pool