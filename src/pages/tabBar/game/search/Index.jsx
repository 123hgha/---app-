import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NavBar, Input, List, Image, Button } from 'antd-mobile'
import { SearchOutline } from 'antd-mobile-icons'
import { dimGetUser, initiateChat } from '../../../../api/index'
import styles from './index.module.scss'

export default function Index() {

    const [personInfo, setPersonInfo] = useState({})
    const [text, setText] = useState('')
    const [userList, setUserList] = useState([])

    const navigate = useNavigate()

    React.useEffect(() => {
        // 获取本地个人信息
        // const personInfo = store.getState()
        const personInfo = JSON.parse(sessionStorage.getItem('user'))
        setPersonInfo(personInfo)
        return () => { }
    }, [])

    const back = () => {
        console.log(`返回`);
        navigate(-1)
    }

    // 搜索用户
    async function onSearch() {
        console.log(`掉了吗`);
        try {
            const res = (await dimGetUser({ text, user: personInfo })).data
            console.log(res.data, `请求成功返回的参数`);
            setUserList(res.data)
        } catch (error) {
            console.log(`请求报错`);
        }
    }

    // 发送信息
    async function send(id, name){
        // console.log(`>>>`,id);
        // 判断选择的用户是否存在当前用户的聊天列表中
        try {
            const res = (await initiateChat({ userId: personInfo._id, toId: id, toName: name })).data
            console.log(res.data, `请求成功返回的参数`);
        } catch (error) {
            console.log(`请求报错`);
        }
        // 跳转至聊天页
        navigate(`/chat?id=${id}`)
    }


    return (
        <>
            <NavBar onBack={back}>搜索</NavBar>
            <div style={{ padding: '0 .5rem' }}>
                <div className={styles.input}>
                    <Input
                        placeholder='请输入内容'
                        value={text}
                        onChange={val => {
                            setText(val)
                        }}
                    />
                    <div onClick={() => onSearch()}>
                        <SearchOutline />
                    </div>
                </div>
                <div className={styles.list}>
                    <List header='用户列表'>
                        {userList.map(user => (
                            <List.Item
                                key={user._id}
                                prefix={
                                    <Image
                                        src={user.avatar}
                                        style={{ borderRadius: 20 }}
                                        fit='cover'
                                        width={40}
                                        height={40}
                                    />
                                }
                                description={user.username}
                            >
                                {user.username}
                                <div style={{ float: 'right' }}>
                                    <Button color='primary' onClick={ () => send(user._id, user.username) }>发送消息</Button>
                                </div>
                            </List.Item>
                        ))}
                        <span>--- 我是有底线的 ---</span>
                    </List>
                </div>
            </div>
        </>
    )
}
