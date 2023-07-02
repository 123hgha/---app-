import React from 'react'
import Recommend from './recommend/Index'
import { SearchOutline, MailOutline } from 'antd-mobile-icons'

export default function Index() {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0 .5rem" }}>
        <div>
          <h2>推荐</h2>
        </div>
        <div style={{ width: "4rem", display: "flex", justifyContent: "space-between", padding: "0 .5rem", alignItems: 'center' }}>
          <SearchOutline fontSize={24} />
          <MailOutline fontSize={24} />
        </div>
      </div>
      <Recommend />
    </>
  )
}
