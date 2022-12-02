import React, {
  useState,
  useEffect,
  useMemo,
  useImperativeHandle,
} from "react";
import { Avatar, Image, Layout, Menu, Breadcrumb } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  TeamOutlined,
  StarTwoTone,
  HeartTwoTone,
} from "@ant-design/icons";
import "./index.less";
import { _get, _post } from "../../server/http";
import { connect } from "react-redux";
import store from "../../../store";
import { treeActions } from "../../../store/actions/tree-action";
import IconFont from "../IconFont/index";

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const ColorList = [
  "#f56a00",
  "#7265e6",
  "#ffbf00",
  "#00a2ae",
  "#A67D3D",
  "#FF7F00",
  "#FF1CAE",
  "#EAADEA",
  "#238E23",
  "#E47833",
];

function ListTree({ tree, onRef }) {
  const [data, setData] = useState(null);
  const [selectedKey, setSelectedKey] = useState([]);
  const [selectedNode, setSelectedNode] = useState([]);

  useEffect(() => {
    console.log("treeMOUntbianhua---", tree);
    getPageData();
  }, []);
  const getPageData = () => {
    _post("api/dept/list/okr").then((res) => {
      // callback(res.data.me.id)
      setData(res.data);

      if (!!tree.id) {
        setSelectedKey([`${tree.id}`]);
      } else {
        setSelectedNode(res.data.me[0]);
        store.dispatch(treeActions.selectPeople(res.data.me[0]));
        setSelectedKey(res.data.me[0].id);
      }
    });
  };
  useEffect(() => {
    setSelectedKey([`${tree.id}`]);
  }, [tree.id]);
  useImperativeHandle(onRef, () => {
    // 需要将暴露的接口返回出去
    return {
      func: getPageData,
    };
  });

  const handleMenuSelect = ({ item, key }) => {
    // if (key == JSON.parse(localStorage.getItem("user")).userId) {
    //   store.dispatch(treeActions.selectPeople(data.me.id));
    // } else {
    //   let res = data.other.find((ele) => {
    //     return ele.id == key;
    //   });
    //   store.dispatch(treeActions.selectPeople(res.id));
    // }

    let res = data.other.find((ele) => ele.id == key);
    let res1 = data.me.find((ele) => ele.id == key);
    store.dispatch(treeActions.selectPeople(res || res1));
  };

  return (
    <div className="list-wrap">
      {!!data ? (
        <Menu
          mode="inline"
          defaultSelectedKeys={[`${tree.id ? tree.id : data.me.id}`]}
          defaultOpenKeys={["sub1", "sub2"]}
          style={{ height: "100%", background: "#f5f6f7" }}
          onClick={handleMenuSelect}
          selectedKeys={selectedKey}
          className="list-wrap-menu"
        >
          <SubMenu key="sub1" icon={<UserOutlined />} title="我">
            {data.me.map((item) => (
              <Menu.Item key={item.id}>
                <div className="user-item">
                  <Avatar
                  // style={{ backgroundColor: ColorList[0], verticalAlign: "middle" }}
                  >
                    {item.name.substring(0, 1)}
                  </Avatar>
                  <span style={{ marginLeft: "8px" }}>{item.name}</span>
                </div>
              </Menu.Item>
            ))}
          </SubMenu>

          <SubMenu
            key="sub2"
            icon={<TeamOutlined />}
            title={`其他部门(${data.other.length})`}
          >
            {data.other.map((item, index) => {
              return (
                <Menu.Item key={item.id}>
                  <div className="user-item">
                    {
                      // 阅读红点
                      // item.hasOKRRecord > 0 ?
                      //   <IconFont iconName='tubiaozhizuo-' size='16' style={{ color: 'red', position: 'absolute', left: '20px', zIndex: 1 }} />
                      //   : null
                    }
                    <Avatar
                      style={
                        {
                          // backgroundColor:
                          //   ColorList[Math.floor(Math.random() * 10)],
                        }
                      }
                    >
                      {item.name.substring(0, 1)}
                    </Avatar>
                    <div
                      className="flex-space-between"
                      style={{ width: "100%" }}
                    >
                      <span
                        className={item.hasOKRRecord == 0 ? "listgary" : ""}
                        style={{ marginLeft: "8px" }}
                      >
                        {item.name}
                      </span>
                      <span
                        style={{ color: "rgba(0,0,0,0.5)", fontSize: "12px" }}
                      >
                        {item.dept_2 ? item.dept_2 : item.dept_1}
                      </span>
                    </div>
                  </div>
                </Menu.Item>
              );
            })}
          </SubMenu>
        </Menu>
      ) : null}
    </div>
  );
}

const mapStateToProps = (state) => state;

export default connect(mapStateToProps)(ListTree);
