import React, { useState } from 'react'
import { Swiper, InfiniteScroll, List, DotLoading, Footer, Empty } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.scss'
import { getArticle } from '../../../../../api/index'

export default function Index() {

    const imgs = ['http://127.0.0.1:80/data/swiper/lunbo1.png',
        'http://127.0.0.1:80/data/swiper/lunbo2.png',
        'http://127.0.0.1:80/data/swiper/lunbo3.png',
        'http://127.0.0.1:80/data/swiper/lunbo4.png']

    // 轮播图数据
    const items = imgs.map((i, index) => (
        <Swiper.Item key={index}>
            <div className={styles.swiper}>
                <img src={i} alt='' />
            </div>
        </Swiper.Item>
    ))

    const [data, setData] = useState([])
    const [hasMore, setHasMore] = useState(true)
    async function loadMore() {
        try {
            const res = await getArticle({ state: 0 })
            console.log(res, `请求成功返回的参数`);
            const append = res.data.data
            // console.log(`请求成功`, append);
            if (append) {
                setData(val => [...val, ...append])
                setHasMore(res.data.hasMore)
            }
        } catch (error) {
            console.log(`请求报错`);
        }
    }

    // 跳转文章
    const navigete = useNavigate()

    function showDetail(item) {
        navigete(`/content?id=${item}`)
    }

    return (
        <>
            {/* 轮播图 */}
            <Swiper autoplay loop indicator={() => null}>{items}</Swiper>
            {/* 轮播图 */}
            {/* 列表展示 */}
            {
                data ?
                    (<><List>
                        {data.map((item, index) => (
                            <List.Item key={index} className='list'>
                                <div onClick={() => showDetail(item._id)}>
                                    <div className='itemLeft'>
                                        <div className='text'>
                                            {item.subtitle}
                                        </div>
                                        <div className='tab'>
                                            {item.kind}
                                        </div>
                                        <div>
                                            {item.creatTime}
                                        </div>
                                    </div>
                                    <div className='itemRight'>
                                        {
                                            item.cover ?
                                                <img style={{ width: '100%', height: '100%' }} src={item.cover} alt="" />
                                                :
                                                <Empty description='暂无数据' />
                                        }

                                    </div>
                                </div>
                            </List.Item>
                        ))}
                    </List>
                        {/* 列表展示 */}
                        <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
                            <InfiniteScrollContent hasMore={hasMore} />
                        </InfiniteScroll></>)
                    :
                    <Footer label='没有更多了'></Footer>
            }

        </>
    )
}

const InfiniteScrollContent = ({ hasMore }) => {
    return (
        <>
            {hasMore ? (
                <>
                    <span>Loading</span>
                    <DotLoading />
                </>
            ) : (
                <span>--- 我是有底线的 ---</span>
            )}
        </>
    )
}
