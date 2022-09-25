import styles from './Order.module.css'
import Input from '../ui/Input/Input'
import Button from '../ui/Button'
import { useEffect, useState } from 'react'
import { approve, approved, deposit } from './utils'
import { useContract } from 'wagmi'
import ALP_ABI from '../../contracts/ABI/ALP.sol/ALP.json'
import { ethers } from 'ethers'
import ConnectWallet from '../Header/ConnectWallet'
import { useRouter } from 'next/router'

const Pool = ({
  showMarket,
  valueInputPool,
  setValuePool,
  address,
  signer,
  contractERC20Dai, contractERC20USDC} : any) => {
    const { push } = useRouter()
  const [ isApproveDAI, isSetApproveDAI ] = useState(false)
  const [ isApproveUSDC, isSetApproveUSDC ] = useState(false)

  useEffect(() => {
    console.log('provider', signer)
  }, [signer])

  const contract = useContract({
    addressOrName: showMarket?.alpaddress,
    contractInterface: ALP_ABI?.abi ,
    signerOrProvider: signer,
  })

  const depositCreation = () => {
    const amount = showMarket?.currency[0].title === "USDC" || showMarket?.currency[0].title === "USDT" ? +`${valueInputPool}e6` : +`${valueInputPool}e18`;
    deposit(contract, BigInt(amount), BigInt(amount)).then((res) => push("/dashboard"))
  }

  useEffect(() => {
    if (address && signer) {
      approved(contractERC20USDC, contract?.address, address).then((res) => {
        isSetApproveUSDC(res)
      })
      approved(contractERC20Dai, contract?.address, address).then((res) => {
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
        <div className={styles.staked}>Staked amount <span style={{"color" : '#31C471', "fontWeight" : '700'}}>{valueInputPool * 2}</span> {showMarket.currency[0].title}{showMarket.currency[1].title}</div>

        <div className={styles.options}>
          <p>TVL <span style={{"color" : '#31C471', "fontWeight" : '700'}}>1,000,000,000</span> USD</p>
          <p>My share <span style={{"color" : '#31C471', "fontWeight" : '700'}}>0.002% </span></p>
          <p>Est. APY <span style={{"color" : '#31C471', "fontWeight" : '700'}}>17.84% </span></p>
        </div>


        {
          signer ? 
            <>
              <div className={styles.btns}>
                {!isApproveUSDC ?
                  <Button
                    onClick={() => approve(contractERC20USDC,contract?.address, ethers?.constants?.MaxUint256).then(res => isSetApproveDAI(true))} title={`Approve ${showMarket.currency[0].title}`} />
                : null}
                {!isApproveDAI ?
                <Button
                  onClick={() => approve(contractERC20Dai,contract?.address, ethers?.constants?.MaxUint256).then(res => isSetApproveDAI(true))} title={`Approve ${showMarket.currency[1].title}`} />
                : null}
              </div>

              <div className={styles.btns}>
                <Button
                  disable={isApproveDAI && isApproveUSDC ? false : true}
                  onClick={() => isApproveDAI && isApproveUSDC &&  depositCreation() } title="Deposit" />
                <Button disable={true} onClick={() => console.log()} title="Withdraw" />
              </div>
            </> : 
            <div className={styles.btn}>
              <ConnectWallet />
            </div>
        }
      </div>
  )
}

export default Pool