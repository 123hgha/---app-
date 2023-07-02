// import ajax from "./ajax";
import axios from "axios";

// 获取用户登录信息
export const getUserInfo = (data = {}) => axios.post('/api/my/getUserinfo', { ...data })

// 用户登录请求
export const userLogin = (data = {}) => axios.post('/api/api/login', { ...data })

// 用户注册请求
export const userRegister = (data = {}) => axios.post('/api/api/reguser', { ...data })

// 修改用户信息
export const updateUserInfo = (data = {}) => axios.post('/api/my/updateUserinfo', { ...data })

// 用户头像上传
export const uploadAvatar = (data = {}) => axios.post('/api/my/uploadAvatar', data)

// 获取首页所有文章
export const getArticle = (data = {}) => axios.post('/api/article/articleInfo', { limit: 10, ...data })

// 根据id获取指定文章
export const getArticleById = (data = {}) => axios.post(`/api/articles/selectArticle`, { ...data })

// 新增文章
export const addArticle = (data = {}) => axios.post('/api/articles/addArticle', { ...data })

// 获取指定用户创建的文章内容
export const getUserArticle = (data = {}) => axios.post('/api/my/getUserArticle', { ...data })

// 点赞文章
export const articleAgree = (data = {}) => axios.post('/api/articles/identification', { ...data })

// 根据id获取指定文章评论
export const getComments = (data = {}) => axios.post('/api/articles/getComments', { ...data })

// 发表评论
export const sendComment = (data = {}) => axios.post('/api/articles/sendComment', { ...data })

// 封面上传
export const uploadCover = (data = {}) => axios.post('/api/articles/uploadCover', data)

// 内容上传
export const uploadContents = (data = {}) => axios.post('/api/articles/uploadContents', data)

// 模糊搜索用户
export const dimGetUser = (data = {}) => axios.post('/api/my/dimGetUser', { ...data })

// 判断当前用户的聊天列表中是否存在
export const initiateChat = (data = {}) => axios.post('/api/my/initiateChat', { ...data })

// 获取聊天列表
export const getUsersHasFriends = (data = {}) => axios.post('/api/my/getUsersHasFriends', { ...data })

// 获取历史聊天记录
export const saveMsg = (data = {}) => axios.post('/api/my/saveMsg', { ...data })

// 保存聊天内容
export const getOldMsg = (data = {}) => axios.post('/api/my/getOldMsg', { ...data })