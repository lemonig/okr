import { message } from 'antd';
import React, { useState, useEffect } from 'react'

import { useNavigate, useParams } from 'react-router-dom';
import { _post, _get } from '../../server/http'
import './index.less'

const LoginToHomen = () => {
  let navigate = useNavigate()
  useEffect(() => {
    let href = window.location.href // 完整的url路径
    let search = window.location.search // 获取从？开始的部分
    let url = decodeURI(search)

    // 
    let code = url.split('&')[0].split('=')[1]
    _post(`api/login/wx?code=${code}`).then(res => {
      if (res.success) {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data))
        navigate('/')
      } else {
        message.error(res.message)
        navigate('/login')
      }
    })

    let splitIndex = url.indexOf('?')  // 返回第一个？号的位置
    var str = url.substring(splitIndex + 1) // 获取到查询参数
    var getAllUrlParam = function (str) {
      var urlArr = str.split('&')
      var obj = {}
      for (var i = 0; i < urlArr.length; i++) {
        var arg = urlArr[i].split('=')
        obj[arg[0]] = arg[1]
      }
      return obj
    }




    window.onhashchange = function (event) {
    }
  })


  return (
    <div className="loader">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  )
}

export default LoginToHomen