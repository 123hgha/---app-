import React, { useState } from 'react'
import { Form, Input, Button, ImageUploader, Toast, Mask, Radio } from 'antd-mobile'
import { AddOutline, LeftOutline, CloseOutline } from 'antd-mobile-icons'
import styles from './index.module.scss'
import { addArticle, uploadCover, uploadContents } from '../../../api/index'
// import store from '../../../redux/store'
import { useNavigate } from 'react-router-dom'
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';

export default function Index() {


  const [community, selectCom] = React.useState('')

  const [text, setText] = useState({ editorState: EditorState.createEmpty() }); //初始化富文本内容
  const [contentEdit, setContentEdit] = useState(''); //拿到最新的带有样式的富文本
  const [file, setFile] = useState([]) // 封面图片参数
  const [coverUrl, setCoverUrl] = useState('') // 封面地址
  const [fileList, setFileList] = useState([])

  // 动态改变输入的富文本内容
  const onEditorStateChange = (editorState) => {
    setText({
      editorState: editorState
    })
    let transdata = transformDraftStateToHtml(editorState);
    setContentEdit(transdata);
  };

  const transformDraftStateToHtml = (editorState) => {
    if (!editorState.getCurrentContent) {
      return '';
    }
    return draftToHtml(convertToRaw(editorState.getCurrentContent()));
  };

  const getCom = (value) => {
    console.log(`父组件方法`, value, community);
    selectCom(value)
  }

  // 删除选择的社区
  const deleteCom = () => {
    selectCom('')
  }

  const navigete = useNavigate()

  React.useEffect(() => {
    // 判断用户是否已登录
    // if (store.getState() === null) {
    //   Toast.show({
    //     icon: 'fail',
    //     content: '请先登录!',
    //   })
    //   navigete(`/tabbar/my`)
    // }

    const personInfo = JSON.parse(sessionStorage.getItem('user'))
    if (personInfo === null) {
      Toast.show({
        icon: 'fail',
        content: '请先登录!',
      })
      navigete(`/tabbar/my`)
    }

    return () => { }
  })

  //  上传封面
  async function uploadCoverF(file) {
    const formData = new FormData();
    formData.append('cover', file)
    const res = await uploadCover(formData)
    // console.log(`当前上传的地址`,res.data,file);
    setCoverUrl(res.data)
    return {
      url: res.data
    }
  }


  // 上传文章图片内容
  async function uploadimg(file) {
    const formData = new FormData();
    formData.append('arcImg', file)
    const res = await uploadContents(formData)
    return {
      url: res.data
    }
  }


  // 提交内容
  const onFinish = (values) => {
    values.kind = community
    values.authId = getAuthInfor()
    values.text = contentEdit
    values.cover = coverUrl
    // console.log(`提交的内容`, contentEdit);
    sendRequest(values)
  }

  // 获取登录人信息
  function getAuthInfor() {
    // console.log(`登陆人信息`,store.getState());
    console.log(`登陆人信息`, JSON.parse(sessionStorage.getItem('user')));
    // return store.getState()._id
    return JSON.parse(sessionStorage.getItem('user'))._id
  }

  // 发送请求
  async function sendRequest(data) {
    try {
      const res = await addArticle({ ...data })
      // console.log(res, `请求成功返回的参数`);
      const append = res.data.data
      // console.log(`请求成功`, append);
      if (append) {
        Toast.show({
          icon: 'success',
          content: '添加成功！',
        })
        console.log(`添加成功！`);
        navigete(`/tabbar/dynamic`)
      } else {
        Toast.show({
          icon: 'fail',
          content: res.data.message,
        })
        console.log(`data.message`, res.data.message);
      }
    } catch (error) {
      console.log(`请求报错`);
    }
  }

  return (
    <div>
      <div className={styles.head}><span>图文</span></div>

      <Form
        onFinish={onFinish}
        footer={
          <>
            <Button block type='submit' color='primary' size='large'>
              提交
            </Button>
            <div className={styles.foot}></div>
          </>
        }
      >
        {/* <Form.Header>基础用法</Form.Header> */}
        <Form.Item
          label='请上传封面：'
          rules={[{ required: true, message: '封面不能为空！' }]}
        >
          <ImageUploader
            value={file}
            onChange={setFile}
            upload={uploadCoverF}
          />
        </Form.Item>
        <Form.Item
          label='请上传插图：'
        >
          <ImageUploader
            value={fileList}
            onChange={setFileList}
            upload={uploadimg}
            multiple
            maxCount={3}
            onCountExceed={() => {
              Toast.show(`最多选择 3 张图片`)
            }}
          />
        </Form.Item>

        <Form.Item
          name='title'
          rules={[{ required: true, message: '标题不能为空！' }]}
        >
          <Input placeholder='标题' />
        </Form.Item>
        <Form.Item
          name='subtitle'
          rules={[{ required: true, message: '副标题不能为空！' }]}
        >
          <Input placeholder='副标题' />
        </Form.Item>

        <Form.Item
          name='text'
          label='请编辑正文：'
        >
          <Editor
            editorState={text.editorState}
            editorStyle={{ minHeight: '11rem', maxWidth: '375px', placeholder: '请输入内容'}}
            onEditorStateChange={onEditorStateChange}
          />
        </Form.Item>

        <Form.Item>
          {
            community ?
              <>
                <span style={{ float: 'left' }}>选择的社区：</span>
                <div className={styles.tab}>
                  {community}<CloseOutline onClick={deleteCom} />
                </div>
              </>
              :
              <SelectKind getCom={getCom} />
          }
        </Form.Item>
      </Form>
    </div>
  )
}

function SelectKind(props) {
  const [visible, setVisible] = React.useState(false)

  const [value, setValue] = useState([])

  const { getCom } = props

  return (
    <>
      <Mask visible={visible} onMaskClick={() => setVisible(false)}>
        <div className={styles.overlayContent}>
          <div className={styles.header}>
            <LeftOutline onClick={() => {
              setVisible(false);
              setValue([])
            }} />
            <div>选择社区</div>
            <div></div>
          </div>
          <div className={styles.content}>
            <div>
              <Radio.Group
                value={value}
                onChange={val => {
                  setValue(val)
                }}
              >
                <div className={styles.content}>
                  <div>
                  <Radio value='原神'>原神</Radio>
                    <Radio value='王者荣耀'>王者荣耀</Radio>
                  </div>
                  <div>
                    <Radio value='热点'>热点</Radio>
                    <Radio value='英雄联盟'>英雄联盟</Radio>
                    
                  </div>
                </div>
              </Radio.Group>
            </div>
          </div>
          <div className={styles.footer}>
            <span onClick={() => {
              setVisible(false);
              getCom(value);
            }}>完成</span>
          </div>
        </div>
      </Mask>
      <Button style={{ float: 'left' }} onClick={() => setVisible(true)}><AddOutline />添加社区</Button>
    </>
  )
}