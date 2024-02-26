import React, { useState } from "react";
import { Space, Table, Tag, Modal, message, Button } from "antd";
import { useEffect } from "react";
import { _post, _get } from "../../server/http";
import moment from "moment";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import OpForm from "./components/OpForm";

function Notification() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columns, setColums] = useState([
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "标题",
      dataIndex: "title",
      key: "title",
    },
    {
      title: " 附件",
      dataIndex: "attachment",
      key: "attachment",
      render: (text) => (
        <a download target="_blank" href={text} rel="noreferrer">
          下载附件
        </a>
      ),
    },
    {
      title: " 发布人",
      dataIndex: "publisher",
      key: "publisher",
    },
    {
      title: " 发布时间",
      dataIndex: "gmt_create",
      key: "gmt_create",
      render: (text) => <span>{moment(text).format("YYYY/MM/DD HH:mm")}</span>,
    },
  ]);

  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsAdmin(user.isAdmin);
    }
    getPageData();
    if (user.isAdmin) {
      setColums([
        ...columns,
        {
          title: "操作",
          key: "operation",
          fixed: "right",
          render: (_, record) => (
            <Space>
              <a onClick={() => handleDel(record)}>删除</a>
            </Space>
          ),
        },
      ]);
    }
  }, []);

  // 删除
  const handleDel = ({ id }) => {
    Modal.confirm({
      title: "确定删除？",
      icon: <ExclamationCircleOutlined />,
      content: "删除后无法恢复",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        _post(`api/announcement/${id}/delete`).then(
          ({ success, message: msg }) => {
            if (success) {
              message.success(msg);
              getPageData();
            } else {
              message.error(msg);
            }
          }
        );
      },
    });
  };

  const getPageData = () => {
    _post(`api/announcement/list`).then((res) => {
      let newD = res.data.map((item, idx) => {
        return {
          ...item,
          index: idx + 1,
        };
      });
      setData(newD);
    });
  };

  const issueNotice = () => {
    setIsModalOpen(true);
  };

  //表单回调
  const closeModal = (flag) => {
    setIsModalOpen(false);
    if (flag) getPageData();
  };
  return (
    <div style={{ padding: "12px" }}>
      <div className="search">
        <Button
          onClick={issueNotice}
          style={{ display: isAdmin ? "block" : "none" }}
        >
          发布通知
        </Button>
      </div>
      <Table columns={columns} dataSource={data} />
      {/* 弹出表单 */}
      {isModalOpen && <OpForm open={isModalOpen} closeModal={closeModal} />}
    </div>
  );
}

export default Notification;
