import styles from './Layout.module.css'
import React, { ReactNode } from "react";
import Header from '../Header';
// import WidgetPanel from '../WidgetPanel';

const Layout = ({children, title} : {children : ReactNode, title: string}) => {
  return (
    <div className={styles.layout}>
      <Header title={title} />
      {children}
      {/* <WidgetPanel /> */}
    </div>
  )
}

export default Layout