import React, { useState, useEffect, useMemo, useImperativeHandle } from 'react'
import { Avatar, Image, Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined, TeamOutlined, StarTwoTone, HeartTwoTone } from '@ant-design/icons';
import './index.less'
import { _get, _post } from '../../server/http'
import { connect } from 'react-redux';
import store from '../../../store';
import { treeActions } from '../../../store/actions/tree-action';
import IconFont from '../IconFont/index';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

function ListTree({ tree, onRef }) {
  // console.log('tree---------', tree);
  const [data, setData] = useState(null)
  const [selectedKey, setSelectedKey] = useState([])
  useEffect(() => {
    // console.log('treeMOUnt', tree);
    getPageData()
  }, [])
  const getPageData = () => {
    _post('api/user/list/okr').then(res => {
      // callback(res.data.me.id)
      setData(res.data)
      if (!!tree.id) {
        setSelectedKey([`${tree.id}`])

      } else {
        setSelectedKey([`${res.data.me.id}`])

      }
    })
  }
  useEffect(() => {
    // console.log('treeMOUntbianhua---', tree);

    setSelectedKey([`${tree.id}`])

  }, [tree.id])
  useImperativeHandle(onRef, () => {
    // 需要将暴露的接口返回出去
    return {
      func: getPageData,
    };
  });

  const handleMenuSelect = ({ key }) => {
    if (key == JSON.parse(localStorage.getItem('user')).userId) {
      // callback(data.me.id)
      store.dispatch(treeActions.selectPeople(data.me.id))
    } else {
      let res = data.other.find(ele => {
        return ele.id == key
      })
      // callback(res.id)
      store.dispatch(treeActions.selectPeople(res.id))
    }
  }

  return (
    <div className='list-wrap'>
      {
        !!data ?
          <Menu
            mode="inline"
            defaultSelectedKeys={[`${tree.id ? tree.id : data.me.id}`]}
            defaultOpenKeys={['sub1', 'sub2']}
            style={{ height: '100%', background: '#f5f6f7' }}
            onClick={handleMenuSelect}
            selectedKeys={selectedKey}
            className='list-wrap-menu'
          >
            <SubMenu key="sub1" icon={<UserOutlined />} title="我">
              <Menu.Item key={data.me.id}>
                <div className='user-item'>
                  <Avatar src={`http://grean-ops.oss-cn-hangzhou.aliyuncs.com/avatar/${JSON.parse(localStorage.getItem('user')).wxUserId}.png`}></Avatar>
                  <span style={{ marginLeft: '8px' }} >{data.me.nickname}</span>
                </div>
              </Menu.Item>
            </SubMenu>

            <SubMenu key="sub2" icon={<TeamOutlined />} title={`其他部门(${data.other.length})`}>
              {
                data.other.map((item, index) => {
                  return <Menu.Item key={item.id}>
                    <div className='user-item'>
                      {
                        // 阅读红点
                        // item.hasOKRRecord > 0 ?
                        //   <IconFont iconName='tubiaozhizuo-' size='16' style={{ color: 'red', position: 'absolute', left: '20px', zIndex: 1 }} />
                        //   : null

                      }
                      <Avatar size={24} src={`http://grean-ops.oss-cn-hangzhou.aliyuncs.com/avatar/${item.wxUserId}.png`} className={item.hasOKRRecord == 0 ? 'gray' : ''}></Avatar>
                      <div className='flex-space-between' style={{ width: '100%' }}>
                        <span className={item.hasOKRRecord == 0 ? 'listgary' : ''} style={{ marginLeft: '8px' }}>{item.nickname}</span>
                        <span style={{ color: 'rgba(0,0,0,0.5)', fontSize: '12px' }}>{item.dept_2 ? item.dept_2 : item.dept_1}</span>
                      </div>


                    </div>
                  </Menu.Item>
                })
              }

            </SubMenu>
            <SubMenu key="sub3" icon={<StarTwoTone twoToneColor="#fadb14" />} title={`我的关注  (${data.following.length})`}>
              {
                data.following.map((item, index) => {
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
          </Menu>
          : null

      }


    </div >
  )
}


const mapStateToProps = state => state


export default connect(mapStateToProps)(ListTree);
