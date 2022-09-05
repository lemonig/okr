import React, { useState, useEffect, createElement } from "react";
import { Layout, Button, Input, Select, Table, Spin } from "antd";
import "./index.less";
import {
  PlusOutlined,
  EditOutlined,
  SnippetsOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  DislikeOutlined,
  LikeOutlined,
  DislikeFilled,
  LikeFilled,
  UserOutlined,
} from "@ant-design/icons";
import { _post, _get } from "../../server/http";
import moment from "moment";

const { Header, Footer, Sider, Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;

const { Column, ColumnGroup } = Table;
const Matrix = () => {
  const [manlist, setManList] = useState([]);
  const [manchose, setManchose] = useState(null);
  const [tabledata, setTabledata] = useState(null);
  const [columm, setColumm] = useState([]);

  const [state, setState] = useState({
    loading: false,
  });
  useEffect(() => {
    getSelechList().then((id) => {
      handleTableSearch(id);
    });
  }, []);
  const getSelechList = () => {
    return new Promise((rso, rej) => {
      _post(`api/user/list/okr`).then((res) => {
        let list = [res.data.me, ...res.data.other];
        setManList(list);
        setManchose(list[0].id);
        rso(list[0].id);
        rso(list[0].id);
      });
    });
  };
  function handleChange(value) {
    setManchose(value);
  }

  const handleTableSearch = (id) => {
    setState({ loading: true });
    let sel = id ? id : manchose;
    _post(`api/objective/align/matrix/${sel}/user`).then((res) => {
      // table
      let tabRes = res.data.matrixList.map((item, idx) => {
        let obj = {};
        item?.alignObjectiveList.map((jtem, idx) => {
          obj[`other${idx}`] = jtem?.content;
        });
        return {
          key: idx + 1,
          myokr: item.myObjective?.objective?.content,
          mykr: "",
          otherokr: "",
          ...obj,
        };
      });
      setTabledata(tabRes);
      let tableHead = [
        {
          title: `${res.data?.userListOKRVO.me.dept_1}-${res.data?.userListOKRVO.me?.dept_2}(${res.data?.userListOKRVO.me?.nickname})`,
          dataIndex: "myObjective",
          key: "name",
          width: 200,

          children: [
            {
              title: "目标",
              dataIndex: "myokr",
              key: "myokr",
              width: 200,
              fixed: "left",
            },
          ],
        },
        {
          title: "对齐我的",
          children: res.data.userListOKRVO.other.map((item, idx) => {
            return {
              title: `${item?.dept_1}-${item?.dept_2}(${item.nickname})`,
              dataIndex: `other${idx}`,
              key: `other${idx}`,
              width: 150,
            };
          }),
        },
      ];

      setColumm(tableHead);
      setState({ loading: false });
    });
  };
  function search() {
    handleTableSearch();
  }
  return (
    <Layout className="matrix">
      <Spin tip="Loading..." spinning={state.loading}>
        <Header className="bg-white" style={{ padding: "0" }}>
          <>
            <Select
              value={manchose}
              style={{ width: 120 }}
              onChange={handleChange}
            >
              {manlist.length &&
                manlist.map((item) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.dept_1}-{item.dept_2}({item.nickname})
                    </Option>
                  );
                })}
            </Select>
            <Button type="primary" onClick={search}>
              查询
            </Button>
          </>
        </Header>
        <Content>
          <Table
            columns={columm}
            dataSource={tabledata}
            scroll={{ x: 1500, y: 620 }}
            bordered
            pagination={false}
          />
        </Content>
      </Spin>
    </Layout>
  );
};

export default Matrix;
