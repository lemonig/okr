import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Affix, message } from "antd";
import "./index.less";
import pic_login_side from "../../../assets/image/login-side.png";
import pic_feedBack from "../../../assets/image/feedBack.png";

import { useNavigate, useParams } from "react-router-dom";
import { _post } from "../../server/http";
import store from "../../../store";
import { treeActions } from "../../../store/actions/tree-action";
function Login() {
  let navigate = useNavigate();
  const [isCodeLogin, setIsCodeLogin] = useState(true);
  useEffect(() => {}, []);

  const onFinish = (values) => {
    _post("api/login", values)
      .then((res) => {
        if (res.success) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data));
          store.dispatch(treeActions.selectPeople(res.data.userId));
          navigate("/", { replace: true });
        } else {
          message.error(res.message);
        }
      })
      .catch((error) => {
        message.error(error.message);
      });
    return;
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleLoginState = () => {
    setIsCodeLogin(!isCodeLogin);
  };

  const hanldeCodeLogin = () => {
    window.open(
      "https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=wwe0ae2b8c21cd865f&agentid=1000035&redirect_uri=http://one.greandata.com:8000/blank",
      "",
      "width=600,height=600,left=10, top=10,toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes"
    );
    return false;
  };

  return (
    <div className="login_outer">
      <div className="login_warp">
        <div style={{ marginRight: "10%" }}>
          <img src={pic_login_side} alt="登录" />
        </div>
        <div className="form_warp">
          <h2>欢迎登录</h2>
          {isCodeLogin ? (
            <Form
              name="basic"
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 20,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item label="账号" name="account">
                <Input />
              </Form.Item>

              <Form.Item label="密码" name="password">
                <Input.Password />
              </Form.Item>

              <Form.Item
                wrapperCol={{
                  offset: 0,
                  span: 24,
                }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    width: "100%",
                    borderRadius: "20px",
                    marginTop: "20px",
                  }}
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <div id="wx_reg" ref="wx_reg"></div>
          )}

          <div style={{ width: "100%", textAlign: "center" }}>
            {/* <Button type="link" onClick={handleLoginState}>切换登录方式</Button> */}
            <a
              href={`https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=wwe0ae2b8c21cd865f&agentid=1000035&redirect_uri=http://one.greandata.com:8000/blank`}
            >
              切换登录方式
            </a>
            {/* <Button type="link" onClick={hanldeCodeLogin}>切换登录方式</Button> */}
          </div>
        </div>
      </div>
      {/* <footer className="footer">杭州绿洁环境科技股份有限公司</footer> */}

      <Affix offsetBottom={20} className="affix">
        <a
          target="_blank"
          href="https://support.qq.com/product/185218"
          rel="noreferrer"
        >
          <img style={{ width: "40px" }} src={pic_feedBack} alt="反馈"></img>
        </a>
      </Affix>
    </div>
  );
}

export default Login;
