import React, { useState, useEffect } from 'react'
import { _post, _get } from '../../server/http'
import { Comment, Tooltip, Avatar, message, Empty } from 'antd';
import moment from 'moment';
import IconFont from '../../shared/IconFont';
import './index.less'
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import {
  ArrowLeftOutlined
} from '@ant-design/icons'
import store from '../../../store';
import { messageActions } from '../../../store/actions/message.action';
import { treeActions } from '../../../store/actions/tree-action';

const CommentList = () => {
  const [list, setList] = useState([])
  useEffect(() => {
    getMsgList()
  }, [])
  let navigate = useNavigate()


  const handleGoBack = () => {
    // navigate('/')
    window.history.go(-1)
  }
  const getMsgList = () => {
    _post(`api/notification/list`).then(res => {
      setList(res.data)
    })
  }
  const handleGotoResorce = (msg) => {
    store.dispatch(treeActions.selectPeople(msg.target_user_id))
    _post(`api/notification/${msg.id}/read`).then(res => {
      if (res.success) {
        _post(`api/notification/unread_count`).then(resSon => {
          store.dispatch(messageActions.shiftMessage(resSon.data))
          navigate(`/`, {
            state: { id: msg.target_user_id }
          })
        })
        // getMsgList()

      }
    })
    // 跳转
    // navigate(`/commentDetail`)

    store.dispatch(treeActions.selectPeople(msg.target_user_id))
  }

  return (
    <>
      <div className='comment-page'>
        <p className='title-content'>
          {/* <IconFont iconName='fanhui' size="30" color="#fff" /> */}
          <ArrowLeftOutlined style={{ fontSize: '24px' }} onClick={handleGoBack} />
          <IconFont iconName='lingdang-xianxing' size="24" style={{ marginLeft: '20px' }} />
          <span style={{ marginLeft: '4px', marginLeft: '6px' }}>消息中心</span>
        </p>
        {
          list.length ?
            <div className='comment-wrap'>
              {
                list.map(item => {
                  return <div className='list-item' key={item.id}>
                    {
                      // 阅读红点
                      !item.gmtRead ?
                        <IconFont iconName='tubiaozhizuo-' size='16' style={{ color: 'red', position: 'absolute', right: '0px', zIndex: 1 }} />
                        : null

                    }

                    <Comment
                      author={<p className='avator-wrap'><span className='comment-desc'>{item.title}</span><span className='comment-time'>{moment(item.gmtCreate).fromNow()}</span></p>}
                      avatar={
                        <p className='avatar-wrap'>
                          <Avatar src={`http://grean-ops.oss-cn-hangzhou.aliyuncs.com/avatar/${item.comment_user.wxUserId}.png`} size="large" alt="Han Solo" />
                          <span className='comment-name'>
                            {item.comment_user_name}
                          </span>
                        </p>}
                      content={
                        <p className='comment-content'>
                          <span className='comment-content-text' onClick={() => handleGotoResorce(item)}>{item.content}</span>
                        </p>
                      }
                    // datetime={
                    //   <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
                    //     <span className='comment-time'>{moment(item.gmtCreate).fromNow()}</span>
                    //   </Tooltip>
                    // }
                    />
                  </div>
                })
              }
            </div>
            : <Empty />
        }

      </div>
    </>
  )
}

export default CommentList