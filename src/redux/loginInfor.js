const person = null

export default function loginInfor(preState = person, action) {
    const { type, data } = action
    console.log(`action`, action);
    let personInfo = null
    switch (type) {
        // 登录-将个人信息存到本地临时缓存中
        case 'signIn':
            console.log(`redux管理`, data);
            personInfo = JSON.stringify(data)
            sessionStorage.setItem('user', personInfo)
            return data
        // 退出
        case 'exit':
            sessionStorage.removeItem('user')
            return null
        default:
            // console.log(`触发了吗`);
            return null
    }
}