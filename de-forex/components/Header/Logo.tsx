import Image from 'next/image'
import Link from 'next/link'
import styles from './Header.module.css'

const Logo = () => {
  return (
    <div className={styles.logo}>
      <Link href="/">
        <a><Image src="/images/logo-dark.svg" width={62} height={24} alt="logo Cfd" /></a>
      </Link>
    </div>
  )
}

export default Logo