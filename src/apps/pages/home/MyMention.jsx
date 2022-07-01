import React, { useState } from 'react'
import { Mentions } from 'antd';
import { useEffect } from 'react';
import { _post, _get } from '../../server/http';

const { Option } = Mentions;

const Mention = ({ value = '', onChange }) => {
  const [textr, setTextr] = useState('')
  const [manList, setManlist] = useState([])
  useEffect(() => {
    _post(`api/user/list/okr`).then(res => {
      setManlist(res.data.other)
    })
    setTextr(value)
  }, [])
  const triggerChange = (changedValue) => {
    onChange?.(changedValue);
  };
  const onMentionChange = (text) => {
    // if (textr == text) {
    //   return
    // }
    triggerChange(text);
    setTextr(text)

  }

  const onMentionSelect = (option, prefix) => {
  }

  return (
    <Mentions
      style={{ width: '100%' }}
      onChange={onMentionChange}
      onSelect={onMentionSelect}
      value={value}
      rows={3}
    >
      {
        manList?.map(item => {
          return <Option key={item.id} value={item.nickname}>{item.nickname}</Option>
        })
      }
    </Mentions>
  )
}

export default Mention