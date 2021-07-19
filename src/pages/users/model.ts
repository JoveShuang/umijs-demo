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
  state: UserState;
  reducers: {
    getList: Reducer<UserState>;
  };
  effects: {
    getRemote: Effect;
    delete: Effect;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const UserModel: UserModelType = {
  namespace: 'users',
  state: {
    data: [],
    meta: {
      total: 0,
      per_page: 5,
      page: 1,
    },
  },

  reducers: {
    getList(state, { type, payload }) {
      console.log('reducers');
      return payload;
    },
  },
  effects: {
    *getRemote({ payload: { page, per_page } }, { put, call }) {
      const data = yield call(getRemoteList, { page, per_page });
      yield put({
        type: 'getList',
        payload: data,
      });
    },
    *delete({ payload: { id } }, { put, call, select }) {
      const datas = yield call(deleteData, { id });
      if (datas) {
        message.success('Delete success.');
        const { page, per_page } = yield select(
          (state: any) => state.users.meta,
        );
        yield put({
          type: 'getRemote',
          payload: {
            page,
            per_page,
          },
        });
      } else {
        message.error('Delete Failed.');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        console.log('subscriptions');
        if (pathname === '/users') {
          dispatch({
            type: 'getRemote',
            payload: {
              page: 1,
              per_page: 5,
            },
          });
        }
      });
    },
  },
};
export default UserModel;
