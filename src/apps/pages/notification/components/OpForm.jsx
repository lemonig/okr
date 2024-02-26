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
  Upload,
} from "antd";
import { inputTrim } from "@Utils/util";
import { _post, _get } from "../../../server/http";
import { fileUpload } from "@Api/public.js";
import { UploadOutlined } from "@ant-design/icons";

function OpForm({ open, closeModal }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [deptList, setDeptList] = useState([]);
  // const [fileList, setFileList] = useState([]);
  const [fileUrl, setFileUrl] = useState("");

  const handleOk = async () => {
    await form.validateFields();
    const values = form.getFieldsValue();
    values.attachment = fileUrl;
    setLoading(true);
    // 编辑

    _post(`api/announcement/add`, values).then(({ success, message: msg }) => {
      if (success) {
        message.success(msg);
        closeModal(true);
      } else {
        message.error(msg);
      }
    });
    // 添加
    setLoading(false);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const customRequest = async ({ file, onSuccess, onError, data }) => {
    const formData = new FormData();
    formData.append("file", file);
    let headers = {
      "Content-Type":
        "multipart/form-data; boundary=----WebKitFormBoundaryGMA3AgU3lRxaQE0K",
    };
    const res = await fileUpload(formData, headers);
    console.log(res);
    if (res.success) {
      setFileUrl(res.data);
      onSuccess();
    }
    // let attachment = form.getFieldValue("attachment");

    // attachment.splice(attachment.length - 1, 1, res.data);
    // form.setFieldsValue({
    //   attachment: attachment,
    // });
  };

  return (
    <>
      <Modal
        title="发布公告"
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
            label="标题"
            name="title"
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
            name="attachment"
            valuePropName="fileList"
            label="附件"
            getValueFromEvent={normFile}
            extra="最多上传一个附件"
          >
            <Upload
              name="file"
              customRequest={customRequest}
              listType="text"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}> 上传附件</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default OpForm;
