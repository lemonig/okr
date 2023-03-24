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
  Table,
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
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { _post, _get, _download } from "../../../server/http";
import moment from "moment";
import MyMention from "../MyMention";

const { Header, Sider, Content } = Layout;
const { TextArea } = Input;
const { confirm } = Modal;

function PartThird({ tree, year }) {
  const [objective, setObjective] = useState(null); //objective
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operateId, setOperateId] = useState(null); //正在操作id
  const [krEdit, setKrEdit] = useState(null); //正在操作的kr
  const [krAddEdit, setKrAddEdit] = useState("添加"); //编辑
  const [scoreVis, setScoreVis] = useState(false); // 打分弹窗
  const [scoreForm] = Form.useForm(); //打分表单
  const [resultScore, setResultScore] = useState({}); //打分数据
  const [isMe, setIsMe] = useState(true);
  // KR
  const [krModalVisible, setKrModalVisible] = useState(false);
  const [krModalLookVisible, setKrModalLookVisible] = useState(false); //查看kr
  useEffect(() => {
    getPageData();
  }, [tree.id]);

  const columns = [
    {
      title: "关键能力/经验",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "实施计划与衡量标准",
      dataIndex: "plan",
      key: "plan",
    },
    {
      title: "面临挑战",
      dataIndex: "challenge",
      key: "challenge",
    },
    {
      title: "所需支持人（导师、上级等)",
      dataIndex: "sponsor",
      key: "sponsor",
    },
    {
      title: "计划完成时间",
      dataIndex: "deadline",
      key: "deadline",
      render: (value) => moment(value).format("YYYY-MM-DD"),
    },
    {
      title: "",
      key: "operation",
      width: 180,
      fixed: "right",
      render: (_, record) => (
        <Space>
          {isMe ? (
            <>
              <a onClick={() => handleEditKrScore(record)}>打分</a>
              <a onClick={() => handleEdit(record)}>编辑</a>
              <CloseOutlined onClick={() => handleDel(record)} />
            </>
          ) : null}
        </Space>
      ),
    },
  ];
  // 编辑
  const handleEdit = (record) => {
    setIsModalOpen(true);
    setOperateId(record.id);
    _post(`/api/skill/${record.id}`).then((res) => {
      form.setFieldsValue({
        ...res.data,
        deadline: moment(res.data.deadline),
      });
    });
  };
  const handleAdd = () => {
    setIsModalOpen(true);
    setOperateId(null);
    form.setFieldsValue({});
  };
  const handleDel = (record) => {
    Modal.confirm({
      title: "确定删除？",
      icon: <ExclamationCircleOutlined />,
      content: "删除后无法恢复",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        let { success, message: msg } = await _post(
          `/api/skill/${record.id}/delete`
        );
        if (success) {
          message.success("删除成功");
          getPageData();
        } else {
          message.error("删除失败");
        }
      },
    });
  };
  // 获取页面数据
  const getPageData = () => {
    _post(`api/skill/list/${tree.id}/dept?year=${year}`).then((res) => {
      setObjective(res.data);
      setIsMe(res.additional_data);
    });
  };

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    setLoading(true);
    // 编辑
    values.deptId = tree.id;
    values.dataYear = year;
    if (values.deadline) {
      values.deadline = moment(values.deadline).format("YYYY-MM-DD");
    }
    if (operateId) {
      values.id = operateId;
      let { success, message: msg } = await _post(`/api/skill/update`, values);
      if (success) {
        message.success("提交成功");
        setIsModalOpen(false);
      } else {
        message.error(msg);
      }
      setOperateId(null);
    } else {
      let { success, message: msg } = await _post(`/api/skill/add`, values);
      if (success) {
        message.success("提交成功");
        setIsModalOpen(false);
      } else {
        message.error(msg);
      }
    }
    // 添加
    getPageData();
    setLoading(false);
    form.resetFields();
  };
  // 弹窗取消
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  const getDetail = () => {};

  // 打分
  const handleEditKrScore = (record) => {
    _post(`/api/skill/${record.id}`).then((res) => {
      scoreForm.setFieldsValue({
        ...res.data,
      });
    });
    setOperateId(record.id);
    setScoreVis(true);
  };

  const handleScoreOK = () => {
    let params = scoreForm.getFieldsValue();
    params.id = operateId;
    scoreForm.validateFields().then((value) => {
      _post(`/api/skill/score`, params).then((res) => {
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
      <Content style={{ marginBottom: "50px" }}>
        <Table
          dataSource={objective}
          columns={columns}
          pagination={false}
          scroll={{
            y: 500,
          }}
        />

        {isMe ? (
          <div className="add-obj-btn" style={{ marginTop: "30px" }}>
            <Button type="link" icon={<PlusOutlined />} onClick={handleAdd}>
              添加
            </Button>
          </div>
        ) : null}
      </Content>

      {/* 弹出表单 */}
      {isModalOpen ? (
        <Modal
          title={operateId ? "编辑" : "新建"}
          visible={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          maskClosable={false}
          destroyOnClose
          confirmLoading={loading}
        >
          <Form
            name="basic"
            // labelCol={{ span: 8 }}
            // wrapperCol={{ span: 16 }}
            autoComplete="off"
            form={form}
            layout="vertical"
          >
            <Form.Item label="关键能力/经验" name="content">
              <Input.TextArea placeholder="请输入" />
            </Form.Item>

            <Form.Item label="实施计划与衡量标准" name="plan">
              <Input.TextArea placeholder="请输入" />
            </Form.Item>
            <Form.Item label="面临挑战" name="challenge">
              <Input.TextArea placeholder="请输入" />
            </Form.Item>
            <Form.Item label="所需支持人（导师、上级等" name="sponsor">
              <Input.TextArea placeholder="请输入" />
            </Form.Item>
            <Form.Item label="计划完成时间" name="deadline">
              <DatePicker />
            </Form.Item>
          </Form>
        </Modal>
      ) : null}

      {/* 打分弹框 */}
      {scoreVis ? (
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
                name="description"
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
      ) : null}

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
    </>
  );
}

export default PartThird;
