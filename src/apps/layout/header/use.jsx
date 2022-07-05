import React, { useEffect, useState } from "react";
import {
  Menu,
  Dropdown,
  Avatar,
  Modal,
  Form,
  Input,
  Button,
  Checkbox,
  message,
} from "antd";
import {
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { _post, _get } from "../../server/http";

const User = () => {
  const [pwdModalVisible, setPwdModalVisible] = useState(false);
  const [pwdForm] = Form.useForm();

  const handlePwsOk = () => {
    let params = {};
    // console.log(pwdForm.getFieldValue());
    pwdForm.validateFields().then((_) => {
      let params = pwdForm.getFieldValue();
      _post(`api/user/updatepwd`, params).then((res) => {
        if (res.success) {
          message.success("密码修改成功");
        } else {
          message.error(res.message);
        }
        setPwdModalVisible(false);
      });
    });
  };
  let navigate = useNavigate();

  const handlePwsCancel = () => {
    setPwdModalVisible(false);
  };
  const handleModifyPwd = () => {
    setPwdModalVisible(true);
  };

  const loginOut = async () => {
    localStorage.clear();
    navigate("/login");
    await _post("api/sso/logout");
  };

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        <a>个人信息</a>
      </Menu.Item>
      <Menu.Item key="3" icon={<EditOutlined />} onClick={handleModifyPwd}>
        修改密码
      </Menu.Item>
      <Menu.Divider />

      <Menu.Item key="0" icon={<LogoutOutlined />}>
        <a onClick={loginOut}>退出登录</a>
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Dropdown overlay={menu} trigger={["click"]}>
        <Avatar
          style={{ background: "#87d068" }}
          src={`http://grean-ops.oss-cn-hangzhou.aliyuncs.com/avatar/${
            JSON.parse(localStorage.getItem("user"))?.wxUserId
          }.png`}
          onClick={(e) => e.preventDefault()}
        />
        {/* <Avatar size={24} src="https://joeschmoe.io/api/v1/random" onClick={e => e.preventDefault()} /> */}
      </Dropdown>
      {/* 修改密码 */}
      <Modal
        title="修改密码"
        visible={pwdModalVisible}
        onOk={handlePwsOk}
        onCancel={handlePwsCancel}
        destroyOnClose
      >
        <Form
          name="psd"
          preserve={false}
          form={pwdForm}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          autoComplete="off"
        >
          <Form.Item
            label="旧密码"
            name="old_password"
            rules={[{ required: true, message: "请输入旧密码!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="new_password1"
            rules={[{ required: true, message: "请输入新密码" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="new_password2"
            rules={[{ required: true, message: "请再次输入新密码" }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default User;
