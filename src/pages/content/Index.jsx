import React, { useState } from 'react'
import { NavBar, Space, TabBar } from 'antd-mobile'
import Text from './text/Index'
import Comment from './comment/Index'
import styles from './index.module.scss'
import { useNavigate, useLocation } from 'react-router-dom'
import { Grid, Popup, Input, Toast } from 'antd-mobile'
import { StarOutline, HandPayCircleOutline, LikeOutline, UpCircleOutline, SearchOutline, MoreOutline } from 'antd-mobile-icons'
import { getArticleById, articleAgree, sendComment } from '../../api/index'

export default function Index() {

  // let id = userRef(useLocation().search.slice(4));

  // eslint-disable-next-line no-unused-vars
  const [urlId, setUrlId] = useState(useLocation().search.slice(4)); // 文章urlId
  const [info, setInfo] = useState({}) // 文章详细信息
  const [auth, setAuth] = useState({}) // 文章作者信息
  const [comment, setComment] = useState(false) // 底部评论弹框
  const [commentNum, setCommentNum] = useState(0) // 评论数
  const [text, setText] = useState('') // 发送评论
  const [agree, setAgree] = useState({}) // 点赞样式控制
  const [agrees, setAgrees] = useState(0) // 点赞数量控制
  const [activeKey, setActiveKey] = useState('text') // 正文与评论区控制

  const personInfo = JSON.parse(sessionStorage.getItem('user')) // 登陆人信息

  // 绑定子组件
  let commentRef = React.createRef();

  React.useEffect(() => {
    getInfo()
    return () => { }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 获取文章信息
  async function getInfo() {
    try {
      let result = (await getArticleById({ id: urlId, user: personInfo })).data
      let article = result.data

      setInfo(article)
      setAuth(article.auther)
      setAgree(result.beAgree)
      setAgrees(article.agree)
      setCommentNum(article.commentNum)
    } catch (error) {
      console.log(`请求报错`);
    }
  }

  // 发送评论
  async function sendCommnet() {
    const personInfo = JSON.parse(sessionStorage.getItem('user'))
    // 用户未登录：return 出去
    if (!personInfo) {
      Toast.show({
        icon: 'fail',
        content: '请先登录！',
      })
      return
    }
    console.log(text);
    let obj = {
      articleId: urlId,
      userId: personInfo._id,
      userName: personInfo.username,
      text: text
    }
    let result = await sendComment(obj)
    console.log(result);
    if (result.data.flag) {
      setCommentNum(result.data.commentNum)
      Toast.show({
        icon: 'success',
        content: '发送成功！',
      })

      // 重新发一次请求获取最新信息 
      getInfo()
      commentRef.current.func();
      // 清空输入框
      setText('')
      // 关闭底部弹框
      setComment(false)
    } else {
      Toast.show({
        icon: 'fail',
        content: '发送失败！',
      })
    }
  }

  // 文章点赞
  async function isAgree() {
    const personInfo = JSON.parse(sessionStorage.getItem('user'))
    // 用户未登录：return 出去
    if (!personInfo) {
      Toast.show({
        icon: 'fail',
        content: '请先登录！',
      })
      return
    }
    let obj = {
      articleId: urlId,
      userId: personInfo._id,
      operate: 3
    }
    console.log(`点赞`, obj);
    try {
      let result = (await articleAgree(obj)).data
      console.log(`result`, result);
      setAgree(result.data)
      setAgrees(result.agree)
      if (result.data) {
        Toast.show({
          icon: 'success',
          content: '点赞成功！',
        })
      } else {
        Toast.show({
          icon: 'fail',
          content: '取消点赞！',
        })
      }
    } catch (error) {
      console.log(`请求报错`);
    }
  }

  const tabs = [
    {
      key: 'text',
      title: '正文',
    },
    {
      key: 'discuss',
      title: '评论',
    }
  ]



  const right = (
    <div style={{ fontSize: 24 }}>
      <Space style={{ '--gap': '16px' }}>
        <SearchOutline />
        <MoreOutline />
      </Space>
    </div>
  )

  const setRouteActive = (value) => {
    setActiveKey(value)
    // console.log(value);
  }

  const navigate = useNavigate()

  const back = () => {
    console.log(`返回`);
    navigate(-1)
  }

  return (
    <>

      <NavBar right={right} onBack={back}>
        <TabBar onChange={value => setRouteActive(value)}>
          {tabs.map(item => (
            <TabBar.Item key={item.key} title={item.title} />
          ))}
        </TabBar>
      </NavBar>
      {
        activeKey === 'text' ? <Text info={info} auth={auth} /> : <Comment urlId={urlId} commentNum={commentNum} onRef={commentRef} />
      }

      <div className={styles.tarBar}>
        <Grid columns={2} gap={8}>
          <Grid.Item>
            <div className={styles.comment} onClick={() => {
              setComment(true)
            }}>评论(已有{commentNum}条评论)</div>
            <Popup
              visible={comment}
              onMaskClick={() => {
                setComment(false)
              }}
              bodyStyle={{ minHeight: '20vh' }}
            >
              <div className={styles.textComment}>
                <Input
                  placeholder='请输入内容'
                  value={text}
                  onChange={val => {
                    setText(val)
                  }}
                  clearable
                />
                {text ? <UpCircleOutline fontSize={36} onClick={() => { sendCommnet() }} /> : <></>}
              </div>
            </Popup>
          </Grid.Item>
          <Grid.Item>
            <div className={styles.bing}>
              <div className={styles.box}><StarOutline />收藏</div>
              <div className={styles.box}><HandPayCircleOutline />充电</div>
              <div className={styles.box} style={agree === true ? { color: 'cornflowerblue' } : { color: 'black' }} onClick={() => isAgree()}><LikeOutline />{agrees === 0 ? "点赞" : agrees}</div>
            </div>
          </Grid.Item>
        </Grid>
      </div>
    </>
  )
}
