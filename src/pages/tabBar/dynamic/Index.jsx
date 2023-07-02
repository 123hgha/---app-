import React, { useState, useEffect } from 'react'
import styles from './index.module.scss'
import { Avatar, Toast, Empty } from 'antd-mobile'
import { MessageOutline, LikeOutline } from 'antd-mobile-icons'
import { getUserArticle } from '../../../api/index'
import { useNavigate } from 'react-router-dom'

export default function Index() {

  const [data, setData] = useState([])

  const navigate = useNavigate()

  useEffect(() => {
    const personInfo = JSON.parse(sessionStorage.getItem('user'))
    if (personInfo === null) {
      Toast.show({
        icon: 'fail',
        content: '请先登录!',
      })
      navigate(`/tabbar/my`)
    }
    console.log(`获取数据`);
    getData()
    return () => { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 获取文章数据
  async function getData() {
    try {
      const userId = JSON.parse(sessionStorage.getItem('user'))._id

      const res = await getUserArticle({ state: 0, id: userId })

      const append = res.data.data

      if (append) {
        append.reverse();
        setData(val => val = [...append])
      }
    } catch (error) {
      console.log(`请求报错`);
    }
  }

  // 跳转文章
  const navigete = useNavigate()

  function showDetail(item) {
    navigete(`/content?id=${item}`)
  }


  return (
    <div style={{ padding: '0 .5rem' }}>
      <div className={styles.head}>
        <div>
          个人动态
        </div>
        <div>
          筛选
        </div>
      </div>
      {data.map(item => (
        <div className={styles.card} onClick={() => { showDetail(item._id) }}>
          <div className={styles.user}>
            <Avatar src={item.auther.avatar} className={styles.avatar} />
            <div className={styles.name}>
              <span style={{ 'fontSize': '15px' }}>{ }</span>
              <span>{item.auther.username}</span>
            </div>
          </div>
          <div className={styles.title}>
            {item.title}
          </div>
          <div className={styles.text}>
            <div dangerouslySetInnerHTML={{ __html: item.text }} />
          </div>
          <div className={styles.img}>
            <div>
              {item.cover ?
                <img style={{ width: '100%', height: '100%' }} src={item.cover} alt='' />
                :
                <Empty description='暂无数据' />
              }
            </div>
            <div>
              {item.cover ?
                <img style={{ width: '100%', height: '100%' }} src={item.cover} alt='' />
                :
                <Empty description='暂无数据' />
              }</div>
            <div>
              {item.cover ?
                <img style={{ width: '100%', height: '100%' }} src={item.cover} alt='' />
                :
                <Empty description='暂无数据' />
              }</div>
          </div>
          <div className={styles.head}>
            <div>
              {item.creatTime}
            </div>
            <div>
              <MessageOutline />{item.commentNum}
              <LikeOutline />{item.agree}
            </div>
          </div>
        </div>
      ))}

      <div style={{ width: '100%', height: '3rem' }}></div>
    </div>
  )
}
