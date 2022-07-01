import React, { useState, useEffect, useImperativeHandle } from "react";
import {
  Layout,
  Card,
  Col,
  Row,
  Avatar,
  List,
  Tag,
  Button,
  Divider,
  Input,
  Modal,
  Form,
  message,
  DatePicker,
  Progress,
  Empty,
  Popconfirm,
  InputNumber,
  Radio,
  Space,
  Popover,
  Skeleton,
  Upload,
  Image,
  Rate,
  Tooltip,
} from "antd";
import ListTree from "../../shared/listTree";
import "./index.less";
import {
  PlusOutlined,
  EditOutlined,
  SnippetsOutlined,
  CloseOutlined,
  PlusSquareOutlined,
  MinusSquareOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { _post, _get, _download } from "../../server/http";
import moment from "moment";
import MyCmment from "./MyCmment";
import MyMention from "./MyMention";
import TextComment from "./TextComment";
import store from "../../../store";
import { messageActions } from "../../../store/actions/message.action";
import { treeActions } from "../../../store/actions/tree-action";
import { connect } from "react-redux";
import ListTreeOkr from "../../shared/listTreeOkr";
import { Transition, animated } from "react-spring";
import IconFont from "../../shared/IconFont";

const { Header, Sider, Content } = Layout;
const { TextArea } = Input;
const { confirm } = Modal;
const myself = JSON.parse(localStorage.getItem("user"));
console.log(myself);
let TreeListRef = React.createRef();
const Home = ({ tree }) => {
  const [objective, setObjective] = useState(null); //objective
  const [formStatus, setFormStatus] = useState("add"); // 编辑还是添加  add edit
  const [people, setPeople] = useState({}); //选中的人

  // object目标弹窗
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [objAddEdit, setObjAddEdit] = useState("添加"); //编辑
  const [objForm] = Form.useForm();
  const [objEdit, setObjEdit] = useState(null); //正在编辑的objective

  // OkR进度
  const [progressEditVisable, setProgressEditVisable] = useState(false);
  const [progresRecord, setProgresRecord] = useState("");

  // KR
  const [krModalVisible, setKrModalVisible] = useState(false);
  const [krModalLookVisible, setKrModalLookVisible] = useState(false); //查看kr
  const [krForm] = Form.useForm();
  const [krEdit, setKrEdit] = useState(null); //正在操作的kr
  const [krAddEdit, setKrAddEdit] = useState("添加"); //编辑
  const [progressForm] = Form.useForm();
  // 评论
  const [discuss, setDiscuss] = useState([]);
  // 对齐
  const [alignAtVis, setAlignAtVis] = useState(false); //对齐列表
  const [alignAtId, setAlignAtId] = useState(null); //选中的对齐id
  const [alignAtList, setAlignAtList] = useState([]); //对齐OKR列表

  const [loading, setLoading] = useState(true);
  // console.log(pagearams);
  // console.log(location);
  // 展开折叠
  const [collapse, setCollapse] = useState([]);
  // console.log('home=----------', tree);
  // 6.23加入打分操作
  const [scoreVis, setScoreVis] = useState(false); // 打分弹窗
  const [scoreForm] = Form.useForm(); //打分表单
  const [tooltipScore, setTooltipScore] = useState("1");

  useEffect(() => {
    if (tree.id) {
      selectMan(tree.id);
    } else {
      let user = JSON.parse(localStorage.getItem("user"));
      selectMan(user.userId);
    }
    msgConut();
  }, [tree.id]);

  // 获取页面数据
  const getPageData = () => {
    _post(`api/objective/list/${people.id}/user`).then((res) => {
      setObjective(res.data);
    });
  };
  // 评论数
  const msgConut = () => {
    _post(`api/notification/unread_count`).then((res) => {
      // setCount(res.data)
      store.dispatch(messageActions.addMessage(res.data));
    });
  };

  // 选择的人员 id选择的人的id
  const selectMan = (id) => {
    // 获取数据

    _post(`api/objective/list/${id}/user`).then((res) => {
      // 3.17处理关注的人O 显示颜色变换
      for (let i of res.data.objectiveVOList) {
        for (let j of i.keyResultList) {
          for (let k of j.followerList) {
            if (k.id == myself.userId) {
              i.myFavirite = true;
            }
          }
        }
      }
      setObjective(res.data);
      setPeople(res.data.user);
      getCommentList(res.data.user.id);
    });
    setLoading(false);
    setCollapse([]);
  };
  //OKR

  // 删除objevtive
  const handleDelteObjective = (obtive) => {
    Modal.confirm({
      title: "提示",
      content: `子目标将同时被删除，请确认是否删除目标？`,
      onOk() {
        _post(`api/objective/${obtive.objective.id}/delete`).then((res) => {
          // 重新获取数据
          if (res.success) {
            message.success("已删除");
          }
          getPageData();
        });
      },
    });
  };

  // 新建objevtive
  const addObjective = () => {
    setObjAddEdit("添加");
    setIsModalVisible(true);
  };
  // obj弹窗
  const handleObjOk = () => {
    objForm
      .validateFields()
      .then((values) => {
        // objForm.resetFields();
        if (objAddEdit == "添加") {
          _post(`api/objective/add`, values).then((res) => {
            if (res.success) {
              message.success("添加目标成功");
            } else {
              message.error(res.message);
            }
            objForm.resetFields();
            getPageData(); //刷新页面
          });
        } else {
          values.id = objEdit.objective.id;
          _post(`api/objective/update`, values).then((res) => {
            if (res.success) {
              message.success("修改目标成功");
            } else {
              message.error(res.message);
            }
            objForm.resetFields();
            setObjEdit(null);
            getPageData(); //刷新页面
          });
        }

        setIsModalVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  const handleObjCancel = () => {
    setIsModalVisible(false);
  };
  const handleEditObjective = (obtive) => {
    setObjAddEdit("编辑");
    setIsModalVisible(true);
    setObjEdit(obtive);
    _post(`api/objective/${obtive.objective.id}`).then((res) => {
      objForm.setFieldsValue({
        content: res.data.content,
        weight: res.data.weight,
      });
    });
  };

  // 编辑OKR进度
  const handleProgressEdit = (obtive) => {
    setObjEdit(obtive);
    setProgressEditVisable(true);
    _post(`api/objective/${obtive.objective.id}`).then((res) => {
      if (res.success) {
        setProgresRecord(res.data.progressRecord);
      }
    });
  };

  const handleProgressRecordChange = (value) => {
    setProgresRecord(value);
  };

  const handleProgressEdtiOk = () => {
    let params = {
      id: objEdit.objective.id,
      progressRecord: progresRecord,
    };
    _post(`api/objective/update/progress_record`, params).then((res) => {
      if (res.success) {
        message.success("更新成功");
        setObjEdit(null); //正在编辑OKR重置
        getPageData(); //刷新页面
        setProgressEditVisable(false);
      } else {
        message.error(res.message);
      }

      // setProgresRecord('')
    });
  };

  const handleProgressEdtiCancel = () => {
    setProgressEditVisable(false);
  };

  // Kr操作
  //添加结果
  const addKeyRes = (sele) => {
    setKrModalVisible(true);
    setKrAddEdit("添加");
    setObjEdit(sele);
  };
  // 编辑
  const handleEditKrective = (krject) => {
    _post(`api/key_result/${krject.id}`).then((res) => {
      setKrModalVisible(true);
      setKrAddEdit("编辑");
      res.data.deadline = moment(res.data.deadline);
      krForm.setFieldsValue(res.data);
      setKrEdit(krject);
      // krForm.setFieldsValue({
      //   content: res.data.content,
      //   weight: res.data.weight,
      //   deadline: moment(res.data.deadline),
      //   levelBad:res.data.levelBad,
      //   levelExcellent:res.data.levelExcellent,
      //   levelNormal:res.data.levelNormal,
      //   milestone:res.data.milestone,

      // })
    });
    // console.log(krject);
    // setKrModalVisible(true)
    // setKrAddEdit('编辑')
    // krForm.setFieldsValue({
    //   content: krject.content,
    //   deadline: krject.deadline,
    //   weight: krForm.weight
    // })
  };

  const handleDelteKrective = (krject) => {
    Modal.confirm({
      title: "提示",
      content: "删除后无法恢复，请确认是否删除？",
      onOk() {
        _post(`api/key_result/${krject.id}/delete`).then((res) => {
          if (res.success) {
            message.success("已删除");
          } else {
            message.error(res.message);
          }
          getPageData();
        });
      },
    });
  };

  const handleKROk = () => {
    //提交修改/添加
    let params = krForm.getFieldsValue();
    params.deadline = moment(params.deadline).format("yyyy-MM-DD");
    krForm
      .validateFields()
      .then((value) => {
        if (krAddEdit == "添加") {
          params.objectiveId = objEdit.objective.id;
          _post(`api/key_result/add`, params).then((res) => {
            if (res.success) {
              message.success("子目标添加成功");
              getPageData(); //刷新页面
              setObjEdit(null);
              setKrEdit(null);
              krForm.resetFields(); //表单清空
              setKrModalVisible(false);
            } else {
              message.error(res.message);
            }
          });
        } else if ("编辑") {
          params.id = krEdit.id;
          _post(`api/key_result/update`, params).then((res) => {
            if (res.success) {
              message.success("子目标修改成功");
              getPageData(); //刷新页面
              setObjEdit(null);
              setKrEdit(null);
              krForm.resetFields(); //表单清空
              setKrModalVisible(false);
            } else {
              message.error(res.message);
            }
          });
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  const handleKRCancel = () => {
    setKrModalVisible(false);
    setObjEdit(null);
    setKrEdit(null);
    krForm.resetFields(); //表单清空
  };
  const handleLookUprective = (krject) => {
    setKrAddEdit("查看");
    _post(`api/key_result/${krject.id}`).then((res) => {
      setKrModalLookVisible(true);
      res.data.deadline = moment(res.data.deadline);
      setKrEdit(krject);
      // krForm.setFieldsValue({
      //   content: res.data.content,
      //   weight: res.data.weight,
      //   deadline: moment(res.data.deadline),
      //   levelBad:res.data.levelBad,
      //   levelExcellent:res.data.levelExcellent,
      //   levelNormal:res.data.levelNormal,
      //   milestone:res.data.milestone,

      // })
    });
  };
  // 打分
  const handleEditKrScore = (obj, flag) => {
    console.log(obj);
    _post(`api/key_result/${obj.id}`).then((res) => {
      if (res.success) {
        if (flag) {
          let { keyResultScore } = res.data;
          return (
            keyResultScore.userName +
            moment(keyResultScore.gmtCreate).format("MM/DD HH:mm")
          );
        } else {
          setKrEdit(obj);
          scoreForm.setFieldsValue({
            score: res.data.keyResultScore.score,
            scoreDescription: res.data.keyResultScore.scoreDescription,
          });
        }
      } else {
        message.error(res.message);
      }
    });
    setScoreVis(true);
  };
  const handleToolTip = (vis, kr) => {
    console.log(vis);
    if (vis) {
      _post(`api/key_result/${kr.id}`).then((res) => {
        if (res.success) {
          let { keyResultScore } = res.data;
          let str =
            keyResultScore.userName +
            "  " +
            moment(keyResultScore.gmtCreate).format("MM/DD HH:mm");
          setTooltipScore(str);
        }
      });
    }
  };

  const handleScoreOK = () => {
    let params = scoreForm.getFieldsValue();
    console.log(krEdit);
    console.log(params);
    params.id = krEdit.id;
    scoreForm.validateFields().then((value) => {
      _post(`api/key_result/update/score`, params).then((res) => {
        if (res.success) {
          message.success("打分成功");
          getPageData(); //刷新页面
          setKrEdit(null);
          setScoreVis(false);
        } else {
          message.error(res.message);
        }
      });
    });
    console.log(params);
  };

  const handleKRstar = (value, kr) => {
    if (!!value) {
      _post(`api/key_result/${kr.id}/follow`).then((_) => {
        TreeListRef.current.func();
      });
    } else {
      _post(`api/key_result/${kr.id}/unfollow`).then((_) => {
        TreeListRef.current.func();
      });
    }
    getPageData();
  };

  // 获取有无点赞
  const getDefalSter = (kr) => {
    let res = kr.followerList.find((ele) => {
      return ele.id === myself.userId;
    });
    // console.log(`${kr.id}`);
    // console.log(res);
    return !!res ? 1 : 0;
  };

  //评论
  const getCommentList = (id) => {
    let params = {
      targetUserId: id,
    };
    _post(`api/comment/list`, params).then((res) => {
      if (res.success) {
        setDiscuss(res.data);
      }
    });
  };
  const handleCommentSuccess = (text) => {
    if (text == "success") {
      getCommentList(people.id);
    }
  };
  const deleteDiscuss = (discuss) => {
    //删除某条comment
    _post(`api/comment/${discuss.id}/delete`).then((res) => {
      if (res.success) {
        message.success("评论删除成功");
        getCommentList(people.id);
      } else {
        message.error(res.message);
      }
    });
  };

  // kr进度
  const progressConfirm = (kr) => {
    let params = progressForm.getFieldValue();
    _post(`api/key_result/update/status`, { ...params, id: kr.id }).then(
      (res) => {
        if (res.success) {
          message.success("进度记录修改成功");
          getPageData();
        } else {
          message.error(res.message);
        }
      }
    );
    progressForm.resetFields();
  };

  const handleProgressFormVis = (visible) => {};
  const handleProgressClick = (kr) => {
    // console.log(kr);
    progressForm.setFieldsValue({
      progress: kr.progress,
      status: kr.status,
    });
  };
  const getProgresColor = (text) => {
    let color = "";
    switch (text) {
      case "normal":
        color = "#1890ff";
        break;
      case "risk":
        color = "#f58d2c";
        break;
      case "delay":
        color = "#e25d58";
        break;
      default:
        color = "#1890ff";
    }
    return color;
  };
  // 对齐
  const handleAlign = (object) => {
    setObjEdit(object);
    setAlignAtVis(true);
  };

  const handleAlignAtOk = () => {
    if (!objEdit.objective.id || !alignAtId) {
      message.warn("请选择对齐目标");
      return;
    }
    let params = {
      o_id_align_to: objEdit.objective.id,
      o_id_align_by: alignAtId,
    };
    _post(`api/objective/align`, params).then((res) => {
      if (res.success) {
        message.success("对齐成功");
        getPageData();
      } else {
        message.error(res.message);
      }
    });

    setAlignAtVis(false);
    setObjEdit(null);
    setAlignAtId(null);
  };
  const handleAlignAtCancel = () => {
    setAlignAtVis(false);
    setObjEdit(null);
    setAlignAtId(null);
  };
  const callbackAlign = (id) => {
    let myId = objEdit.objective.id; //本条id
    _post(`api/objective/list/${id}/user?alignObjectiveId=${myId}`).then(
      (res) => {
        setAlignAtList(res.data.objectiveVOList);
        // setPeople(res.data.user)
      }
    );
  };
  const handleAlignAtChoose = (obj) => {
    setAlignAtId(obj.objective.id);
  };
  const handleReliseAlign = (myOkrId, okr) => {
    let params = {
      o_id_align_to: myOkrId,
      o_id_align_by: okr.id,
    };
    _post(`api/objective/unalign`, params).then((res) => {
      if (res.success) {
        message.success("取消对齐");
        getPageData();
      } else {
        message.error(res.message);
      }
    });
  };
  // 文件上传
  function beforeUpload(file) {
    const isLt2M = file.size / 1024 / 1024 < 10;
    if (!isLt2M) {
      message.error("附件大小不能超过10MB!");
    }
    return isLt2M;
  }
  const getUploadList = (objective) => {
    return {
      name: "file",
      headers: {
        token: localStorage.getItem("token"),
      },
      action: `api/objective/${objective.objective.id}/progress_record/attachment/upload`,
      showUploadList: false,

      listType: "text",
      beforeUpload: beforeUpload,
      maxCount: 10,
      // fileList: objective.objective.progressRecordAttachment,
      onChange(info, fileList, eve) {
        // console.log(info);
        // console.log(eve);
        if (info.fileList.length > 10) {
          message.error(`附件大小不能超过10个`);
          return;
        }
        if (info.file.status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === "done") {
          // console.log('done');
          message.success(`${info.file.name} 上传成功`);
          getPageData();
        } else if (info.file.status === "error") {
          // console.log('error');
          message.error(`${info.file.name} 上传失败`);
        }
      },
    };
  };

  const handleFileDel = (id) => {
    // console.log(id);
    confirm({
      title: "警告?",
      content: "确定删除此文件吗？",
      onOk() {
        _post(`api/objective/progress_record/attachment/${id}/delete`).then(
          (res) => {
            if (res.success) {
              message.success(`删除成功`);
              getPageData();
            } else {
              message.error(res.message);
            }
          }
        );
      },
      onCancel() {},
    });
  };

  const handViewPic = (url) => {
    Modal.info({
      titie: null,
      icon: null,
      width: 600,
      cancelText: null,
      okButtonProps: null,
      okText: "关闭",
      okType: "text",
      maskClosable: true,
      content: <Image width={500} preview={false} src={url} />,
      onOk() {},
    });
  };

  const handleDoloadDel = (file) => {
    const a = document.createElement("a");
    a.setAttribute("download", file.name);
    a.setAttribute("href", file.url);
    a.setAttribute("target", "_blank");
    a.click();
  };

  const getAlignAtDetail = (myOkrId, alignat, btnShow) => {
    return (
      <div className="align-detail">
        <ul className="align-detail-ul">
          {alignat.list.map((item, idx) => {
            return (
              <li key={item.id} className="align-detail-li">
                <div>
                  {idx + 1}. {item?.content}
                </div>
                {btnShow ? (
                  // 权限
                  objective.isMe ? (
                    <div>
                      <Button
                        type="link"
                        onClick={() => handleReliseAlign(myOkrId, item)}
                      >
                        取消对齐
                      </Button>
                    </div>
                  ) : null
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };
  const gotoAlignAtUser = (alignat) => {
    store.dispatch(treeActions.selectPeople(alignat.id));
  };

  const getAlignTitile = (alignat) => {
    return (
      <div className="alignTitle-warp">
        <Avatar
          src={`http://grean-ops.oss-cn-hangzhou.aliyuncs.com/avatar/${alignat.wxUserId}.png`}
        />
        <div className="main">
          <p>{alignat.account}</p>
          <p>
            {alignat.dept_1}-{alignat?.dept_2}
          </p>
        </div>

        <div>
          <Button type="link" onClick={() => gotoAlignAtUser(alignat)}>
            查看详情
          </Button>
        </div>
      </div>
    );
  };
  const popoverlayStyle = {
    width: "400px",
  };
  // 折叠面板
  const handleCollpase = (target) => {
    let idx = collapse.findIndex((item) => item == target);
    if (idx == -1) {
      setCollapse([target, ...collapse]);
    } else {
      setCollapse(collapse.filter((item) => item !== target));
    }
  };
  // 关注人
  const getStarPeople = (kr) => {
    if (!!kr.followerList.length) {
      return kr.followerList.map((item) => {
        return item.nickname + ",";
      });
    } else {
      return "";
    }
  };
  // 导出
  const download = () => {
    _download(
      `api/objective/list/${people.id}/user/export`,
      {},
      `${people.nickname}绩效`
    );
  };

  return (
    <>
      <Layout className="tree-list">
        <Sider theme="light" width={300} className="bg-white tree-list-side">
          <ListTree onRef={TreeListRef} />
        </Sider>
        <Layout>
          <Content className="home-main">
            <Header className="bg-white" style={{ padding: "0" }}>
              <div className="user-item">
                {/* <Avatar size={34} style={{ backgroundColor: '#7265e6', verticalAlign: 'middle' }}>{people.nickname}</Avatar> */}
                <span style={{ marginLeft: "8px", fontSize: "22px" }}>
                  {people?.dept_1}-{people?.dept_2}
                  {people?.dept_2 ? "-" : ""}
                  {people.nickname}
                </span>
                <Button type="link" onClick={download}>
                  导出
                </Button>
              </div>
            </Header>
            {!!objective?.objectiveVOList.length ? (
              objective?.objectiveVOList?.map((item, index) => {
                return (
                  <div className="site-card-wrapper" key={index}>
                    <Row gutter={16}>
                      <Col span={24}>
                        <Card
                          title={
                            <div className="okr-title-wrap">
                              <div className="okr-title-left-wrap">
                                <p className="okr-title-test zhehang">
                                  <span>对齐目标: </span>

                                  {item?.objectiveAlignTo.map(
                                    (jtem, jdx, ary) => {
                                      return (
                                        <Popover
                                          key={jdx}
                                          overlayStyle={popoverlayStyle}
                                          placement="bottomLeft"
                                          title={() =>
                                            getAlignTitile(jtem.user)
                                          }
                                          content={() =>
                                            getAlignAtDetail(
                                              item.objective.id,
                                              jtem,
                                              true
                                            )
                                          }
                                          trigger="hover"
                                        >
                                          <span className="cursor-pointer">
                                            {jtem.user.nickname}
                                            {jtem.count > 1
                                              ? `(${jtem.count})`
                                              : ""}
                                          </span>
                                          {jdx !== ary.length - 1 ? ",  " : ""}
                                        </Popover>
                                      );
                                    }
                                  )}
                                  {
                                    // 权限
                                    objective.isMe ? (
                                      <Button
                                        type="link"
                                        style={{ fontSize: "14px" }}
                                        onClick={() => handleAlign(item)}
                                      >
                                        + 添加对齐
                                      </Button>
                                    ) : null
                                  }
                                </p>

                                <div className="obj-content-main">
                                  {
                                    collapse.includes(item.objective.id) ? (
                                      <MinusSquareOutlined
                                        style={{ marginRight: "8px" }}
                                        onClick={() =>
                                          handleCollpase(item.objective.id)
                                        }
                                      />
                                    ) : (
                                      <PlusSquareOutlined
                                        style={{ marginRight: "8px" }}
                                        onClick={() =>
                                          handleCollpase(item.objective.id)
                                        }
                                      />
                                    )
                                    // <IconFont iconName='shouqi' style={{ marginRight: '8px', fontSize: '20px' }} onClick={() => handleCollpase(item.objective.id)} />

                                    // :
                                    // <IconFont iconName='zhankai' style={{ marginRight: '8px', fontSize: '20px' }} onClick={() => handleCollpase(item.objective.id)} />
                                  }
                                  {/* <Tag color="#2db7f5"> */}
                                  {item.myFavirite ? (
                                    <Tooltip
                                      placement="top"
                                      title="内有我关注的子目标"
                                    >
                                      <Tag color="#fadb14">O{index + 1}</Tag>
                                    </Tooltip>
                                  ) : (
                                    <Tag color="#2db7f5">O{index + 1}</Tag>
                                  )}

                                  <p
                                    className="zhehang"
                                    style={{ paddingRight: "8px" }}
                                  >
                                    {item.objective.content}
                                  </p>
                                </div>
                                <p
                                  className="okr-title-test zhehang"
                                  style={{
                                    marginTop: "8px",
                                    paddingRight: "18px",
                                  }}
                                >
                                  {item.objectiveAlignBy.length ? (
                                    <span>对齐我的: </span>
                                  ) : null}

                                  {item.objectiveAlignBy.map(
                                    (jtem, jdx, ary) => {
                                      return (
                                        <Popover
                                          key={jdx}
                                          overlayStyle={popoverlayStyle}
                                          placement="bottomLeft"
                                          title={() =>
                                            getAlignTitile(jtem.user)
                                          }
                                          content={() =>
                                            getAlignAtDetail(
                                              item.objective.id,
                                              jtem,
                                              false
                                            )
                                          }
                                          trigger="hover"
                                        >
                                          <span className="cursor-pointer">
                                            {jtem.user.nickname}
                                            {jtem.count > 1
                                              ? `(${jtem.count})`
                                              : ""}
                                          </span>
                                          {jdx !== ary.length - 1 ? ",  " : ""}
                                        </Popover>
                                      );
                                    }
                                  )}
                                </p>
                              </div>

                              <div className="okr-title-right-wrap">
                                <div className="okr-title-right">
                                  {/* <div>
                                    <p className='okr-title-test'>关注我的</p>
                                  </div> */}
                                  <div>
                                    <p className="okr-title-test text-align-r ">
                                      进度
                                    </p>
                                    <div
                                      className="flex-btn"
                                      style={{ width: "75px" }}
                                    >
                                      <Progress
                                        type="circle"
                                        percent={item.objective.progress}
                                        width={20}
                                        format={() => {
                                          return null;
                                        }}
                                        strokeWidth="20"
                                        strokeColor={getProgresColor(
                                          item.objective.status
                                        )}
                                      />
                                      <span>{item.objective.progress}%</span>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="okr-title-test">权重</p>
                                    <p>{item.objective.weight}%</p>
                                  </div>
                                  <div>
                                    <p className="okr-title-test">总分</p>
                                    <p>
                                      {item.objective.score
                                        ? item.objective.score
                                        : "0.0"}
                                    </p>
                                  </div>
                                  <div>
                                    <p
                                      style={{ width: "72px" }}
                                      className="okr-title-test"
                                    >
                                      截止日期
                                    </p>
                                    <p
                                      style={{ width: "50px", height: "25px" }}
                                    >
                                      {" "}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  style={{ visibility: "hidden" }}
                                  type="link"
                                >
                                  打分
                                </Button>
                                {
                                  // 权限
                                  objective.isMe ? (
                                    <>
                                      <Button
                                        type="link"
                                        onClick={() =>
                                          handleEditObjective(item)
                                        }
                                      >
                                        编辑
                                      </Button>
                                      <CloseOutlined
                                        className="cursor-pointer"
                                        onClick={() =>
                                          handleDelteObjective(item)
                                        }
                                      />
                                    </>
                                  ) : (
                                    <Button
                                      style={{ visibility: "hidden" }}
                                      type="link"
                                      onClick={() => handleEditObjective(item)}
                                    >
                                      查看
                                    </Button>
                                  )
                                }
                              </div>
                              <div className="last-modify-time">
                                {moment(item.objective.gmtModify).format(
                                  "MM-DD"
                                )}
                              </div>
                            </div>
                          }
                        >
                          {/* 折叠 */}
                          {
                            // collapse.includes(item.objective.id) ?
                            <div
                              id="scrollableDiv"
                              className={`scrollableDiv ${
                                collapse.includes(item.objective.id)
                                  ? "drop"
                                  : ""
                              }`}
                            >
                              <List
                                itemLayout="horizontal"
                                dataSource={item.keyResultList}
                                renderItem={(jtem, jndex) => (
                                  <List.Item>
                                    <Skeleton loading={loading} active avatar>
                                      <List.Item.Meta
                                        avatar={
                                          <Space align="center">
                                            <Tooltip
                                              placement="topLeft"
                                              title={getStarPeople(jtem)}
                                            >
                                              <div className="flex-col">
                                                <Rate
                                                  disabled={objective.isMe}
                                                  count={1}
                                                  onChange={(eve) =>
                                                    handleKRstar(eve, jtem)
                                                  }
                                                  value={getDefalSter(jtem)}
                                                />
                                                <span>
                                                  {jtem.followerList.length}
                                                </span>
                                              </div>
                                            </Tooltip>
                                            <Tag color="blue">
                                              KR{jndex + 1}
                                            </Tag>
                                          </Space>
                                        }
                                        description={
                                          <div
                                            contentEditable={item.canEditor}
                                            className="kr-content-wrap"
                                            style={{
                                              color: "#373c43",
                                              lineHeight: "22px",
                                              fontSize: "14px",
                                            }}
                                          >
                                            {jtem.content}

                                            <div className="okr-title-right-wrap">
                                              <div className="okr-title-right">
                                                {/* <div>
                                                  <Tooltip placement="topLeft" title={getStarPeople(jtem)}>
                                                    {jtem?.followerList.map((ktem, kdx) => { return <span key={`${jtem.id}_${kdx}`}>{ktem.nickname}, </span> })}

                                                  </Tooltip>
                                                </div> */}
                                                <div
                                                  className="flex-btn"
                                                  style={{ width: "75px" }}
                                                >
                                                  <Progress
                                                    type="circle"
                                                    percent={jtem.progress}
                                                    width={20}
                                                    format={() => {
                                                      return null;
                                                    }}
                                                    strokeWidth="20"
                                                    strokeColor={getProgresColor(
                                                      jtem.status
                                                    )}
                                                  />
                                                  <Popconfirm
                                                    placement="bottomRight"
                                                    icon={null}
                                                    onVisibleChange={
                                                      handleProgressFormVis
                                                    }
                                                    disabled={!objective.isMe}
                                                    title={
                                                      <div>
                                                        <Form
                                                          name="progress"
                                                          labelCol={{ span: 8 }}
                                                          wrapperCol={{
                                                            span: 16,
                                                          }}
                                                          autoComplete="off"
                                                          layout="vertical"
                                                          form={progressForm}
                                                          preserve={false}
                                                          initialValues={{
                                                            status: "normal",
                                                            progress: 0,
                                                          }}
                                                        >
                                                          <Form.Item
                                                            label={
                                                              <span className="progress-form-label">
                                                                当前进度
                                                              </span>
                                                            }
                                                            name="progress"
                                                          >
                                                            <InputNumber
                                                              addonAfter="%"
                                                              min={0}
                                                              max={999}
                                                              controls={false}
                                                            />
                                                          </Form.Item>

                                                          <Form.Item
                                                            label={
                                                              <span className="progress-form-label">
                                                                状态
                                                              </span>
                                                            }
                                                            name="status"
                                                            initialValue="normal"
                                                          >
                                                            <Radio.Group>
                                                              {/* <Space direction="vertical" className='progress-radio-group'> */}
                                                              <Radio value="normal">
                                                                正常
                                                              </Radio>
                                                              <Radio
                                                                style={{
                                                                  color:
                                                                    "#f58d2c",
                                                                  display:
                                                                    "block",
                                                                }}
                                                                value="risk"
                                                              >
                                                                有风险
                                                              </Radio>
                                                              <Radio
                                                                style={{
                                                                  color:
                                                                    "#e25d58",
                                                                  display:
                                                                    "block",
                                                                }}
                                                                value="delay"
                                                              >
                                                                已逾期
                                                              </Radio>
                                                              {/* </Space> */}
                                                            </Radio.Group>
                                                          </Form.Item>
                                                        </Form>
                                                      </div>
                                                    }
                                                    onConfirm={() =>
                                                      progressConfirm(jtem)
                                                    }
                                                    okText="确定"
                                                    cancelText="取消"
                                                  >
                                                    {objective.isMe ? (
                                                      <Button
                                                        style={{ padding: 0 }}
                                                        type="link"
                                                        className="cursor-pointer"
                                                        onClick={() =>
                                                          handleProgressClick(
                                                            jtem
                                                          )
                                                        }
                                                      >
                                                        {jtem.progress}%
                                                      </Button>
                                                    ) : (
                                                      <div
                                                        style={{ padding: 0 }}
                                                      >
                                                        {jtem.progress}%
                                                      </div>
                                                    )}
                                                  </Popconfirm>
                                                </div>
                                                <div>{jtem.weight}%</div>
                                                <div>
                                                  {jtem.score
                                                    ? jtem.score
                                                    : "0.0"}
                                                </div>
                                                <div>
                                                  {jtem.deadline
                                                    ? moment(
                                                        jtem.deadline
                                                      ).format("YYYY-MM-DD")
                                                    : " "}
                                                </div>
                                              </div>
                                              <Button
                                                type="link"
                                                onClick={() =>
                                                  // handleEditKrScore(jtem)
                                                  handleEditKrScore(jtem)
                                                }
                                              >
                                                打分
                                              </Button>
                                              {objective.isMe ? (
                                                <>
                                                  <Button
                                                    type="link"
                                                    onClick={() =>
                                                      handleEditKrective(jtem)
                                                    }
                                                  >
                                                    编辑
                                                  </Button>
                                                  <CloseOutlined
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                      handleDelteKrective(jtem)
                                                    }
                                                  />
                                                </>
                                              ) : (
                                                <Button
                                                  type="link"
                                                  onClick={() =>
                                                    handleLookUprective(jtem)
                                                  }
                                                >
                                                  详情
                                                </Button>
                                              )}
                                            </div>
                                          </div>
                                        }
                                      />
                                    </Skeleton>
                                  </List.Item>
                                )}
                                footer={
                                  <div>
                                    {
                                      <div>
                                        {objective.isMe ? (
                                          <Button
                                            type="link"
                                            icon={<PlusOutlined />}
                                            onClick={() => addKeyRes(item)}
                                          >
                                            添加子目标
                                          </Button>
                                        ) : null}
                                      </div>
                                    }
                                  </div>
                                }
                              />
                            </div>
                            // : null
                          }
                        </Card>
                      </Col>
                    </Row>
                    {/* 进度记录 */}
                    {
                      <div className="record-progress">
                        <div className="icon-wrap">
                          <SnippetsOutlined />
                        </div>
                        <div className="progress">
                          <div className="progress-wrap">
                            <span>进度记录</span>
                            {objective.isMe ? (
                              <div className="progress-wrap">
                                <Button
                                  type="link"
                                  onClick={() => handleProgressEdit(item)}
                                >
                                  编辑
                                </Button>
                                {item.objective.progressRecordAttachment
                                  .length >= 10 ? null : (
                                  <Upload {...getUploadList(item)}>
                                    <Button
                                      type="link"
                                      icon={<UploadOutlined />}
                                    >
                                      上传附件
                                    </Button>
                                  </Upload>
                                )}

                                <div className="file-list">
                                  {item.objective.progressRecordAttachment.map(
                                    (jtem) => {
                                      return (
                                        <p key={jtem.id} className="file-item">
                                          <span className="text">
                                            {jtem.name}
                                          </span>
                                          <div className="tool">
                                            {/* <IconFont iconName='yanjing' className='icon-x' onClick={() => handViewPic(jtem.url)} /> */}
                                            <IconFont
                                              iconName="yunxiazai_o"
                                              className="icon-x"
                                              onClick={() =>
                                                handleDoloadDel(jtem)
                                              }
                                            />
                                            <IconFont
                                              iconName="shanchu"
                                              className="icon-x"
                                              onClick={() =>
                                                handleFileDel(jtem.id)
                                              }
                                            />
                                          </div>
                                        </p>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div
                                className="progress-wrap"
                                style={{ marginLeft: "8px" }}
                              >
                                <div className="file-list">
                                  {item.objective.progressRecordAttachment.map(
                                    (jtem) => {
                                      return (
                                        <p key={jtem.id} className="file-item">
                                          <span className="text">
                                            {jtem.name}
                                          </span>
                                          <div className="tool">
                                            {/* <IconFont iconName='yanjing' className='icon-x' onClick={() => handViewPic(jtem.url)} /> */}
                                            <IconFont
                                              iconName="yunxiazai_o"
                                              className="icon-x"
                                              onClick={() =>
                                                handleDoloadDel(jtem)
                                              }
                                            />
                                          </div>
                                        </p>
                                      );
                                    }
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <div style={{ marginTop: "15px" }}>
                            <pre className="zhehang">
                              {item.objective.progressRecord}
                            </pre>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                );
              })
            ) : (
              <div style={{ width: "100%", margin: "100px 0" }}>
                <Empty />
              </div>
            )}

            {objective?.isMe ? (
              <div className="add-obj-btn">
                <Button
                  type="link"
                  icon={<PlusOutlined />}
                  onClick={addObjective}
                >
                  添加目标
                </Button>
              </div>
            ) : null}
            {/* 评论 */}
            <h2
              style={{
                fontSize: "15px",
                background: "#f5f6f7",
                paddingLeft: "8px",
              }}
            >
              评论
            </h2>
            <Divider
              style={{ color: "rgba(187,191,196,0.5)", margin: "8px 0" }}
            />

            {!!discuss.length ? (
              <List
                itemLayout="horizontal"
                dataSource={discuss}
                locale={{ emptyText: null }}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <a key="list-loadmore-edit"></a>,
                      item.createByMe ? (
                        <a
                          key="list-loadmore-more"
                          onClick={() => deleteDiscuss(item)}
                        >
                          删除
                        </a>
                      ) : null,
                    ]}
                  >
                    <List.Item.Meta
                      // avatar={<Avatar src={`http://grean-ops.oss-cn-hangzhou.aliyuncs.com/avatar/${item.commentUserId}.png`} />}
                      avatar={
                        <Avatar
                          src={`http://grean-ops.oss-cn-hangzhou.aliyuncs.com/avatar/${item.userAvatar.wxUserId}.png`}
                          size="large"
                          alt="Han Solo"
                        />
                      }
                      title={
                        <a>
                          {item.userAvatar.nickname}
                          <span
                            style={{
                              color: "#8f959e",
                              fontSize: "12px",
                              marginLeft: "5px",
                            }}
                          >
                            {moment(item.gmtCreate).fromNow()}
                          </span>
                        </a>
                      }
                      description={item.comment}
                    />
                  </List.Item>
                )}
              />
            ) : null}

            <MyCmment
              people={people}
              callback={handleCommentSuccess}
            ></MyCmment>
          </Content>

          <Content style={{ paddingTop: "0px", background: "#f5f6f7" }}>
            {/* 评论 */}
          </Content>
        </Layout>
        {/* <TextComment></TextComment> */}
      </Layout>

      {/* obj弹框 */}
      <Modal
        title={`${objAddEdit}目标`}
        visible={isModalVisible}
        onOk={handleObjOk}
        onCancel={handleObjCancel}
        destroyOnClose
        maskClosable={false}
      >
        <div>
          <Form
            form={objForm}
            preserve={false}
            layout="vertical"
            name="form_in_modal"
            initialValues={{
              modifier: "public",
            }}
          >
            <Form.Item
              name="content"
              label="目标内容"
              rules={[
                {
                  required: true,
                  message: "请输入目标!",
                },
              ]}
            >
              <MyMention></MyMention>
              {/* <TextArea showCount maxLength={100} style={{ height: 120 }} /> */}
            </Form.Item>
            <Form.Item
              name="weight"
              label="权重"
              rules={[
                {
                  required: true,
                  message: "请输入0~100的整数!",
                },
              ]}
            >
              <InputNumber min={0} max={100} addonAfter="%" controls={false} />
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* 编辑进度弹窗 */}
      {/* TODO Mytentui更改为 anyd */}
      <Modal
        title="进度记录"
        visible={progressEditVisable}
        onOk={handleProgressEdtiOk}
        onCancel={handleProgressEdtiCancel}
        destroyOnClose
        maskClosable={false}
      >
        {/* <TextArea placeholder="请输入进度记录" rows={4} autoSize value={progresRecord} onChange={handleProgressRecordChange} /> */}
        <MyMention
          value={progresRecord}
          onChange={handleProgressRecordChange}
        />
      </Modal>

      {/* KR弹框 */}
      <Modal
        title={`${krAddEdit}子目标`}
        visible={krModalVisible}
        onOk={handleKROk}
        onCancel={handleKRCancel}
        destroyOnClose
        maskClosable={false}
      >
        <div>
          <Form
            form={krForm}
            preserve={false}
            layout="horizontal"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 17 }}
            name="kr"
            initialValues={{
              modifier: "public",
            }}
          >
            <Form.Item
              name="content"
              label="目标内容"
              rules={[
                {
                  required: true,
                  message: "请输入子目标!",
                },
              ]}
            >
              {/* <TextArea showCount maxLength={100} style={{ height: 120 }} /> */}
              <MyMention />
            </Form.Item>
            <Form.Item
              name="deadline"
              label="截止时间"
              rules={[
                {
                  required: true,
                  message: "请选择时间!",
                },
              ]}
            >
              <DatePicker disabledDate={disabledDate} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
              name="weight"
              label="权重"
              rules={[
                {
                  required: true,
                  message: "请输入0~100的整数!",
                },
              ]}
            >
              <InputNumber min={0} max={100} addonAfter="%" controls={false} />
            </Form.Item>
            <Form.Item
              name="milestone"
              label="里程碑"
              rules={[
                {
                  required: true,
                  message: "必填项未填写!",
                },
              ]}
            >
              <TextArea showCount maxLength={500} style={{ height: 120 }} />
            </Form.Item>
            <Form.Item name="levelBad" label="不可接受标准">
              <Input />
            </Form.Item>
            <Form.Item name="levelNormal" label="达标标准">
              <Input />
            </Form.Item>
            <Form.Item name="levelExcellent" label="卓越标准">
              <Input />
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <Modal
        title={`${krAddEdit}子目标`}
        visible={krModalLookVisible}
        destroyOnClose
        forceRender
        footer={null}
        onCancel={() => setKrModalLookVisible(false)}
        maskClosable={false}
      >
        <div>
          <Form
            layout="horizontal"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 17 }}
            name="kr"
          >
            <Form.Item name="content" label="目标内容">
              <p>{krEdit?.content}</p>
            </Form.Item>
            <Form.Item name="deadline" label="截止时间">
              <p>{moment(krEdit?.deadline).format("YYYY-MM-DD")}</p>
              {/* <DatePicker disabledDate={disabledDate} format="MM-DD" defaultValue={moment(krEdit?.gmtCreate)} disabled /> */}
            </Form.Item>
            <Form.Item name="weight" label="权重">
              <p>{krEdit?.weight}%</p>
            </Form.Item>
            <Form.Item name="milestone" label="里程碑">
              <p>{krEdit?.milestone}</p>
            </Form.Item>
            <Form.Item name="levelBad" label="不可接受标准">
              <p>{krEdit?.levelBad}</p>
            </Form.Item>
            <Form.Item name="levelNormal" label="达标标准">
              <p>{krEdit?.levelNormal}</p>
            </Form.Item>
            <Form.Item name="levelExcellent" label="卓越标准">
              <p>{krEdit?.levelExcellent}</p>
            </Form.Item>
          </Form>
        </div>
      </Modal>
      {/* 对齐Modal */}
      <Modal
        width={1000}
        title="添加对齐目标"
        visible={alignAtVis}
        onOk={handleAlignAtOk}
        onCancel={handleAlignAtCancel}
        destroyOnClose
        style={{ height: "550px" }}
      >
        <Layout>
          <Sider theme="light" width={300} className="bg-white tree-list-side">
            <ListTreeOkr callback={callbackAlign} />
          </Sider>
          <Content className="modal-align-content">
            {alignAtList.length ? (
              alignAtList?.map((item, idx) => {
                return (
                  <React.Fragment key={idx}>
                    {item.alignByTargetObjective ? (
                      <p
                        key={idx}
                        className={`modal-alignat-list-item ${
                          item.objective.id === alignAtId
                            ? "alignat-active"
                            : ""
                        }`}
                      >
                        {idx + 1}. {item.objective.content}
                        <div className="zhedang cursor-disable"></div>
                      </p>
                    ) : (
                      <p
                        key={idx}
                        onClick={() => handleAlignAtChoose(item)}
                        className={`modal-alignat-list-item ${
                          item.objective.id === alignAtId
                            ? "alignat-active"
                            : ""
                        }`}
                      >
                        {idx + 1}. {item.objective.content}
                      </p>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Content>
        </Layout>
      </Modal>

      {/* 打分弹框 */}
      <Modal
        title="打分"
        visible={scoreVis}
        onOk={handleScoreOK}
        onCancel={() => {
          setScoreVis(false);
        }}
        destroyOnClose
        maskClosable={false}
      >
        <div>
          <Form
            form={scoreForm}
            preserve={false}
            layout="vertical"
            name="form_in_modal"
            initialValues={{
              modifier: "public",
            }}
          >
            <Form.Item
              name="score"
              label="打分"
              rules={[
                {
                  required: true,
                  message: "请输入0~100的整数!",
                },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                addonAfter="百分制"
                controls={false}
              />
            </Form.Item>
            <Form.Item
              name="scoreDescription"
              label="评估意见"
              rules={[
                {
                  required: true,
                  message: "请输入评估意见!",
                },
              ]}
            >
              <MyMention></MyMention>
              {/* <TextArea showCount maxLength={100} style={{ height: 120 }} /> */}
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

function disabledDate() {}

const mapStateToProps = (state) => state;

export default connect(mapStateToProps)(Home);
