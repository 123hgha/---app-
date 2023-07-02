import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InfiniteScroll, List, Footer, Empty, DotLoading } from 'antd-mobile'
import { getArticle } from '../../../../../api/index'

export default function Hot() {

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
    const navigate = useNavigate()

    function showDetail(item) {
        navigate(`/content?id=${item}`)
    }

    return (
        <>
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
