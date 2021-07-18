import { Reducer, Effect, Subscription } from 'umi';
import { message } from 'antd';
import { getRemoteList, editData, deleteData, addData } from './services';
import { SingleUserType } from './data';

export interface UserState {
  data: SingleUserType[];
  meta: {
    total: number;
    per_page: number;
    page: number;
  };
}

interface UserModelType {
  namespace: 'users';
  state: SingleUserType;
  reducers: {
    getList: Reducer<UserState>;
  };
  effects: {
    getRemote: Effect;
    edit: Effect;
    delete: Effect;
    add: Effect;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const UserModel: UserModelType = {
  namespace: 'users',
  state: [
    {
      data: [],
      meta: {
        total: 0,
        per_page: 5,
        page: 1,
      },
    },
  ],
  reducers: {
    getList(state, { type, payload }) {
      return payload;
    },
  },
  effects: {
    *getRemote({ payload }, { put, call }) {
      const data = yield call(getRemoteList);
      yield put({
        type: 'getList',
        payload: data,
      });
    },
    *edit({ payload: { id, data } }, { put, call }) {
      const datas = yield call(editData, { id, data });
      if (datas) {
        message.success('Edit success.');
        yield put({
          type: 'getRemote',
        });
      } else {
        message.error('Edit Failed.');
      }
    },
    *delete({ payload: { id } }, { put, call }) {
      const datas = yield call(deleteData, { id });
      if (datas) {
        message.success('Delete success.');
        yield put({
          type: 'getRemote',
        });
      } else {
        message.error('Delete Failed.');
      }
    },
    *add({ payload: { data } }, { put, call }) {
      const datas = yield call(addData, { data });
      console.log(datas);
      if (datas) {
        message.success('Add success.');
        yield put({
          type: 'getRemote',
        });
      } else {
        message.error('Add Failed.');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/users') {
          dispatch({
            type: 'getRemote',
          });
        }
      });
    },
  },
};
export default UserModel;
