import { useEffect, useState } from 'react'
import { Divide as Hamburger } from 'hamburger-react'
import styles from './Nav.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { useAccount } from 'wagmi'

const navigation = [
  { name: 'Market', href: '/', current: true },
  { name: 'Dashboard', href: '/dashboard', current: false },
  { name: 'Order Book', href: '/orders', current: false },
  { name: 'FAQ', href: '/faq', current: false },
]

const Nav = ({openAcc} : {openAcc: () => void}) => {
  const { address } = useAccount()
  const [isOpen, setIsOpen] = useState(false)
  const [ newAdress, setNewAdress ] = useState('')

  useEffect(() => {
    address !== undefined && setNewAdress(`${address?.slice(0, 6)}...${address?.slice(address?.length - 4, address?.length)}`)
  }, [address])

  return (
    <div>
      <div className={styles.burger}>
        <div className={styles.icons}>
        { !newAdress ?
          <div className={styles.wallet}>
            {/* <Image src="/icons/orderIcon/wallet.svg" width={24} height={24} alt='wallet' /> */}
            <Link href="/signin">
              <a><span>Connect to Wallet</span></a>
            </Link>
          </div> : 
          <div className={styles.user} onClick={() => openAcc()}>
            <span>{newAdress}</span>
            <Image src="/icons/iconsDashboard/avatar.png" width={24} height={24} alt='wallet' />
          </div>
          
        }
          <div className={styles.burgeIcon} onClick={() => setIsOpen(!isOpen)}>
            <Hamburger size={20} color='#fff' /></div>
          </div>
        </div>
      {
        isOpen ? 
        <div className={styles.navMobile}>
          <div className={styles.navigation}>
            {
              navigation.map(item => {
                return (
                  <div key={item.name} className={styles.link}>
                    <Link href={item?.href}>
                      <a>
                        {item?.name}
                      </a>
                    </Link>
                  </div>
                )
              })
            }
          </div>
          <div className={styles.imageBurgerMenu}>
            <Image src='/images/burger-menu.png' layout='fill' alt="bg" />
          </div>
        </div> : null
      }
    </div>
  )
}

export default Nav