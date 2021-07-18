import React, { useState, FC } from 'react';
import { connect, Dispatch, Loading, UserState, SingleUserType } from 'umi';
import { Table, Tag, Space, Modal, Button, Popconfirm, message } from 'antd';
import UserModal from './components/UserModal';

interface UserListPageProps {
  users: UserState;
  dispatch: Dispatch;
  userListLoading: boolean;
}

const UserListPage: FC<UserListPageProps> = ({
  users,
  dispatch,
  userListLoading,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [nowData, setNowData] = useState(undefined);
  const handleModalVisible = (visible: boolean) => {
    setModalVisible(visible);
  };
  const handleEditData = (data) => {
    console.log(data);
    setNowData(data);
    handleModalVisible(true);
  };
  const handleSubmit = (data) => {
    let id = null;
    if (nowData) {
      id = nowData.id;
    }
    if (nowData) {
      dispatch({
        type: 'users/edit',
        payload: {
          id,
          data,
        },
      });
    } else {
      dispatch({
        type: 'users/add',
        payload: {
          data,
        },
      });
    }

    setModalVisible(false);
  };

  const handleDelete = (id: number) => {
    dispatch({
      type: 'users/delete',
      payload: {
        id,
      },
    });
  };

  const handleCancelDelete = () => {
    console.log('取消删除');
  };

  const addHandler = () => {
    handleModalVisible(true);
    setNowData(undefined);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Create Time',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text: string, record: SingleUserType) => (
        <span>
          <a
            onClick={() => {
              handleEditData(record);
            }}
          >
            Edit
          </a>
          &nbsp;&nbsp;
          <Popconfirm
            title="是否确认删除？"
            onConfirm={() => {
              handleDelete(record.id);
            }}
            onCancel={handleCancelDelete}
            okText="确认"
            cancelText="取消"
          >
            <a>Delete</a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  const props = {
    modalVisible,
    nowData,
    handleModalVisible,
    handleSubmit,
    handleDelete,
  };
  return (
    <div className="list-table">
      <Button type="primary" onClick={addHandler}>
        Add
      </Button>
      <Table
        columns={columns}
        dataSource={users}
        loading={userListLoading}
        rowKey="id"
      />
      <UserModal {...props} />
    </div>
  );
};

// const mapStateToProps = ({ users }) => {
//   return {
//     users,
//   }
// }

const mapStateToProps = ({
  users,
  loading,
}: {
  users: UserState;
  loading: Loading;
}) => {
  return {
    users,
    userListLoading: loading.models.users,
  };
};

export default connect(mapStateToProps)(UserListPage);
