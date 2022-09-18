
import styles from './Tab.module.css'

const Tab = ({tab, checked, setChecket} :
  {tab: {id: number, title: string}, checked : boolean, setChecket: () => void}) => {
  return (
    <div onClick={() => setChecket()} className={checked ? styles.activeTab : styles.tab}>
      <span>{tab?.title}</span>
    </div>
  )
}

export default Tab