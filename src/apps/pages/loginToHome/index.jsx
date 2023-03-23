import { message } from "antd";
import React, { useState, useEffect } from "react";

import { useNavigate, useParams, useLocation } from "react-router-dom";
import { _post, _get } from "../../server/http";
import "./index.less";
import store from "../../../store";
import { treeActions } from "../../../store/actions/tree-action";

const LoginToHomen = () => {
  let navigate = useNavigate();
  let location = useLocation();
  useEffect(() => {
    let href = window.location.href; // 完整的url路径
    let search = location.search; // 获取从？开始的部分

    let url = decodeURI(search);

    //
    let code = url.split("&")[1].split("=")[1];
    getTicket(code);

    window.onhashchange = function (event) {};
  });
  const getTicket = async (ticket) => {
    let { code, data } = await _post(`api/sso/doLoginByTicket`, {
      ticket,
    });
    if (code == 200) {
      // localStorage.setItem("token", "a41a00404e1554651b72cd774f6adf1ca");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      store.dispatch(treeActions.selectPeople(data.userId));
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="loader">
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );
};

export default LoginToHomen;
