
import styles from './Tab.module.css'

const Tab = ({tab, checked, setChecket, disbled} :
  {tab: {id: number, title: string}, checked : boolean, disbled: boolean, setChecket: () => void}) => {
  return (
    !disbled ?
    <div onClick={() => setChecket()} className={checked ? styles.activeTab : styles.tab}>
      <span>{tab?.title}</span>
    </div> :
    <div className={styles.disbled}>
      <span>{tab?.title}</span>
    </div>
  )
}

export default Tab