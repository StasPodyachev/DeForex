import Image from 'next/image'
import { useEffect, useState } from 'react'
import styles from './Input.module.css'
interface InputModel {
  value: string
  icon: string
  currencies?: {id: number, title: string, icon: string, address: string}[]
  setValue: (str: string) => void
  activeCurrency?: {id: number, title: string, icon: string, address: string}
  secondCurrency?: {id: number, title: string, icon: string, address: string}
  setActiveCurrency?: ({id, title, icon, address } : {id: number, title: string, icon: string, address: string}) => void
  pool?: boolean
  disabled?: boolean 
}

const Input = ({value, pool, icon, secondCurrency, disabled, currencies, setValue, activeCurrency, setActiveCurrency} : InputModel) => {
  const [ showCurrency, setShowCurrenncy ] = useState(false)
  const changeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event?.target?.value);
  };

  return (
    <div className={styles.input}>
      <Image
        alt="currency"
        src={disabled ? secondCurrency?.icon : activeCurrency?.icon}
        width={24} height={24}
        />
      <input disabled={disabled} type="number" value={value} onChange={changeValue} />
      {
        !pool ?
          <div className={styles.currencies} 
          onClick={() => setShowCurrenncy(!showCurrency)}>
          <div className={styles.activeCurrency}>
            <span>{disabled ? secondCurrency?.title : activeCurrency?.title}</span>
            {
              !disabled ?
              <div className={styles.arrow}
              style={!showCurrency ? {"transform": "rotate(-90deg)"}:
              {"transform": "rotate(90deg)"}}>
                <Image
                  src='/icons/orderIcon/arroww.svg'
                  width={24} height={24} alt="arrow" />
            </div> : null
            }
            {
              showCurrency ?
              <div className={styles.currency}>
                { !disabled ?
                  currencies?.map((currency) => {
                    return(
                      <div onClick={() => setActiveCurrency(currency)} key={currency.id}>
                        {currency.title}
                      </div>
                    )
                  }) : null
                }
              </div> : null
            }
          </div>
        </div> : 
        <div className={styles.max}>
          <span>{activeCurrency.title}</span>
          <span>MAX 15,000</span>
        </div> 
      }
    </div>
    
  )
}

export default Input

function currency() {
  throw new Error('Function not implemented.')
}
