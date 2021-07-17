import { Reducer, Effect, Subscription } from 'umi'
import { getRemoteList, editListData } from './services'

interface UserModelType {
  namespace: 'users';
  state: [];
  reducers: {
    getList: Reducer
  };
  effects: {
    getRemote: Effect
  };
  subscriptions: {
    setup: Subscription;
  }
}

const UserModel: UserModelType = {
  namespace: 'users',
  state: [],
  reducers: {
    getList(state, { type, payload }) {
      return payload;
    }
  },
  effects: {
    *getRemote({ payload }, { put, call }) {
      const data = yield call(getRemoteList)
      yield put({
        type: 'getList',
        payload: data

      })
    },
    *edit({ payload: { id, data } }, { put, call }) {
      yield call(editListData, { id, data })

    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/users') {
          dispatch({
            type: 'getRemote'
          })
        }
      })
    }
  }
}
export default UserModel;
