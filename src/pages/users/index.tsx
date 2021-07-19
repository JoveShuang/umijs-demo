import React, { useState, useRef, FC } from 'react';
import { connect, Dispatch, Loading, UserState } from 'umi';
import {
  Table,
  Tag,
  Space,
  Modal,
  Button,
  Popconfirm,
  message,
  Pagination,
} from 'antd';
import ProTable, {
  ProColumns,
  ProColumnsValueType,
  TableDropdown,
} from '@ant-design/pro-table';
import UserModal from './components/UserModal';
import { SingleUserType, FormDatas } from './data';
import { getRemoteList, addData, editData } from './services';

interface UserListPageProps {
  users: UserState;
  dispatch: Dispatch;
  userListLoading: boolean;
}

interface ActionType {
  reload: (resetPageIndex?: boolean) => void;
  reloadAndRest: () => void;
  reset: () => void;
  clearSelected?: () => void;
  startEditable: (rowKey: `id`) => boolean;
  cancelEditable: (rowKey: `id`) => boolean;
}

const UserListPage: FC<UserListPageProps> = ({
  users,
  dispatch,
  userListLoading,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [nowData, setNowData] = useState<SingleUserType | undefined>(undefined);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const ref = useRef<ActionType>();
  const handleModalVisible = (visible: boolean) => {
    setModalVisible(visible);
  };
  const handleEditData = (data: SingleUserType) => {
    console.log(data);
    setNowData(data);
    handleModalVisible(true);
  };
  const handleSubmit = async (data: FormDatas) => {
    setConfirmLoading(true);
    let id = null;
    if (nowData) {
      id = nowData.id;
    }

    const result = id ? await editData({ id, data }) : await addData({ data });
    const text = id ? 'Edit' : 'Add';
    setConfirmLoading(false);
    if (result) {
      setModalVisible(false);
      message.success(`${text} Success.`);
      resetHandeler();
    } else {
      message.error(`${text} Failed.`);
    }
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

  const resetHandeler = () => {
    dispatch({
      type: 'users/getRemote',
      payload: {
        page: users.meta.page,
        per_page: users.meta.per_page,
      },
    });
  };

  // const requestHandler = async ({ pageSize, current }: {pageSize: number, current: number}) => {
  //   console.log(pageSize, current)
  //   const users = await getRemoteList({
  //     page: current,
  //     per_page: pageSize
  //   })
  //   if (users) {
  //     return {
  //       data: users.data,
  //       success: true,
  //       total: users.meta.total
  //     }
  //   } else {
  //     return {
  //       data: [],
  //     }
  //   }
  // }

  const paginationHandler = (page: number, pageSize?: number) => {
    dispatch({
      type: 'users/getRemote',
      payload: {
        page,
        per_page: pageSize ? pageSize : users.meta.per_page,
      },
    });
  };

  const pageSizeHandler = (current: number, size: number) => {
    console.log(current, size);
    dispatch({
      type: 'users/getRemote',
      payload: {
        page: current,
        per_page: size,
      },
    });
  };

  const columns: ProColumns<SingleUserType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'digit',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      valueType: 'text',
      key: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: 'Create Time',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      key: 'create_time',
    },
    {
      title: 'Action',
      valueType: 'option',
      key: 'action',
      render: (text: string, record: SingleUserType) => [
        <a
          onClick={() => {
            handleEditData(record);
          }}
        >
          Edit
        </a>,
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
        </Popconfirm>,
      ],
    },
  ];

  const props = {
    modalVisible,
    nowData,
    confirmLoading,
    handleModalVisible,
    handleSubmit,
    handleDelete,
  };
  return (
    <div className="list-table">
      <ProTable
        actionRef={ref}
        columns={columns}
        dataSource={users.data}
        loading={userListLoading}
        rowKey="id"
        search={false}
        pagination={false}
        options={{
          density: true,
          fullScreen: true,
          reload: () => {
            resetHandeler();
          },
          setting: true,
        }}
        headerTitle="User List"
        toolBarRender={() => [
          <Button type="primary" onClick={addHandler}>
            Add
          </Button>,
          <Button onClick={resetHandeler}>Reload</Button>,
        ]}
      />
      <Pagination
        className="list-page"
        total={users.meta.total}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `Total ${total} items`}
        onChange={paginationHandler}
        onShowSizeChange={pageSizeHandler}
        current={users.meta.page}
        pageSize={users.meta.per_page}
      />
      <UserModal {...props} />
    </div>
  );
};

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
