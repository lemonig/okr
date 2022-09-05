import React, { useState } from "react";
import { Space, Table, Tag } from "antd";
import { useEffect } from "react";
import { _post, _get } from "../../server/http";
import moment from "moment";
import Item from "antd/lib/list/Item";

const columns = [
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
];
function Notification() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getPageData();
  }, []);
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
  return (
    <div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default Notification;
