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
  Select,
} from "antd";
import "../index.less";
import {
  PlusOutlined,
  EditOutlined,
  SnippetsOutlined,
  CloseOutlined,
  PlusSquareOutlined,
  MinusSquareOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { _post, _get, _download } from "../../../server/http";
import moment from "moment";
import MyCmment from "../MyCmment";
import MyMention from "../MyMention";
import store from "../../../../store";
import { treeActions } from "../../../../store/actions/tree-action";
import { connect } from "react-redux";
import IconFont from "../../../shared/IconFont";

const { Header, Sider, Content } = Layout;
const { TextArea } = Input;
const { confirm } = Modal;
const myself = JSON.parse(localStorage.getItem("user"));
let TreeListRef = React.createRef();
let nowYear = moment().get("year");

const PartTwo = ({ tree, year }) => {
  let navigate = useNavigate();
  const [objective, setObjective] = useState(null); //objective

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

  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(true);

  // 展开折叠
  const [collapse, setCollapse] = useState([]);
  // 6.23加入打分操作
  const [scoreVis, setScoreVis] = useState(false); // 打分弹窗
  const [scoreForm] = Form.useForm(); //打分表单
  const [resultScore, setResultScore] = useState({}); //打分数据
  const [seasonList, setSeasonList] = useState([]);

  useEffect(() => {
    if (tree.id) {
      selectMan(tree.id);
    }
    // else {
    //   let user = JSON.parse(localStorage.getItem("user"));
    //   selectMan(user.userId);
    // }
  }, [tree.id, year]);

  // 获取页面数据
  const getPageData = () => {
    _post(`api/objective/list/${tree.id}/dept?year=${year}&org=company`).then(
      (res) => {
        setObjective(res.data);
      }
    );
  };

  // 选择的人员 id选择的人的id
  const selectMan = (id) => {
    _post(`api/objective/list/${id}/dept?year=${year}&org=company`, {}).then(
      (res) => {
        setObjective(res.data);
      }
    );
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
        values.deptId = tree.id;
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
        dataYear: res.data.dataYear,
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
    });
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
    params.deadline = moment(params.deadline).format("YYYY-MM-DD");
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
    });
  };
  // 打分
  const handleEditKrScore = (obj, flag) => {
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
          //单季度或多季度
          let { targetSeason, isSingleSeason, keyResultScoreList } = res.data;
          if (res.data.isSingleSeason) {
            setSeasonList([
              {
                value: targetSeason,
                label: `第${targetSeason}季度`,
              },
            ]);
          } else {
            setSeasonList([
              {
                value: 1,
                label: "第1季度",
              },
              {
                value: 2,
                label: "第2季度",
              },
              {
                value: 3,
                label: "第3季度",
              },
              {
                value: 4,
                label: "第4季度",
              },
            ]);
          }
          setResultScore(res.data);
          setTimeout(() => {
            if (isSingleSeason) {
              //单季度
              scoreForm.setFieldsValue({
                ...keyResultScoreList[0],
                targetSeason: targetSeason,
              });
            } else {
              //多季度按照 targetSeason 取对应的数组值
              scoreForm.setFieldsValue({
                ...keyResultScoreList[targetSeason - 1],
                targetSeason: targetSeason,
              });
            }
          });
        }
      } else {
        message.error(res.message);
      }
    });
    setScoreVis(true);
  };

  const handleScoreOK = () => {
    let params = scoreForm.getFieldsValue();
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
      getCommentList(tree.id);
    }
  };
  const deleteDiscuss = (discuss) => {
    //删除某条comment
    _post(`api/comment/${discuss.id}/delete`).then((res) => {
      if (res.success) {
        message.success("评论删除成功");
        getCommentList(tree.id);
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
        {/* <Avatar
          src={`http://grean-ops.oss-cn-hangzhou.aliyuncs.com/avatar/${alignat.wxUserId}.png`}
        /> */}
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

  // 季度变换
  const handleSeasonChange = (value) => {
    if (!resultScore.isSingleSeason) {
      let res = resultScore.keyResultScoreList[value - 1];
      if (res) {
        scoreForm.setFieldsValue({
          ...resultScore.keyResultScoreList[value - 1],
        });
      } else {
        scoreForm.setFieldsValue({
          score: undefined,
          scoreDescription: undefined,
        });
      }
    }
  };

  return (
    <>
      <Content>
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
                            <p className="okr-title-test zhehang"></p>

                            <div className="obj-content-main">
                              {collapse.includes(item.objective.id) ? (
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
                              )}
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

                              {item.objectiveAlignBy.map((jtem, jdx, ary) => {
                                return (
                                  <Popover
                                    key={jdx}
                                    overlayStyle={popoverlayStyle}
                                    placement="bottomLeft"
                                    title={() => getAlignTitile(jtem.user)}
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
                                      {jtem.count > 1 ? `(${jtem.count})` : ""}
                                    </span>
                                    {jdx !== ary.length - 1 ? ",  " : ""}
                                  </Popover>
                                );
                              })}
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
                                  --
                                  {/* {item.objective.score
                                        ? item.objective.score
                                        : "0.0"} */}
                                </p>
                              </div>
                              <div>
                                <p
                                  style={{ width: "72px" }}
                                  className="okr-title-test"
                                >
                                  截止日期
                                </p>
                                <p style={{ width: "50px", height: "25px" }}>
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
                                    onClick={() => handleEditObjective(item)}
                                  >
                                    编辑
                                  </Button>
                                  <CloseOutlined
                                    className="cursor-pointer"
                                    onClick={() => handleDelteObjective(item)}
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
                            {moment(item.objective.gmtModify).format("MM-DD")}
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
                            collapse.includes(item.objective.id) ? "drop" : ""
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
                                        <Tag color="blue">KR{jndex + 1}</Tag>
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
                                                              color: "#f58d2c",
                                                              display: "block",
                                                            }}
                                                            value="risk"
                                                          >
                                                            有风险
                                                          </Radio>
                                                          <Radio
                                                            style={{
                                                              color: "#e25d58",
                                                              display: "block",
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
                                                      handleProgressClick(jtem)
                                                    }
                                                  >
                                                    {jtem.progress}%
                                                  </Button>
                                                ) : (
                                                  <div style={{ padding: 0 }}>
                                                    {jtem.progress}%
                                                  </div>
                                                )}
                                              </Popconfirm>
                                            </div>
                                            <div>{jtem.weight}%</div>
                                            <div>
                                              {jtem.score ? jtem.score : "0.0"}
                                            </div>
                                            <div>
                                              {jtem.deadline
                                                ? moment(jtem.deadline).format(
                                                    "YYYY-MM-DD"
                                                  )
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
                            {item.objective.progressRecordAttachment.length >=
                            10 ? null : (
                              <Upload {...getUploadList(item)}>
                                <Button type="link" icon={<UploadOutlined />}>
                                  上传附件
                                </Button>
                              </Upload>
                            )}

                            <div className="file-list">
                              {item.objective.progressRecordAttachment.map(
                                (jtem) => {
                                  return (
                                    <p key={jtem.id} className="file-item">
                                      <span className="text">{jtem.name}</span>
                                      <div className="tool">
                                        {/* <IconFont iconName='yanjing' className='icon-x' onClick={() => handViewPic(jtem.url)} /> */}
                                        <IconFont
                                          iconName="yunxiazai_o"
                                          className="icon-x"
                                          onClick={() => handleDoloadDel(jtem)}
                                        />
                                        <IconFont
                                          iconName="shanchu"
                                          className="icon-x"
                                          onClick={() => handleFileDel(jtem.id)}
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
                                      <span className="text">{jtem.name}</span>
                                      <div className="tool">
                                        {/* <IconFont iconName='yanjing' className='icon-x' onClick={() => handViewPic(jtem.url)} /> */}
                                        <IconFont
                                          iconName="yunxiazai_o"
                                          className="icon-x"
                                          onClick={() => handleDoloadDel(jtem)}
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

        {/* <MyCmment people={tree} callback={handleCommentSuccess}></MyCmment> */}
      </Content>

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
              dataYear: nowYear,
            }}
          >
            <Form.Item
              name="dataYear"
              label="考核年份"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Radio.Group
                options={[
                  {
                    value: nowYear - 1,
                    label: nowYear - 1 + "年",
                  },
                  {
                    value: nowYear,
                    label: nowYear + "年",
                  },
                  {
                    value: nowYear + 1,
                    label: nowYear + 1 + "年",
                  },
                ]}
                optionType="button"
                buttonStyle="solid"
              />
            </Form.Item>
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
              isSingleSeason: true,
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
              name="isSingleSeason"
              label="季度考核"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Radio.Group
                options={[
                  {
                    value: true,
                    label: "单季度考核",
                  },
                  {
                    value: false,
                    label: "每季度考核",
                  },
                ]}
                optionType="button"
                buttonStyle="solid"
              />
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
              name="targetSeason"
              label="考核季度"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                options={seasonList}
                style={{ width: "200px" }}
                onChange={handleSeasonChange}
              />
            </Form.Item>
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

export default connect(mapStateToProps)(PartTwo);
