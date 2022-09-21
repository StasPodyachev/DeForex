import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './WidgetPanel.module.css'

const widgets = [
  {
    id: 0,
    icon: "/icons/panelIcons/market.svg",
    title: 'Market',
    href: '/'
  },
  {
    id: 1,
    icon: "/icons/panelIcons/dashboard.svg",
    title: 'Dashboard',
    href: '/dashboard'
  },  {
    id: 2,
    icon: "/icons/panelIcons/test.svg",
    title: 'Test',
    href: '/test'
  }
]

const Widget = ({widget} : any) => {
  const { route } = useRouter()
  return (
    <Link href={widget?.href}>
      <a>
        <div className={ route != widget.href ? styles.widget : styles.active }>
          <div>
            <Image src={widget?.icon} alt="icon" width={20} height={22} />
          </div>
          <span>{widget?.title}</span>
        </div>
      </a>
    </Link>
  )
}

const WidgetPanel = () => {
  return (
    <div className={styles.panel}>
      {widgets?.map(widget => <Widget key={widget?.id} widget={widget} />)}
    </div>
  )
}

export default WidgetPanel