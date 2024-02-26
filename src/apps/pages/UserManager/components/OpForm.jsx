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
import { inputTrim } from "@Utils/util";
import { _post, _get } from "../../../server/http";

function OpForm({ record, open, closeModal }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [deptList, setDeptList] = useState([]);

  useEffect(() => {
    getMetaData();
    getFormData();
  }, []);

  const getMetaData = async () => {
    _post(`api/dept/list`).then(({ data }) => {
      setDeptList(data);
    });
  };
  const getFormData = async () => {
    _post(`api/user/detail`, record.id).then(({ data }) => {
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

    if (record?.id) {
      values.id = record.id;
      _post(`api/user/update`, values).then(({ success, message: msg }) => {
        if (success) {
          message.success(msg);
          closeModal(true);
        } else {
          message.error(msg);
        }
      });
    } else {
      _post(`api/user/add`, values).then(({ success, message: msg }) => {
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
        >
          <Form.Item
            label="姓名"
            name="account"
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
          <Form.Item
            label="企业微信工号"
            name="wxUserId"
            rules={[
              {
                required: true,
                message: "请输入",
              },
            ]}
          >
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item
            label="所属部门"
            name="deptIdList"
            rules={[
              {
                required: true,
                message: "请选择",
              },
            ]}
          >
            <Select
              options={deptList}
              mode="multiple"
              allowClear
              fieldNames={{
                label: "name",
                value: "id",
              }}
            ></Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default OpForm;
