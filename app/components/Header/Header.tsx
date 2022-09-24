import styles from './Header.module.css'
import Logo from './Logo'
import Nav from './Nav'

const Header = ({title} : {title: string}) => {
  return (
    <header className={styles.header}>
      <Logo />
      <Nav/>
    </header>
  )
}

export default Header