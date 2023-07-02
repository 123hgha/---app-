import React, { useState, useEffect } from 'react'
import styles from './index.module.scss'
import { ScanningOutline, SetOutline, MailOutline, QuestionCircleOutline } from 'antd-mobile-icons'
import { Avatar, List, Button, Toast, Empty } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
// import store from '../../../redux/store'
import { getUserInfo } from '../../../api/index'

export default function Index() {

  const navigate = useNavigate()

  const [show, setShow] = useState(false)
  // eslint-disable-next-line no-unused-vars
  const [personInfo, setPersonInfo] = useState({})

  useEffect(() => {
    // 获取本地个人信息
    // const personInfo = store.getState()
    const personInfo = JSON.parse(sessionStorage.getItem('user'))

    if (personInfo) {
      // 获取个人详细信息
      getInfo(personInfo._id)
    }

    if (personInfo !== null) {
      setShow(true)
    } else {
      setShow(false)
    }
    return () => { }
  }, [])

  const getInfo = async (id) => {
    try {
      const result = await getUserInfo({ _id: id })
      console.log(result, `1321`);
      setPersonInfo(result.data.data)
    } catch {
      console.log(`接口报错`);
    }
  }


  // 跳转登陆页
  function login() {
    navigate(`/login`)
  }

  // 跳转修改个人信息页
  function update() {
    if (personInfo === null) {
      Toast.show({
        icon: 'fail',
        content: '请先登录!',
      })
      return
    }
    navigate(`/update`)
  }

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>
          个人中心
        </div>
        <div className={styles.type}>
          <ScanningOutline fontSize={28} />
          <SetOutline fontSize={28} onClick={() => update()} />
          <MailOutline fontSize={28} />
        </div>
      </div>
      <div className={styles.person}>
        <List>
          <List.Item
            prefix={<Avatar src={personInfo.avatar} />}
            description='Deserunt dolor ea eaque eos'
          >
            {
              show === false ? <Button
                onClick={() => login()}
              >
                点击登录
              </Button> :
                <span>
                  {personInfo.username}
                </span>
            }

          </List.Item>
        </List>
        <div style={{ width: '100%' }}>
          <Empty
            style={{ padding: '64px 0' }}
            image={
              <QuestionCircleOutline
                style={{
                  color: 'var(--adm-color-light)',
                  fontSize: 48,
                }}
              />
            }
            description='暂无数据'
          />
        </div>
      </div>
    </>
  )
}