import React, { useState, useEffect, createElement } from "react";
import {
  Layout,
  Button,
  Input,
  Select,
  Table,
  Spin,
  PageHeader,
  Tooltip,
  Tag,
} from "antd";
import "./index.less";

import { _post, _get, _download } from "../../server/http";
import moment from "moment";
import {
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
const { Header, Footer, Sider, Content } = Layout;

function SeasonPool() {
  let navigate = useNavigate();

  const [state, setState] = useState({
    loading: false,
  });
  const [tabledata, setTabledata] = useState(null);
  useEffect(() => {
    getSelechList();
  }, []);

  const columns = [
    {
      title: "目标类型",
      key: "type",
      width: 100,
      render: (row) => {
        if (row.type == "主目标") {
          return <Tag color="#108ee9">{row.type}</Tag>;
        } else if (row.type == "子目标") {
          return <Tag color="blue">{row.type}</Tag>;
        } else {
          return row.type;
        }
      },
    },
    {
      title: "目标",
      dataIndex: "content",
      key: "content",
      ellipsis: {
        showTitle: false,
      },
      render: (content) => (
        <Tooltip placement="topLeft" title={content}>
          {content}
        </Tooltip>
      ),
    },
    {
      title: "达标标准",
      dataIndex: "milestone",
      key: "milestone",
      ellipsis: {
        showTitle: false,
      },
      render: (milestone) => (
        <Tooltip placement="topLeft" title={milestone}>
          {milestone}
        </Tooltip>
      ),
    },
    {
      title: "权重(%)",
      dataIndex: "weight",
      key: "weight",
      width: 100,
    },
    {
      title: "截止日期",
      dataIndex: "deadline",
      key: "deadline",
      width: 200,
    },
    {
      title: "第一季度",
      dataIndex: "season1",
      key: "season1",
      width: 100,
    },
    {
      title: "第二季度",
      dataIndex: "season2",
      key: "season2",
      width: 100,
    },
    {
      title: "第三季度",
      dataIndex: "season3",
      key: "season3",
      width: 100,
    },
    {
      title: "第四季度",
      dataIndex: "season4",
      key: "season4",
      width: 100,
    },
    {
      title: "年度得分",
      dataIndex: "year",
      key: "year",
      width: 100,
    },
  ];

  let idp = new URLSearchParams(useLocation().search).get("id");
  let name = new URLSearchParams(useLocation().search).get("name");
  let year = new URLSearchParams(useLocation().search).get("year");

  const getSelechList = () => {
    return new Promise((rso, rej) => {
      _post(`/api/objective/report/${idp}/dept?year=${year}`).then((res) => {
        setTabledata(res.data);
      });
    });
  };
  const download = () => {
    _download(
      `/api/objective/report/${idp}/dept/export?year=${year}`,
      {},
      `${year}年-${name}绩效`
    );
  };
  return (
    <Layout className="season-pool">
      <PageHeader
        className="site-page-header"
        onBack={() => navigate(-1, { replace: true })}
        title={name}
        subTitle={`季度汇总-${year}年`}
      />
      <Header
        className="bg-white"
        style={{ padding: "0", background: "#f5f6f7" }}
      >
        <Button type="primary" onClick={download}>
          导出
        </Button>
      </Header>
      <Content>
        <Table
          columns={columns}
          dataSource={tabledata}
          // scroll={{ x: 1500, y: 620 }}
          bordered
          pagination={false}
        />
      </Content>
    </Layout>
  );
}

export default SeasonPool;
