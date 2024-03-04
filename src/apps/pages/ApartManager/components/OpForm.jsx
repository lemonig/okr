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
  Switch,
} from "antd";
import { inputTrim } from "@Utils/util";
import { _post, _get } from "../../../server/http";

function OpForm({ record, open, closeModal }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [deptList, setDeptList] = useState([]);

  useEffect(() => {
    getMetaData();
    if (record) {
      getFormData();
    }
  }, []);

  const getMetaData = async () => {
    _post(`api/dept/list`).then(({ data }) => {
      setDeptList(data);
    });
  };
  const getFormData = async () => {
    _post(`api/dept/detail`, record.id).then(({ data }) => {
      data.isDelete = !data.isDelete;
      form.setFieldsValue(data);
    });
    // let { data } = await regionGet({
    //   id: record.id,
    // });
    // setData(data);
    // if (!!record) {
    //   form.setFieldsValue(record);
    // }
  };

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    setLoading(true);
    // 编辑
    values.isDelete = !values.isDelete;

    if (record?.id) {
      values.id = record.id;
      _post(`api/dept/update`, values).then(({ success, message: msg }) => {
        if (success) {
          message.success(msg);
          closeModal(true);
        } else {
          message.error(msg);
        }
      });
    } else {
      _post(`api/dept/add`, values).then(({ success, message: msg }) => {
        if (success) {
          message.success(msg);
          closeModal(true);
        } else {
          message.error(msg);
        }
      });
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
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          autoComplete="off"
          form={form}
          colon={false}
          initialValues={{
            isDelete: true,
          }}
        >
          <Form.Item
            label="部门"
            name="name"
            rules={[
              {
                required: true,
                message: "请输入",
              },
            ]}
            getValueFromEvent={inputTrim}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="是否启用" name="isDelete" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default OpForm;
