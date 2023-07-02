import React from 'react'
import styles from './register.module.scss'
import { Form, Input, Button, Checkbox, Stepper, Toast, Footer } from 'antd-mobile'
import { LeftOutline } from 'antd-mobile-icons'
import { useNavigate } from 'react-router-dom'
import { userRegister } from '../../../api/index'

export default function Register() {

  // 提交表单数据：校验数据
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

    // 校验两次密码
    if(values.password !== values.toPassword){
      Toast.show({
        icon: 'fail',
        content: '前后两次密码不一致!',
      })
      return      
    }

    // 设置注册时间
    values.createTime = new Date();
    values.avatar = '';
    sendLoginRequest(values)
  }

  // 发送注册请求
  async function sendLoginRequest(data) {
    // console.log(data);
    try {
      const res = await userRegister(data)
      console.log(`res结果`, res);
      if (res.data.status === 0) {
        console.log(`注册成功`);
        Toast.show({
          icon: 'success',
          content: '注册成功!',
        })
        // 跳转到登录页
        toBack(0)
      } else {
        console.log(`注册失败`);
        Toast.show({
          icon: 'fail',
          content: '注册失败!',
        })
      }
    } catch (error) {
      console.log(`请求报错`);
    }
  }

  const navigate = useNavigate()

  // 返回
  function toBack(type) {
    if (type === 1) {
      navigate(`/tabbar/my`)
    } else {
      navigate(`/login`)
    }
  }

  return (
    <>
      <div className={styles.body}>
        <div className={styles.header}>
          <LeftOutline fontSize={36} onClick={() => toBack(1)} />
        </div>
        <div className={styles.header}>
          用户注册
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
              label='设置账号'
              name='username'
              rules={[{ required: true, message: '账号不能为空!' }]}
            >
              <Input placeholder='请输入账号' />
            </Form.Item>
            <Form.Item
              label='设置密码'
              name='password'
              rules={[{ required: true, message: '密码不能为空!' }]}
            >
              <Input placeholder='请输入密码' type='password' />
            </Form.Item>
            <Form.Item
              label='确认密码'
              name='toPassword'
              rules={[{ required: true, message: '密码不能为空!' }]}
            >
              <Input placeholder='请再次输入密码' type='password' />
            </Form.Item>
            <Form.Item
              label='年龄'
              name='age'
            >
              <Stepper digits={0} min={0} max={150} />
            </Form.Item>
            <Form.Item
              label='住址'
              name='address'
              help='详情地址'
            >
              <Input placeholder='请填写地址' />
            </Form.Item>
            <Form.Item
              label='邮箱'
              name='email'
              rules={[{ required: true, pattern: new RegExp(/^\w+@[A-Za-z]+(\.[A-Za-z0-9]+){1,}$/), message: '邮箱格式有误!' }]}
            >
              <Input placeholder='请填写邮箱' />
            </Form.Item>
            <Form.Item
              name='agree'
              rules={[{ required: true, message: '请同意协议!' }]}
            >
              <Checkbox value='1'>已阅读并同意协议</Checkbox>
            </Form.Item>
            <Form.Item>
              <span className={styles.toSignIn} onClick={() => toBack(0)}>已有账号？点击登录</span>
            </Form.Item>
          </Form>
        </div>
        {/* <div className={styles.footer}>
          小白盒
        </div> */}
        <Footer label='小白盒'></Footer>
      </div>
    </>
  )
}
