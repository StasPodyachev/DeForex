import { ReactNode } from 'react'
import styles from './Modal.module.css'

const Modal = ({children, isShow} : {children : ReactNode, isShow: boolean}) => {

  return (
    isShow ?
    <div className={styles.modal}>
      <div className={styles.modalBody}>
        {children}
      </div>
    </div> : null
  )
}
export default Modal