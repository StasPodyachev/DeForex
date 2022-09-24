import Image from 'next/image'
import { useState } from 'react'
import styles from './Select.module.css'

interface ModelMarket {
  id: number
  icons?: {
    icon: string
  }[]
  title: string,
  orderName?: string
}

interface ModelProps {
  markets: ModelMarket[]
  execution?: boolean
  active: ModelMarket
  setActive: (ModelMarket) => void
}

const Select = ({markets, active, setActive, execution} : ModelProps) => {
  const [show, setShow] = useState(false)
    
  return (
    <div className={styles.select}>
      <div className={styles.active} onClick={() => setShow(!show)}>
        {
          !execution ?
          <div className={styles.icons}>
            {active?.icons?.map(icon => {
              return (
                <div key={icon?.icon}>
                  <Image src={icon?.icon} height={24} width={24} alt="icon" />
                </div>
              )
            })}
          </div> : null
        }
        <span style={execution ? {"fontSize" : "16px"} : {"fontSize" : "12px"}}>{active.title}</span>
        <div className={styles.arrow}
        style={!show ? {"transform": "rotate(-90deg)"} : {"transform": "rotate(90deg)"}}>
          <Image src='/icons/orderIcon/arroww.svg' width={24} height={24} alt="arrow" />
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
              <span style={execution ? {"fontSize" : "16px"} : {"fontSize" : "12px"}}>{item.title}</span>
            </div>
          : null)
        })
        : null
      }
    </div>
  )
}

export default Select