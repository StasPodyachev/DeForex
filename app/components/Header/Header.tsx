import styles from './Header.module.css'
import Logo from './Logo'
import Nav from './Nav'
import {  } from '@rainbow-me/rainbowkit';
import { ConnectBtn } from '../ConnectBtn/ConnectBtn';

const Header = ({title} : {title: string}) => {
  return (
    <header className={styles.header}>
      <Logo />
      <ConnectBtn/>
      <Nav/>
    </header>
  )
}

export default Header