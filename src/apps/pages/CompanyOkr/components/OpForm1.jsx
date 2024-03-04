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
  PageHeader,
  DatePicker,
  Checkbox,
  InputNumber,
  Radio,
} from "antd";
import IconFont from "@Components/IconFont";
import { addSubgoal, updateSubgoal, getSubgoal } from "@Api/company_subgoal.js";
import { inputTrim } from "@Utils/util";
import MyMention from "../../home/MyMention";
import moment from "moment";
const { TextArea } = Input;
function OpForm({ record, open, closeModal, precord }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!!record) {
      getMetaData();
    }
  }, []);

  const getMetaData = async () => {
    let { data } = await getSubgoal({
      id: record.id,
    });
    console.log(data);
    data.deadline = moment(data.deadline);
    form.setFieldsValue(data);
  };

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    setLoading(true);
    console.log(precord);
    if (precord) {
      values.objectiveId = precord.id;
    }
    values.deadline = moment(values.deadline).format("yyyy-MM-DD");
    // 编辑
    if (record?.id) {
      values.id = record.id;
      let { success, message: msg } = await updateSubgoal(values);
      if (success) {
        message.success(msg);
        closeModal(true);
      } else {
        message.error(msg);
      }
    } else {
      let { success, message: msg } = await addSubgoal(values);
      if (success) {
        message.success(msg);
        closeModal(true);
      } else {
        message.error(msg);
      }
    }
    // 添加
    setLoading(false);
  };

  return (
    <>
      <Modal
        title={record ? "编辑" : "新建"}
        visible={open}
        onOk={handleOk}
        onCancel={() => closeModal(false)}
        maskClosable={false}
        confirmLoading={loading}
        destroyOnClose
      >
        <Form
          form={form}
          preserve={false}
          layout="horizontal"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 17 }}
          name="kr_c"
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
            <DatePicker format="YYYY-MM-DD" />
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
      </Modal>
    </>
  );
}

export default OpForm;
