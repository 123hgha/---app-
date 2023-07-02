import React from 'react'
import styles from './index.module.scss'
// import { useLocation } from 'react-router-dom'
import { Button, Tag } from 'antd-mobile'

export default function Index(props) {

  const { info, auth } = props

  return (
    <div>
      <div className={styles.img}>
        <img src={info.cover} alt='' style={{ width: '100%', height: '100%' }} />
      </div>
      <div className={styles.body}>
        <div className={styles.title}>
          <h1>{info.title}</h1>
        </div>
        <div className={styles.auther}>
          <div>
            <div className={styles.header}>
              {
                info.auther ?
                  <img src={info.auther.avatar ? info.auther.avatar : ''} alt='' style={{ width: '100%', height: '100%' }} />
                  :
                  <></>
              }
            </div>
            <div className={styles.username}>
              {auth.username}
            </div>
            <div>
              {info.creatTime}
            </div>
          </div>
          <div>
            <Button color='primary' fill='solid' onClick={() => { }}>
              + 关注
            </Button>
          </div>
        </div>
        <div className={styles.tag}>
          <Tag color='primary'>{info.kind}</Tag>
        </div>
        <div className={styles.text}>
          <div dangerouslySetInnerHTML={{ __html: info.text }} /></div>
        <div className={styles.footer}>
          <div>文本由小白盒作者：{auth.username}原创</div>
          <div>未经授权禁止转载或摘编</div>
        </div>
      </div>
      <div className={styles.foot}></div>

    </div>
  )
}
