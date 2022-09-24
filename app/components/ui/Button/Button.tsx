import styles from './Button.module.css'

const Button = 
  ({title, onClick, logoPath, disable} : {disable?: boolean ,title: string, onClick : () => void, logoPath?: string}) => {
  return (
    <div onClick={() => onClick()} className={!disable ? styles.btn : styles.btnDisable } >
      {title}
    </div>
  )
}

export default Button