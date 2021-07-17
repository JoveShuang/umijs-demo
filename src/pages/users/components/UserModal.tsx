import React, { useEffect } from 'react';
import { Form, Input, Modal, message, Button } from 'antd';

const UserModal = (props:any) => {
  const { nowData, modalVisible, handleModalVisible, handleSubmit } = props;
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(nowData);
  }, [modalVisible]);

  const subForm = () => {
    form.submit()
  }

  const closeModal = (error?:Boolean) => {
    error ? message.error('This is an error message') : handleModalVisible(false);

  }

  return (
    <Modal title="Basic Modal" visible={modalVisible} onOk={ subForm } onCancel={() => { closeModal() }} >
      <Form
        name="basic"
        form={form}
        onFinish={handleSubmit}
        onFinishFailed={() => {closeModal(true)}}
      >
        <Form.Item
          label="name"
          name="name"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="email"
          name="email"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="create_time"
          name="create_time"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="status"
          name="status"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UserModal
