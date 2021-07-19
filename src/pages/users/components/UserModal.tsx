import React, { useEffect, FC } from 'react';
import { Form, Input, Modal, message, Button, DatePicker, Switch } from 'antd';
import moment from 'moment';
import { SingleUserType, FormDatas } from '../data';

interface UserModalProps {
  nowData: SingleUserType | undefined;
  modalVisible: boolean;
  handleModalVisible: (visible: boolean) => void;
  handleSubmit: FormDatas;
  confirmLoading: boolean;
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const UserModal: FC<UserModalProps> = (props) => {
  const {
    nowData,
    modalVisible,
    handleModalVisible,
    handleSubmit,
    confirmLoading,
  } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (nowData) {
      form.setFieldsValue({
        ...nowData,
        create_time: moment(nowData.create_time),
        status: Boolean(nowData.status),
      });
    } else {
      form.resetFields();
    }
  }, [modalVisible]);

  const subForm = () => {
    form.submit();
  };

  const closeModal = (error?: Boolean) => {
    error
      ? message.error('This is an error message')
      : handleModalVisible(false);
  };

  return (
    <Modal
      forceRender
      title={nowData ? `Edit ID:${nowData.id}` : 'Add'}
      visible={modalVisible}
      confirmLoading={confirmLoading}
      onOk={subForm}
      onCancel={() => {
        closeModal();
      }}
    >
      <Form
        name="basic"
        {...layout}
        form={form}
        onFinish={handleSubmit}
        onFinishFailed={() => {
          closeModal(true);
        }}
        initialValues={{
          status: 1,
        }}
      >
        <Form.Item
          label="name"
          name="name"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="email" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="create_time" name="create_time">
          <DatePicker showTime />
        </Form.Item>
        <Form.Item label="status" name="status" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
