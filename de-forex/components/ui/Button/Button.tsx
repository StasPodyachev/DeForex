import styles from './Button.module.css'

const Button = 
  ({title, onClick, logoPath} : {title: string, onClick : () => void, logoPath?: string}) => {
  return (
    <div onClick={() => onClick()} className={styles.btn}>
      {title}
    </div>
  )
}

export default Button