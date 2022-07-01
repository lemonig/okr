import React from 'react';
import { Comment, Avatar, Form, Button, List, Input, message, Mentions } from 'antd';
import moment from 'moment';
import { _post, _get } from '../../server/http';
import MyMention from './MyMention';
import { UserOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option, getMentions } = Mentions;

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
    itemLayout="horizontal"
    renderItem={props => <Comment {...props} />}
  />
);

const Editor = ({ onChange, onSubmit, value, manList }) => (
  <>
    <Form.Item>
      <Mentions rows={3} onChange={onChange} value={value}>
        {
          manList?.map(item => {
            return <Option key={item.id} value={item.nickname}>{item.nickname}</Option>
          })
        }

      </Mentions>
      {/* <TextArea rows={4} onChange={onChange} value={value} /> */}
    </Form.Item>
    <Form.Item>
      <div style={{ textAlign: 'right' }}>
        <Button htmlType="submit" onClick={onSubmit} type="primary">
          添加评论
        </Button>


      </div>

    </Form.Item>
  </>
);

class Mycomment extends React.Component {
  state = {
    comments: [],
    value: '',
    manList: []
  };
  componentDidMount() {
    _post(`api/user/list/okr`).then(res => {
      this.setState({
        manList: res.data.other,
      })
    })
  }

  handleSubmit = () => {
    if (!this.state.value) {
      message.warn('请提交正确评论')
      return;
    }


    let parms = {
      targetUserId: this.props.people.id,
      comment: this.state.value
    }
    _post(`api/comment/add`, parms).then(res => {
      if (res.success) {
        message.success('评论成功')
        this.props.callback('success')
        this.setState({
          value: ''
        })

      } else {
        message.error('评论失败')
      }
    })
    // setTimeout(() => {
    //   this.setState({
    //     submitting: false,
    //     value: '',
    //     comments: [
    //       ...this.state.comments,
    //       {
    //         author: 'Han Solo',
    //         avatar: 'https://joeschmoe.io/api/v1/random',
    //         content: <p>{this.state.value}</p>,
    //         datetime: moment().fromNow(),
    //       },
    //     ],
    //   });
    // }, 1000);
  };

  handleChange = text => {
    this.setState({
      value: text,
    });
  };
  // handleChange = e => {
  //   this.setState({
  //     value: e.target.value,
  //   });
  // };

  render() {
    const { comments, submitting, value } = this.state;

    return (
      <>
        {comments.length > 0 && <CommentList comments={comments} />}
        <Comment
          avatar={<Avatar src={`http://grean-ops.oss-cn-hangzhou.aliyuncs.com/avatar/${JSON.parse(localStorage.getItem('user'))?.wxUserId}.png`} alt="Han Solo" />}
          content={
            <Editor
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              submitting={submitting}
              value={value}
              manList={this.state.manList}
            />
          }
        />
      </>
    );
  }
}

export default Mycomment