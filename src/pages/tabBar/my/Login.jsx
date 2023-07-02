import React from 'react'
import { Form, Input, Button, Toast, Checkbox } from 'antd-mobile'
import { LeftOutline } from 'antd-mobile-icons'
import styles from './login.module.scss'
import { userLogin } from '../../../api/index'
import { useNavigate } from 'react-router-dom'
import store from '../../../redux/store'

export default function Login() {

  // 提交表单数据
  const onFinish = (values) => {
    // console.log(values)
    // 勾选用户协议
    if (values.agree === false) {
      Toast.show({
        icon: 'fail',
        content: '请先同意用户协议!',
      })
      return
    }
    sendLoginRequest(values)
  }

  // 发送登录请求
  async function sendLoginRequest(data) {
    // console.log(data);
    try {
      const res = await userLogin(data)
      console.log(`res结果`, res);
      if (res.data.status === 0) {
        console.log(`登录成功`);
        Toast.show({
          icon: 'success',
          content: '登录成功!',
        })
        // 将个人信息存到临时缓存中
        setStorage(res.data.data);
        // 跳转到个人主页
        person();
      } else {
        console.log(`登录失败`);
        Toast.show({
          icon: 'fail',
          content: '登录失败!',
        })
      }
    } catch (error) {
      console.log(`请求报错`);
    }
  }

  // 将个人信息存到临时缓存中
  function setStorage(data) {
    console.log(`个人信息`, data);
    store.dispatch({ type: 'signIn', data })
  }

  // 跳转到个人页面
  const navigate = useNavigate()
  function person() {
    navigate(`/tabbar/my`)
  }

  // 跳转到注册页面
  function toSignIn() {
    navigate(`/register`)
  }

  return (
    <>
      <div className={styles.body}>
        <div className={styles.header}>
          <LeftOutline fontSize={36} onClick={() => person()} />
        </div>
        <div className={styles.header}>
          账户密码登录
        </div>
        <div>
          <Form
            layout='vertical'
            onFinish={onFinish}
            footer={
              <Button block type='submit' color='primary' size='large'>
                提交
              </Button>
            }
          >
            <Form.Item
              label='账号'
              name='username'
              rules={[{ required: true, message: '账号不能为空!' }]}
            >
              <Input placeholder='请输入账号' />
            </Form.Item>
            <Form.Item
              label='密码'
              name='password'
              rules={[{ required: true, message: '密码不能为空!' }]}
            >
              <Input placeholder='请输入密码' type='password' />
            </Form.Item>
            <Form.Item
              name='agree'
              rules={[{ required: true, message: '请同意协议!' }]}
            >
              <Checkbox value='1'>已阅读并同意协议</Checkbox>
            </Form.Item>
            <Form.Item>
              <span className={styles.toSignIn} onClick={() => toSignIn()}>没有账号？点我注册</span>
            </Form.Item>
          </Form>
        </div>
        <div className={styles.footer}>
          小白盒
        </div>
      </div>
    </>
  )
}
