import React, { useEffect, FC } from 'react';
import { Form, Input, Modal, message, Button } from 'antd';
import { SingleUserType, FormDatas } from '../data';

interface UserModalProps {
  nowData: SingleUserType | undefined;
  modalVisible: boolean;
  handleModalVisible: () => void;
  handleSubmit: FormDatas;
}

const UserModal: FC<UserModalProps> = (props) => {
  const { nowData, modalVisible, handleModalVisible, handleSubmit } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    if (nowData) {
      form.setFieldsValue(nowData);
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
      title="Basic Modal"
      visible={modalVisible}
      onOk={subForm}
      onCancel={() => {
        closeModal();
      }}
    >
      <Form
        name="basic"
        form={form}
        onFinish={handleSubmit}
        onFinishFailed={() => {
          closeModal(true);
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
          <Input />
        </Form.Item>
        <Form.Item label="status" name="status">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
