import Image from 'next/image'
import { useState } from 'react'
import styles from './Input.module.css'
interface InputModel {
  value: string
  icon: string
  currencies?: {id: number, title: string}[]
  setValue: (str: string) => void
  activeCurrency?: {id: number, title: string}
  setActiveCurrency?: ({id, title} : {id: number, title: string}) => void
  pool?: boolean
}

const Input = ({value, pool, icon, currencies, setValue, activeCurrency, setActiveCurrency} : InputModel) => {
  const [ showCurrency, setShowCurrenncy ] = useState(false)
  const changeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event?.target?.value);
  };

  return (
    <div className={styles.input}>
      <Image
        alt="currency"
        src={icon}
        width={24} height={24}
        />
      <input type="number" value={value} onChange={changeValue} />
      {
        !pool ?
          <div className={styles.currencies} 
          onClick={() => setShowCurrenncy(!showCurrency)}>
          <div className={styles.activeCurrency}>
            <span>{activeCurrency.title}</span>
            <div
              className={styles.arrow}
              style={!showCurrency ? {"transform": "rotate(-90deg)"}:
              {"transform": "rotate(90deg)"}}>
                <Image
                  src='/icons/orderIcon/arroww.svg'
                  width={24} height={24} alt="arrow" />
            </div>
            {
              showCurrency ?
              <div className={styles.currency}
                >
                {
                  currencies?.map((currency) => {
                    return(
                      <div onClick={() => setActiveCurrency(currency)} key={currency.id}>
                        {currency.title}
                      </div>
                    )
                  })
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
