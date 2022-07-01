import React, { useState, useEffect } from 'react'
import { Avatar, Image, Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined, TeamOutlined } from '@ant-design/icons';
import './index.less'
import { _get, _post } from '../../server/http'


const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

function ListTreeOkr({ callback }) {
  const [data, setData] = useState(null)
  useEffect(() => {
    _post('api/user/list/okr').then(res => {
      setData(res.data)
      callback(res.data.other[0].id)
    })
  }, [])

  const handleMenuSelect = ({ key }) => {
    let res = data.other.find(ele => {
      return ele.id == key
    })
    callback(res.id)
  }

  return (
    <div className='list-wrap'>
      {
        data ?
          <Menu
            mode="inline"
            defaultSelectedKeys={[`${data.other[0].id}`]}
            defaultOpenKeys={['sub1', 'sub2']}
            style={{ height: '100%', background: '#f5f6f7' }}
            onClick={handleMenuSelect}
            className='alignList-wrap-menu'
          >
            {/* <SubMenu key="sub1" icon={<UserOutlined />} title="我">
              <Menu.Item key={data.me.id}>
                <div className='user-item'>
                  <Avatar src={`http://grean-ops.oss-cn-hangzhou.aliyuncs.com/avatar/${JSON.parse(localStorage.getItem('user')).wxUserId}.png`}></Avatar>
                  <span style={{ marginLeft: '8px' }}>{data.me.nickname}</span>
                </div>
              </Menu.Item>
            </SubMenu> */}

            <SubMenu key="sub2" icon={<TeamOutlined />} title="其他部门">
              {
                data.other.map((item, index) => {
                  return <Menu.Item key={item.id}>
                    <div className='user-item'>
                      <Avatar size={24} src={`http://grean-ops.oss-cn-hangzhou.aliyuncs.com/avatar/${item.wxUserId}.png`}></Avatar>
                      <div className='flex-space-between' style={{ width: '100%' }}>
                        <span style={{ marginLeft: '8px' }}>{item.nickname}</span>
                        <span style={{ color: 'rgba(0,0,0,0.5)', fontSize: '12px' }}>{item.dept_2 ? item.dept_2 : item.dept_1}</span>
                      </div>


                    </div>
                  </Menu.Item>
                })
              }

            </SubMenu>
            {/* <SubMenu key="sub3" icon={<NotificationOutlined />} title="我的对齐">
            <Menu.Item key="9">option9</Menu.Item>
            <Menu.Item key="10">option10</Menu.Item>
            <Menu.Item key="11">option11</Menu.Item>
            <Menu.Item key="12">option12</Menu.Item>
          </SubMenu> */}
          </Menu>
          : null

      }


    </div>
  )
}



export default ListTreeOkr