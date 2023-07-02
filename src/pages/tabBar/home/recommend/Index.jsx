import React from 'react'
import { JumboTabs } from 'antd-mobile'
import All from './all/Index'
import Hot from './all/Hot'
import WZRY from './all/WZRY'
import YXLM from './all/YXLM'
import YS from './all/YS'

export default function Index() {
    return (
        <>
            <JumboTabs defaultActiveKey='1'>
                <JumboTabs.Tab title='全部' key='1'>
                    <All />
                </JumboTabs.Tab>
                <JumboTabs.Tab title='热点' key='2'>
                    <Hot />
                </JumboTabs.Tab>
                <JumboTabs.Tab title='王者荣耀' key='3'>
                    <WZRY />
                </JumboTabs.Tab>
                <JumboTabs.Tab title='英雄联盟' key='4'>
                    <YXLM />
                </JumboTabs.Tab>
                <JumboTabs.Tab title='原神' key='5'>
                    <YS />
                </JumboTabs.Tab>
            </JumboTabs>
        </>
    )
}
