import styles from './Order.module.css'
import Input from '../ui/Input/Input'
import Button from '../ui/Button'
import { useEffect, useState } from 'react'
import { approve, approved, deposit } from './utils'
import { useContract } from 'wagmi'
import ALP_ABI from '../../contracts/ABI/ALP.sol/ALP.json'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { ConnectBtn } from '../ConnectBtn/ConnectBtn'

const Pool = ({
  showMarket,
  valueInputPool,
  setValuePool,
  address,
  signer,
  contractERC20Dai, contractERC20USDC, contractERC20USDT} : any) => {
  const { push } = useRouter()
  const [ isApproveDAI, isSetApproveDAI ] = useState(false)
  const [ isApproveUSDC, isSetApproveUSDC ] = useState(false)
  const [ isApproveUSDT, isSetApproveUSDT ] = useState(false)

  const contract = useContract({
    address: '0xc9f0d14b648bba58999fa5b45f2eb4c5ede0c09f',
    abi: ALP_ABI?.abi ,
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
      approved(contractERC20USDT, contract?.address, address).then((res) => {
        isSetApproveUSDT(res)
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
            <div className={styles.btn}>
              {!isApproveUSDT ?
                  <Button
                    onClick={() => approve(contractERC20USDT,contract?.address, ethers?.constants?.MaxUint256).then(res => isSetApproveUSDT(true))} title={`Approve USDT`} />
              : !isApproveUSDC ?
                  <Button
                    onClick={() => approve(contractERC20USDC,contract?.address, ethers?.constants?.MaxUint256).then(res => isSetApproveDAI(true))} title={`Approve USDC`} />
              : !isApproveDAI ?
                  <Button
                    onClick={() => approve(contractERC20Dai,contract?.address, ethers?.constants?.MaxUint256).then(res => isSetApproveDAI(true))} title={`Approve DAI`} />
                  : null
              }
              </div>

              <div className={styles.btns}>
                <Button
                  disable={isApproveDAI && isApproveUSDC && isApproveUSDT ? false : true}
                  onClick={() => isApproveDAI && isApproveUSDC && isApproveUSDT &&  depositCreation() } title="Deposit" />
                <Button disable={true} onClick={() => console.log()} title="Withdraw" />
              </div>
            </> : 
            <div className={styles.btn}>
              <ConnectBtn />
            </div>
        }
      </div>
  )
}

export default Pool