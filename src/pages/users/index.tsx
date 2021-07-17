import React, { useState } from 'react';
import { connect } from 'umi';
import { Table, Tag, Space, Modal, Button } from 'antd';
import UserModal from './components/UserModal';

const index = ({ users, dispatch }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [nowData, setNowData] = useState([])
  const handleModalVisible = visible => {
    setModalVisible(visible)
  }
  const handleListData = data => {
    console.log(data)
    setNowData(data)
    handleModalVisible(true)
  }
  const handleSubmit = data => {
    const { id } = nowData
    dispatch({
      type: 'users/edit',
      payload: {
        id: id,
        data
      }
    })

    setModalVisible(false)
  }
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: 'Create Time',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={() => {handleListData(record)}}>Edit</a>
          &nbsp;&nbsp;
          <a>Delete</a>
        </span>
      ),
    },
  ];

  const props = {
    modalVisible,
    nowData,
    handleModalVisible,
    handleSubmit
  }
  return (
    <div className="list-table">
      <Table columns={columns} dataSource={users} rowKey='id'/>
      <UserModal {...props}/>
    </div>
  );
}

const mapStateToProps = ({ users }) => {
  return {
    users,
  }
}

export default connect(mapStateToProps)(index)
