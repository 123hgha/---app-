import React from 'react'
import { TabBar } from 'antd-mobile'
import {
  useNavigate,
  useLocation,
  Outlet
} from 'react-router-dom'
import {
  AppOutline,
  MessageOutline,
  UnorderedListOutline,
  UserOutline,
  BankcardOutline
} from 'antd-mobile-icons'

import styles from './index.module.scss'

const Bottom = () => {
  const history = useNavigate()
  const location = useLocation()
  const { pathname } = location

  const setRouteActive = (value) => {
    // console.log(`+++`, pathname);
    history(value)
  }

  const tabs = [
    {
      key: '/tabbar/home',
      title: '首页',
      icon: <AppOutline />,
    },
    {
      key: '/tabbar/dynamic',
      title: '动态',
      icon: <BankcardOutline />,
    },
    {
      key: '/tabbar/community',
      title: '发布',
      icon: <UnorderedListOutline />,
    },
    {
      key: '/tabbar/game',
      title: '我的消息',
      icon: <MessageOutline />,
    },
    {
      key: '/tabbar/my',
      title: '个人中心',
      icon: <UserOutline />,
    },
  ]

  return (
    <TabBar activeKey={pathname} onChange={value => setRouteActive(value)}>
      {tabs.map(item => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} to={item.key} />
      ))}
    </TabBar>
  )
}

export default function Index() {
  return (
    <div className={styles.body}>
      <div className={styles.main}>
        <Outlet />
      </div>
      <div className={styles.bottom}>
        <Bottom />
      </div>
    </div>
  )
}
