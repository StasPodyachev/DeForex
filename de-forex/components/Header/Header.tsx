
import { useState } from 'react'
import Account from '../Account'
import styles from './Header.module.css'
import Logo from './Logo'
import Nav from './Nav'

const Header = ({title} : {title: string}) => {
  const [ showAcc, setShowAcc ] = useState(false)
  const closeAcc = () => setShowAcc(false)
  const openAcc = () => setShowAcc(true)
  return (
    <header className={styles.header}>
      <Logo />
      <Account showAcc={showAcc } close={closeAcc} />
      {/* <div className={styles.title}>{title}</div> */}
      <Nav openAcc={openAcc}/>
    </header>
  )
}

export default Header