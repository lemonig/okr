import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Button,
  Space,
  Table,
  Tag,
  Modal,
  Form,
  message,
  Tooltip,
  Switch,
} from "antd";
import OpForm from "./components/OpForm";
import { _post, _get } from "../../server/http";
import moment from "moment";

function SetMsgRegion() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState({
    modal: false,
    child: false,
  });
  const [operate, setOperate] = useState(null); //正在操作id

  const [data, setData] = useState([]);
  const [pageMsg, setPagemsg] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  useEffect(() => {
    getPageData();
  }, []);

  const getPageData = async () => {
    setLoading(true);
    _post(`api/dept/list`).then((res) => {
      setData(res.data);
      setLoading(false);
    });
    // let { data } = await regionList({
    //   level: "1",
    // });
    // setData(data);
  };

  // 新建
  const handleAdd = () => {
    setOperate(null);
    setIsModalOpen({
      ...isModalOpen,
      modal: true,
    });
  };
  // 编辑
  const handleEdit = (record) => {
    setOperate(record);
    setIsModalOpen({
      ...isModalOpen,
      modal: true,
    });
  };
  //
  const handleChild = (record) => {
    setOperate(record);
    setIsModalOpen({
      ...isModalOpen,
      child: true,
    });
  };
  // 删除
  const handleDel = ({ id }) => {
    // Modal.confirm({
    //   title: "确定删除？",
    //   icon: <ExclamationCircleOutlined />,
    //   content: "删除后无法恢复",
    //   okText: "确认",
    //   cancelText: "取消",
    //   onOk: async () => {
    //     let { success, message: msg } = await regionDelete({ id });
    //     if (success) {
    //       message.success(msg);
    //       setIsModalOpen({
    //         ...isModalOpen,
    //         modal: false,
    //       });
    //       getPageData();
    //     } else {
    //       message.error(msg);
    //     }
    //   },
    // });
  };

  const columns = [
    {
      title: "序号",
      key: "index",
      width: 60,
      render: (_, record, index) =>
        pageMsg.pagination.pageSize * (pageMsg.pagination.current - 1) +
        index +
        1,
    },

    {
      title: "部门",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "是否启用",
      dataIndex: "isDelete",
      key: "isDelete",
      render: (val) => <span>{val ? "禁用" : "启用"}</span>,
    },

    {
      title: " 创建时间",
      dataIndex: "gmtCreate",
      key: "gmtCreate",
      render: (text) => <span>{moment(text).format("YYYY/MM/DD HH:mm")}</span>,
    },
    {
      title: "操作",
      key: "operation",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <a onClick={() => handleEdit(record)}>编辑</a>
        </Space>
      ),
    },
  ];
  const onTableChange = (pagination, filters, sorter, extra) => {
    setPagemsg({
      pagination,
      filters,
      ...sorter,
    });
    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== pageMsg.pagination?.pageSize) {
      setData([]);
    }
  };
  //表单回调
  const closeModal = (flag) => {
    // flag 确定还是取消
    setOperate(null);
    setIsModalOpen({
      modal: false,
      child: false,
    });
    if (flag) getPageData();
  };
  return (
    <div className="content-wrap" style={{ padding: "12px" }}>
      {!isModalOpen.child && (
        <>
          <div className="search">
            <Form layout="inline" form={searchForm} onFinish={getPageData}>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button onClick={handleAdd}>新建</Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            rowKey={(record) => record.id}
            pagination={pageMsg.pagination}
            onChange={onTableChange}
          />
        </>
      )}
      {/* 弹出表单 */}
      {isModalOpen.modal && (
        <OpForm
          open={isModalOpen.modal}
          closeModal={closeModal}
          record={operate}
        />
      )}
    </div>
  );
}

export default SetMsgRegion;
