import Image from 'next/image'
import { useState } from 'react'
import styles from './Market.module.css'

interface ModelMarket {
  id: number
  icons: {
    icon: string
  }[]
  title: string
}

const Select = ({markets, active, setActive} : {
  markets: ModelMarket[], active: ModelMarket, setActive: (ModelMarket) => void}) => {
  const [show, setShow] = useState(false)
    
  return (
    <div className={styles.select}>
      <div className={styles.active} onClick={() => setShow(!show)}>
        <div className={styles.icons}>
          {
            active?.icons?.map(icon => {
              return (
                <div key={icon?.icon}>
                  <Image src={icon?.icon} height={24} width={24} alt="icon" />
                </div>
              )
            })
          }
        </div>
        <span>{active.title}</span>
        <div className={styles.arrow}
        style={!show ? {"transform": "rotate(-90deg)"} : {"transform": "rotate(90deg)"}}>
          <Image src='/icons/ordericon/arrow.svg' width={24} height={24} alt="arrow" />
        </div>
      </div>
      {
        show ? 
        markets?.map(item => {
          return ( item?.id !== active?.id ?
            <div key={item?.id} className={styles.item}
              onClick={() => {
                setActive(item)
                setShow(false)
              }}>
              <div className={styles.icons}>
                {
                  item?.icons?.map(icon => {
                    return (
                      <div key={icon?.icon}>
                        <Image src={icon?.icon} height={24} width={24} alt="icon" />
                      </div>
                    )
                  })
                }
              </div>
              <span>{item.title}</span>
            </div>
          : null)
        })
        : null
      }
    </div>
  )
}

export default Select