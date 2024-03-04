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
} from "antd";
import IconFont from "@Components/IconFont";
import { updateWightRate, getWeightRate } from "@Api/company_okr.js";
import { inputTrim } from "@Utils/util";
import MyMention from "../../home/MyMention";

function OpForm({ record, open, closeModal, year }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMetaData();
  }, []);

  const getMetaData = async () => {
    let { data } = await getWeightRate({
      dataYear: year,
    });
    form.setFieldsValue(data);
  };

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    setLoading(true);
    // 编辑
    values.dataYear = year;
    let { success, message: msg } = await updateWightRate(values);
    if (success) {
      message.success(msg);
      closeModal(true);
    } else {
      message.error(msg);
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
          layout="vertical"
          name="form_in_modal_c"
          initialValues={{}}
        >
          <Form.Item
            name="companyScoreRate"
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
      </Modal>
    </>
  );
}

export default OpForm;
