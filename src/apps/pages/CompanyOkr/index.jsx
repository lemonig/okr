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
import moment from "moment";
import IconFont from "@Components/IconFont";
import OpForm from "./components/OpForm";
import OpForm2 from "./components/OpForm2";
import { listOkr, deleteOkr, goalDeliver } from "@Api/company_okr.js";
import ChildGroup1 from "./components/ChildGroup1";

import { ExclamationCircleOutlined } from "@ant-design/icons";
import "./index.less";
const { Option } = Select;

let nowYear = moment().get("year");
function SetMsgRegion() {
  const [searchForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState({
    modal: false,
    modal2: false,
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
  // 当年年份
  const [year, setYear] = useState(moment().subtract(2, "months").get("year"));

  useEffect(() => {
    getPageData();
  }, []);

  const getPageData = async () => {
    setLoading(true);
    let { data } = await listOkr(year);
    setData(data);
    setLoading(false);
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
  //下发任务
  const handleDeliverTask = () => {
    Modal.confirm({
      title: `是否要下发${year}年绩效考核目标？`,
      icon: <ExclamationCircleOutlined />,
      content: "下发后无法撤回",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        let { success, message: msg } = await goalDeliver({ dataYear: year });
        if (success) {
          message.success(msg);
          getPageData();
        } else {
          message.error(msg);
        }
      },
    });
  };
  // 删除
  const handleDel = ({ id }) => {
    Modal.confirm({
      title: "确定删除？",
      icon: <ExclamationCircleOutlined />,
      content: "删除后无法恢复",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        let { success, message: msg } = await deleteOkr({ id });
        if (success) {
          message.success(msg);
          setIsModalOpen({
            ...isModalOpen,
            modal: false,
          });
          getPageData();
        } else {
          message.error(msg);
        }
      },
    });
  };

  // 设置权重
  const handleSetWeight = () => {
    setIsModalOpen({
      ...isModalOpen,
      modal2: true,
    });
  };

  useEffect(() => {
    getPageData();
  }, [year]);

  const handleYearChange = (val) => {
    setYear(val);
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
      title: "主目标描述  ",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "主目标权重",
      dataIndex: "weight",
      key: "weight",
    },

    {
      title: "下发状态",
      dataIndex: "isDelivered",
      key: "isDelivered",
      render: (value, record) => (value ? "已下发" : "未下发"),
    },
    {
      title: "创建时间",
      dataIndex: "gmtCreate",
      key: "gmtCreate",
      render: (val, record) => moment(val).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "子目标",
      dataIndex: "subgoalNumber",
      key: "subgoalNumber",
      render: (val, record) => (
        <Space>
          <a onClick={() => handleChild(record)}>{val}</a>
        </Space>
      ),
    },
    {
      title: "操作",
      key: "operation",
      fixed: "right",
      render: (_, record) => (
        <Space>
          <a onClick={() => handleEdit(record)}>编辑</a>
          <a onClick={() => handleDel(record)}>删除</a>
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
      modal2: false,
    });
    if (flag) getPageData();
  };
  return (
    <div className="content-wrap" style={{ padding: "12px" }}>
      {!isModalOpen.child && (
        <>
          <div className="search">
            <Space>
              <Select
                value={year}
                style={{
                  width: 120,
                }}
                onChange={handleYearChange}
                options={[
                  {
                    value: nowYear + 1,
                    label: nowYear + 1 + "年",
                  },
                  {
                    value: nowYear,
                    label: nowYear + "年",
                  },
                  {
                    value: nowYear - 1,
                    label: nowYear - 1 + "年",
                  },
                ]}
              />
              <Button type="primary" onClick={handleSetWeight}>
                设置权重
              </Button>

              <Button type="primary" onClick={handleDeliverTask}>
                下发公司绩效任务
              </Button>
            </Space>
            <Button onClick={handleAdd}>新建主任务</Button>
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
          year={year}
        />
      )}
      {/* 弹出表单 */}
      {isModalOpen.modal2 && (
        <OpForm2
          open={isModalOpen.modal2}
          closeModal={closeModal}
          record={operate}
          year={year}
        />
      )}
      {isModalOpen.child && (
        <ChildGroup1
          open={isModalOpen.child}
          pcloseModal={closeModal}
          precord={operate}
        />
      )}
    </div>
  );
}

export default SetMsgRegion;
