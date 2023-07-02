import React, { useState, useImperativeHandle } from 'react'
import styles from './index.module.scss'
import { Footer } from 'antd-mobile'
import { LikeOutline } from 'antd-mobile-icons'
// import { useLocation } from 'react-router-dom'
import { getComments } from '../../../api/index'

export default function Index(props) {

  const { urlId, commentNum } = props
  // const [agree, setAgree] = useState(0)
  const [comments, setComments] = useState([])

  //用useImperativeHandle暴露一些外部ref能访问的属性
  useImperativeHandle(props.onRef, () => {
    return {
      func: getComment,
    };
  });

  React.useEffect(() => {
    getComment();
    return () => { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // console.log(`props`, data);
  // const id = useLocation().search.slice(4);

  // 获取评论信息
  async function getComment() {
    try {
      let result = (await getComments({ id: urlId })).data
      console.log(result);

      // 设置评论数
      // setAgree(result.article.agree);

      // 设置评论
      setComments(result.comments);

    } catch (error) {
      console.log(`请求报错`);
    }
  }

  return (
    <div style={{ padding: "0 .5rem" }}>
      <div className={styles.header}>
        <div>评论 {commentNum}</div>
        <div>热门</div>
      </div>
      {
        comments.map(i =>
        (
          <div className={styles.box}>
            <div className={styles.user}>
              <div>
                <div className={styles.header}>
                  {
                    i.avatar ?
                      <img src={i.avatar ? i.avatar : ''} alt='' style={{ width: '100%', height: '100%' }} />
                      :
                      <></>
                  }
                </div>
                <div className={styles.username}>
                  {i.userName}
                </div>
                <div>
                  {i.creatTime}
                </div>
              </div>
              <div>
                {/* <Button color='primary' fill='solid' onClick={() => { }}>
                  + 关注
                </Button> */}
                <LikeOutline />
              </div>
            </div>
            <div className={styles.text}>
              {i.text}
            </div>
          </div>
        ))
      }
      <Footer label='没有更多了'></Footer>
      <div className={styles.foot}></div>
    </div>
  )
}
