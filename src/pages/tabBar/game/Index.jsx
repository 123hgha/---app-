import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.scss'
import { SearchOutline, AddCircleOutline } from 'antd-mobile-icons'
import { Avatar, List, Toast, Badge } from 'antd-mobile'
import { getUsersHasFriends } from '../../../api/index'

const { io } = require("socket.io-client");

export default function Index() {

  // eslint-disable-next-line no-unused-vars
  const [personInfo, setPersonInfo] = useState({})
  const [mesList, setMesList] = useState([])
  const [badge, SetBadge] = useState(0)

  const navigate = useNavigate()

  // 初始化连接
  const socket = io('http://127.0.0.1:8002');

  useEffect(() => {

    const personInfo = JSON.parse(sessionStorage.getItem('user'))

    setPersonInfo(personInfo)
    if (!personInfo) {
      Toast.show({
        icon: 'fail',
        content: '请先登录!',
      })
      navigate(`/tabbar/my`)
      return
    }

    getRecordsList(personInfo);

    // 注册通信，向服务器发起 soket 请求链接
    loginSocket(personInfo._id);

    // 监听服务器发来的信息
    getMessage();

    return () => {
      socket.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  // 获取当前用户聊天列表
  async function getRecordsList(mes) {
    let res = await getUsersHasFriends({ id: mes._id });
    setMesList(res.data.data);
  }

  // 注册通信
  const loginSocket = (id) => {
    // console.log(`personInfo`, id);
    socket.emit('login', id
    )
  }

  // 监听客户端发送的信息
  const getMessage = () => {

    socket.on('chat message', (msg, fromId) => {

      // 接收到的信息
      setMesList((val) => {
        for (let i of val) {
          if (i.toId === fromId) {
            i.newMsg = msg
          }
        }
        return [...val]
      });

      // 修改信息提示
      SetBadge(val => val + 1)
      console.log(badge);
    })
  }

  // 跳转至聊天页
  function showDetail(id) {

    navigate(`/chat?id=${id}`)

  }

  // 跳转至搜索页
  function selectSearch() {
    navigate('/search')
  }

  return (
    <>
      <div className={styles.header}>
        <div className={styles.title}>
          <Avatar src={'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'} />
        </div>
        <div style={{ fontSize: "1.5rem" }}>聊天</div>
        <div className={styles.type}>
          <SearchOutline fontSize={36} />
          <AddCircleOutline fontSize={36} onClick={() => selectSearch()} />
        </div>
      </div>
      <div className={styles.body}>

        <List>

          {
            mesList.map(item => {
              return (
                <List.Item
                  prefix={
                    badge === 0 ?
                      <Avatar src={'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'} />
                      :
                      <Badge content={badge}>
                        <Avatar src={'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'} />
                      </Badge>
                  }
                  description={item.newMsg}
                  onClick={() => showDetail(item.toId)}
                  key={item.toId}
                >
                  <div className={styles.name}>
                    <div>{item.toName}</div>
                  </div>
                </List.Item>
              )
            })
          }
        </List>

      </div>
    </>
  )
}
