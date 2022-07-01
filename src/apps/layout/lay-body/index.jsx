import React from 'react'
import Header from '../header'
import { NavLink, Link, Outlet } from 'react-router-dom';
import './index.less'

function BodyLayout() {
  return (
    <div>
      {/* 标题 */}
      <Header />
      {/* 主体内容 */}
      <section className="alain-default__content">
        <div id="default_content_warp">
          <Outlet />
        </div>
      </section>
    </div>
  )
}

export default BodyLayout
