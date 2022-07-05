import React, { useState, useEffect, createElement } from "react";
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
  Checkbox,
  message,
  DatePicker,
  Progress,
  Tooltip,
  Comment,
  Mentions,
  Empty,
  Popconfirm,
  InputNumber,
  Radio,
  Space,
} from "antd";
import ListTree from "../../shared/listTree";
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
import MyCmment from "../home/MyCmment";
import MyMention from "../home/MyMention";
import TextComment from "../home/TextComment";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const { Header, Footer, Sider, Content } = Layout;
const { TextArea } = Input;

const CommentDetail = () => {
  const [canEditor, setCanEditor] = useState(false); // 是否处于编辑状态

  const [okrData, setOkrData] = useState([]); // okr数据[]

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
  useEffect(() => {
    getPageData();
  }, []);
  let location = useLocation();
  let params = useParams();
  // 获取页面数据
  const getPageData = (selectMan) => {
    // if (people.hasOwnProperty('me')) {
    //   _post(`api/objective/list/mine`).then(res => {
    //     setObjective(res.data)
    //   })
    getCommentList(location?.state.msg.target_user_id);

    _post(`api/objective/list/${location?.state.msg.target_user_id}/user`).then(
      (res) => {
        setObjective(res.data);
        setPeople(res.data.user);
      }
    );
  };

  // 发布Okr
  const issueOkr = () => {
    // TODO 与服务器交互

    setCanEditor(false);
  };
  // 取消okr发布
  const cancelIssueOkr = () => {
    if (formStatus == "add") {
      okrData.pop();
    }
    setOkrData(okrData);
    setCanEditor(false);
  };

  // 选择的人员
  // const selectMan = (seleMan) => {
  //   setPeople(seleMan)
  //   getCommentList(seleMan)

  //   // 获取数据

  //   _post(`api/objective/list/${seleMan.id}/user`).then(res => {
  //     setObjective(res.data)
  //   })
  // }
  //

  // 删除objevtive
  const handleDelteObjective = (obtive) => {
    Modal.confirm({
      title: "警告",
      content: `删除后不可恢复，确定删除 ${obtive.objective.content} 目标吗？`,
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

  //ok标题
  // const $cardTitle = <p><Tag color="#2db7f5">O{objective.length}</Tag></p>
  ///进度记录标题
  // const $cardProgressTitle = <p><Avatar icon={<SnippetsOutlined />} /><span style={{ marginLeft: '8px' }}>进度记录</span></p>

  // const $cardFooter = <p>
  //   <Button type="text" icon={<PlusOutlined />} onClick={addKeyRes}>添加 Key Result</Button>
  //   <Divider type="vertical" />
  //   {
  //     canEditor ?
  //       null : <Button type="text" icon={<EditOutlined />} onClick={etitorOkr}>修改OKR</Button>

  //   }
  // </p>
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
      }
      setObjEdit(null); //正在编辑OKR重置
      getPageData(); //刷新页面
      // setProgresRecord('')
    });
    setProgressEditVisable(false);
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
      content: "是否删除",
      onOk() {
        _post(`api/key_result/${krject.id}/delete`).then((res) => {
          if (res.success) {
            message.success("删除成功");
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
              message.success("KR添加成功");
              getPageData(); //刷新页面
            } else {
              message.error(res.message);
            }
          });
        } else if ("编辑") {
          params.id = krEdit.id;
          _post(`api/key_result/update`, params).then((res) => {
            if (res.success) {
              message.success("KR修改成功");
              getPageData(); //刷新页面
            } else {
              message.error(res.message);
            }
          });
        }
        setObjEdit(null);
        setKrEdit(null);
        krForm.resetFields(); //表单清空
        setKrModalVisible(false);
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

  //评论
  const getCommentList = (man) => {
    let params = {
      targetUserId: man,
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
    progressForm.setFieldsValue(kr);
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

  return (
    <>
      <Layout className="tree-list">
        {/* <Sider theme='light' width={300} className='bg-white tree-list-side'>
          <ListTree callback={selectMan} />
        </Sider> */}
        <Layout>
          <Content className="home-main">
            <Header className="bg-white" style={{ padding: "0" }}>
              <div className="user-item">
                <span style={{ marginLeft: "8px", fontSize: "22px" }}>
                  {people?.dept_1}-{people?.dept_2}
                  {people?.dept_2 ? "-" : ""}
                  {people.nickname}
                </span>
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
                              <div>
                                <Tag color="#2db7f5">O{index + 1}</Tag>
                                {item.objective.content}
                              </div>
                              <div className="okr-title-right-wrap">
                                <div className="okr-title-right">
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
                                </div>
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
                            </div>
                          }
                          bordered={false}
                          className={item.canEditor ? "card-active" : ""}
                        >
                          <List
                            itemLayout="horizontal"
                            dataSource={item.keyResultList}
                            renderItem={(jtem, jndex) => (
                              <List.Item>
                                <List.Item.Meta
                                  avatar={
                                    <div>
                                      <Tag color="blue">KR{jndex + 1}</Tag>
                                    </div>
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
                                                  wrapperCol={{ span: 16 }}
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
                                                    <InputNumber addonAfter="%" />
                                                  </Form.Item>

                                                  <Form.Item
                                                    label={
                                                      <span className="progress-form-label">
                                                        状态
                                                      </span>
                                                    }
                                                    name="status"
                                                  >
                                                    <Radio.Group>
                                                      <Space
                                                        direction="vertical"
                                                        className="progress-radio-group"
                                                      >
                                                        <Radio value="normal">
                                                          正常
                                                        </Radio>
                                                        <Radio
                                                          style={{
                                                            color: "#f58d2c",
                                                          }}
                                                          value="risk"
                                                        >
                                                          有风险
                                                        </Radio>
                                                        <Radio
                                                          style={{
                                                            color: "#e25d58",
                                                          }}
                                                          value="delay"
                                                        >
                                                          已逾期
                                                        </Radio>
                                                      </Space>
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
                                            <span
                                              className="cursor-pointer"
                                              onClick={() =>
                                                handleProgressClick(jtem)
                                              }
                                            >
                                              {jtem.progress}%
                                            </span>
                                          </Popconfirm>
                                          <span style={{ margin: "0 8px" }}>
                                            {jtem.weight}%
                                          </span>
                                          <span>
                                            {jtem.score ? jtem.score : "0.0"}
                                          </span>
                                        </div>
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
                              </List.Item>
                            )}
                            footer={
                              <div>
                                {
                                  <div>
                                    {objective.isMe ? (
                                      <Button
                                        type="text"
                                        icon={<PlusOutlined />}
                                        onClick={() => addKeyRes(item)}
                                      >
                                        添加子目标
                                      </Button>
                                    ) : null}
                                    {/* <Divider type="vertical" /> */}
                                    {/* {
                                item.canEditor ?
                                  null : <Button type="text" icon={<EditOutlined />} onClick={() => etitorOkr(item)}>修改OKR</Button>

                              } */}
                                  </div>
                                }
                              </div>
                            }
                          />
                          {item.canEditor ? (
                            <div className="edtit-btn-warp">
                              <Button type="primary" onClick={issueOkr}>
                                发布
                              </Button>
                              <Button
                                style={{ marginLeft: "10px" }}
                                onClick={cancelIssueOkr}
                              >
                                取消
                              </Button>
                            </div>
                          ) : null}
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
                          <div>
                            <span>进度记录</span>
                            {objective.isMe ? (
                              <Button
                                type="link"
                                onClick={() => handleProgressEdit(item)}
                              >
                                编辑
                              </Button>
                            ) : null}
                          </div>
                          <div>
                            <pre>{item.objective.progressRecord}</pre>
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
                  type="text"
                  icon={<PlusOutlined />}
                  onClick={addObjective}
                >
                  添加目标
                </Button>
              </div>
            ) : null}
          </Content>
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
          <Footer style={{ paddingTop: "0px", background: "#f5f6f7" }}>
            {/* 评论 */}
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
                      title={
                        <a>
                          {item.commentUserName}
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
          </Footer>
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
              label="目标"
              rules={[
                {
                  required: true,
                  message: "请输入目标!",
                },
              ]}
            >
              <MyMention></MyMention>
            </Form.Item>
            <Form.Item name="weight" label="权重">
              <Input type="number" />
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* 编辑进度弹窗 */}
      <Modal
        title="进度记录"
        visible={progressEditVisable}
        onOk={handleProgressEdtiOk}
        onCancel={handleProgressEdtiCancel}
        destroyOnClose
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
              label="内容"
              rules={[
                {
                  required: true,
                  message: "请输入目标!",
                },
              ]}
            >
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
              <DatePicker disabledDate={disabledDate} format="MM-DD" />
            </Form.Item>
            <Form.Item
              name="weight"
              label="权重"
              rules={[
                {
                  required: true,
                  message: "请输入权重!",
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="milestone"
              label="里程碑"
              rules={[
                {
                  required: true,
                  message: "请输入里程碑!",
                },
              ]}
            >
              <Input />
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
      >
        <div>
          <Form
            layout="horizontal"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 17 }}
            name="kr"
          >
            <Form.Item name="content" label="内容">
              <p>{krEdit?.content}</p>
            </Form.Item>
            <Form.Item name="deadline" label="截止时间">
              <p>{moment(krEdit?.gmtCreate).format("YYYY-MM-DD")}</p>
              {/* <DatePicker disabledDate={disabledDate} format="MM-DD" defaultValue={moment(krEdit?.gmtCreate)} disabled /> */}
            </Form.Item>
            <Form.Item name="weight" label="权重">
              <p>{krEdit?.weight}</p>
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
    </>
  );
};

function disabledDate() {}

export default CommentDetail;
