import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './index.module.scss'
import { Avatar, Input } from 'antd-mobile'
import { LeftOutline, UpCircleOutline } from 'antd-mobile-icons'
import { saveMsg, getOldMsg } from '../../api'

const { io } = require("socket.io-client");

export default function Index() {

    // eslint-disable-next-line no-unused-vars
    const [urlId, setUrlId] = useState(useLocation().search.slice(4)); // 好友urlId
    const [text, setText] = useState('') // 发送信息
    const [oldMsg, setOldMsg] = useState([]) // 历史聊天记录
    const [message, setMessage] = useState([]) // 对话窗口信息
    const [personInfo, setPersonInfo] = useState({})
    const [flag, setFlag] = useState(false)

    const navigate = useNavigate()


    // 初始化连接
    const socket = io('http://127.0.0.1:8002');

    React.useEffect(() => {

        // 获取本地个人信息
        const personInfo = JSON.parse(sessionStorage.getItem('user'))
        // console.log(`初始化用户信息`, personInfo);
        setPersonInfo(personInfo)

        // 获取历史聊天记录
        getOldMsgs(personInfo._id, urlId);

        // 注册通信，向服务器发起 soket 请求链接
        loginSocket(personInfo._id);

        // 监听服务器发来的信息
        getMessage();

        return () => { }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [message])

    // 注册通信
    const loginSocket = (id) => {
        // console.log(`personInfo`, id);
        socket.emit('login', id
        )
    }

    // 获取历史聊天记录
    const getOldMsgs = async (useId, friendId) => {
        try {
            if (flag) return
            let result = (await getOldMsg({ useId, friendId })).data
            // console.log(result.msg);
            setOldMsg(result.msg)
            setFlag(true)
        } catch (error) {
            console.log(`请求报错`);
        }
    }

    // 发送信息
    const sendCommnet = () => {

        //发送的信息对象
        let msg = {
            fromId: personInfo._id,
            toId: urlId,
            message: text,
            dateTime: Date.now()
        }

        // 发送到服务器
        socket.emit('chat message', text, personInfo._id
            , urlId)

        // 保存聊天记录
        saveMsgs(msg);

        // 推送到聊天页
        setMessage(val => [...val, msg])

        // 清空输入框
        setText('')
    }

    // 接收信息
    const collcetMsg = (text) => {
        //发送的信息对象
        let msg = {
            fromId: urlId,
            toId: personInfo._id,
            message: text,
            dateTime: new Date()
        }

        // 推送到聊天页
        setMessage(val => [...val, msg])
    }

    // 监听客户端发送的信息
    const getMessage = () => {

        socket.on('chat message', msg => {
            // 接收到的信息
            collcetMsg(msg);
        })

        // console.log(`发送后的message`, message);
    }

    // 保存新的聊天记录
    const saveMsgs = async (message) => {
        try {
            let result = (await saveMsg({ message })).data
            console.log(result);

        } catch (error) {
            console.log(`请求报错`);
        }
    }

    // 退出页面，保存新的聊天记录，注销通信
    const back = () => {
        socket.close();
        console.log(`返回`);
        navigate(`/tabbar/game`)
    }

    return (
        <>
            <div style={{ padding: "0 .5rem" }}>
                <div className={styles.header}>
                    <div>
                        <LeftOutline fontSize={32} onClick={() => { back() }} />
                    </div>
                    <div style={{ fontSize: "1.5rem" }}>聊天</div>
                    <div className={styles.type}>
                        <Avatar src={'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'} />
                    </div>
                </div>

                <div style={{ width: '100%', height: '3.75rem' }}>

                </div>

                {
                    oldMsg.map(item => {
                        return (
                            <div className={styles.box}>
                                {
                                    item.fromId === personInfo._id ?
                                        (<div className={styles.msgMain}>
                                            <div className={styles.toUser} style={{ float: 'right' }}>
                                                <Avatar src={'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'} />
                                            </div>
                                            <div className={styles.text} style={{ float: 'right' }}>
                                                <div className={styles.fromMessage}>
                                                    {item.message}
                                                </div>
                                            </div>
                                        </div>)
                                        :
                                        (
                                            <div className={styles.msgMain}>
                                                <div className={styles.toUser} style={{ float: 'left' }}>
                                                    <Avatar src={'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'} />
                                                </div>
                                                <div className={styles.text} style={{ float: 'left' }}>
                                                    <div className={styles.toMessage}>
                                                        {item.message}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                }
                            </div>
                        )
                    })
                }

                {
                    message.map(item => {
                        return (
                            <div className={styles.box}>
                                {
                                    item.fromId === personInfo._id ?
                                        (<div className={styles.msgMain}>
                                            <div className={styles.toUser} style={{ float: 'right' }}>
                                                <Avatar src={'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'} />
                                            </div>
                                            <div className={styles.text} style={{ float: 'right' }}>
                                                <div className={styles.fromMessage}>
                                                    {item.message}
                                                </div>
                                            </div>
                                        </div>)
                                        :
                                        (
                                            <div className={styles.msgMain}>
                                                <div className={styles.toUser} style={{ float: 'left' }}>
                                                    <Avatar src={'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'} />
                                                </div>
                                                <div className={styles.text} style={{ float: 'left' }}>
                                                    <div className={styles.toMessage}>
                                                        {item.message}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                }
                            </div>
                        )
                    })
                }

                <div style={{ height: '3rem' }}></div>

            </div>
            <div className={styles.input}>
                <Input placeholder='请输入内容'
                    value={text}
                    onChange={val => {
                        setText(val)
                    }} clearable />
                {text ? <UpCircleOutline fontSize={36} onClick={() => { sendCommnet() }} /> : <></>}
            </div>
        </>
    )
}

