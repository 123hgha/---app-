import React, { useState } from 'react'
import { NavBar, Button, Dialog, Toast, Input, Grid, ImageUploader } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import { getUserInfo, updateUserInfo, uploadAvatar } from '../../../api/index'
import styles from './update.module.scss'

export default function Update() {

    const navigate = useNavigate()
    const [personInfo, setPersonInfo] = useState({});
    const [avatar, setAvatar] = useState('');
    const [age, setAge] = useState(0);
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');

    React.useEffect(() => {
        // 获取本地个人信息
        const info = JSON.parse(sessionStorage.getItem('user'))

        if (!info) {
            Toast.show({
                icon: 'fail',
                content: '请先登录!',
              })
            navigate(`/tabbar/my`)
            return
        }

        // 获取个人详细信息
        getUser(info);


        return () => { }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    // 获取个人详细信息
    async function getUser(data) {
        try {
            let res = await getUserInfo(data)
            setPersonInfo(res.data.data)
            setAvatar(res.data.avatar)
            setAge(res.data.data.age)
            setAddress(res.data.data.address)
            setEmail(res.data.data.email)
        } catch (error) {
            console.log(`请求报错`);
        }
    }

    const right = (
        <Button color='primary' fill='none' onClick={() => { updateInfo() }}>
            保存
        </Button>
    )

    // 保存用户修改的信息
    const updateInfo = async () => {
        let info = {
            avatar,
            id: personInfo._id,
            age,
            address,
            email,
        }
        try {
            let res = await updateUserInfo(info)
            console.log(res);
            if (res.data.status === 0) {
                Toast.show({ content: '修改成功！', position: 'bottom' })
                getUser(personInfo)
            }
        } catch (error) {
            console.log(`请求报错`);
        }
    }

    // 返回
    const back = () => { navigate(`/tabbar/my`) }

    // 退出登录
    const exit = async () => {
        const result = await Dialog.confirm({
            content: '是否退出登录',
        })
        if (result) {
            // 清空本地所有临时数据
            sessionStorage.clear();
            Toast.show({ content: '退出登录成功', position: 'bottom' })
            navigate(`/tabbar/my`)
        }
    }

    // 上传头像
    const LimitCount = (props) => {

        const { avatar, changeUrl } = props

        const maxCount = 1
        const [fileList, setFileList] = useState([
            {
                url: '',
            },
        ])

        React.useEffect(() => {
            if (avatar) {
                setFileList([{ url: avatar }])
            }
            return () => { }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        // 上传接口
        const upload = async (file) => {

            const formData = new FormData();
            formData.append('avatar', file)
            const res = await uploadAvatar(formData)
            // console.log(`当前上传的地址`,res.data,file);
            setFileList(res.data)
            // 传给父组件
            changeUrl(res.data)
            return {
                url: res.data
            }
        }

        return (
            <ImageUploader
                value={fileList}
                onChange={setFileList}
                upload={upload}
                multiple
                maxCount={3}
                showUpload={fileList.length < maxCount}
                onCountExceed={exceed => {
                    Toast.show(`最多选择 ${maxCount} 张图片，你多选了 ${exceed} 张`)
                }}
            />
        )
    }

    return (
        <>
            <NavBar right={right} onBack={back}>
                设置
            </NavBar>
            <h1>修改个人信息</h1>
            <div className={styles.box}>
                <Grid style={{ width: '100%' }} columns={3} gap={8}>
                    <Grid.Item>
                        <div>头像</div>
                    </Grid.Item>
                    <Grid.Item span={2}>
                        <LimitCount avatar={avatar} changeUrl={(url) => { setAvatar(url) }} />
                    </Grid.Item>
                    <Grid.Item>
                        <div>用户名</div>
                    </Grid.Item>
                    <Grid.Item span={2}>
                        <div style={{ textAlign: 'left' }}>{personInfo.username}</div>
                    </Grid.Item>
                    <Grid.Item>
                        <div>年龄</div>
                    </Grid.Item>
                    <Grid.Item span={2}>
                        <Input
                            placeholder='请输入年龄'
                            type='number'
                            value={age}
                            onChange={val => {
                                setAge(val)
                            }}
                            min={0}
                            max={150}
                        />
                    </Grid.Item>
                    <Grid.Item>
                        <div>地址</div>
                    </Grid.Item>
                    <Grid.Item span={2}>
                        <Input
                            placeholder='请输入地址'
                            value={address}
                            onChange={val => {
                                setAddress(val)
                            }}
                        />
                    </Grid.Item>
                    <Grid.Item>
                        <div>邮箱</div>
                    </Grid.Item>
                    <Grid.Item span={2}>
                        <Input
                            placeholder='请输入邮箱'
                            value={email}
                            onChange={val => {
                                setEmail(val)
                            }}
                        />
                    </Grid.Item>
                </Grid>
            </div>
            <Button block color='primary' size='large' onClick={() => exit()}>
                退出登录
            </Button>
        </>
    )
}
