import { Navigate } from 'react-router-dom';
import Content from '../pages/content/Index'
import TabBar from '../pages/tabBar/Index'
import Home from '../pages/tabBar/home/Index'
import Dynamic from '../pages/tabBar/dynamic/Index'
import Community from '../pages/tabBar/community/Index'
import Game from '../pages/tabBar/game/Index'
import My from '../pages/tabBar/my/Index'
import Login from '../pages/tabBar/my/Login'
import Register from '../pages/tabBar/my/Register'
import Chat from '../pages/chat/Index'
import Search from '../pages/tabBar/game/search/Index'
import Update from '../pages/tabBar/my/Update'

// eslint-disable-next-line import/no-anonymous-default-export
export default [
    {
        path: '/tabbar',
        element: <TabBar />,
        children: [
            {
                path: 'home',
                element: <Home />,
            },
            {
                path: 'dynamic',
                element: <Dynamic />,
            },
            {
                path: 'home/:id',
                element: <Content />,
            },
            {
                path: 'community',
                element: <Community />,
            },
            {
                path: 'game',
                element: <Game />,
            },
            {
                path: 'my',
                element: <My />
            },
        ]
    },
    {
        // 文章内容
        path: '/content',
        element: <Content />
    },
    {
        // 聊天页
        path: '/chat',
        element: <Chat />
    },
    {
        // 搜索好友页
        path: '/search',
        element: <Search />
    },
    {
        // 登录页
        path: 'login',
        element: <Login />
    },
    {
        // 注册页
        path: 'register',
        element: <Register />
    },
    {
        // 修改个人信息
        path: 'update',
        element: <Update />
    },
    {
        path: '/',
        element: <Navigate to='/tabbar/home' />
    },
]