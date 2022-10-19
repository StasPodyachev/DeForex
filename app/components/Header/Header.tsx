import styles from './Header.module.css'
import Logo from './Logo'
import Nav from './Nav'
import { ConnectKitButton } from 'connectkit';

const Header = ({title} : {title: string}) => {
  return (
    <header className={styles.header}>
      <Logo />
        <ConnectKitButton theme="midnight" showAvatar />
      <Nav/>
    </header>
  )
}

export default Header