import request, { extend } from 'umi-request';
import { message } from 'antd';

const errorHandler = function (error) {
  const codeMap = {
    '021': 'An error has occurred',
    '022': 'It’s a big mistake,',
    // ....
  };
  if (error.response) {
    if (error.response.status > 400) {
      message.error(error.data.message ? error.data.message : error.data);
    }
  } else {
    // The request was made but no response was received or error occurs when setting up the request.
    // console.log(error.message);
    message.error('Network Error.');
  }

  // throw error; // If throw. The error will continue to be thrown.

  // return {some: 'data'}; If return, return the value as a return. If you don't write it is equivalent to return undefined, you can judge whether the response has a value when processing the result.
  // return {some: 'data'};
};

// 1. Unified processing
const extendRequest = extend({ errorHandler });

export const getRemoteList = async () => {
  return extendRequest('http://public-api-v1.aspirantzhang.com/users', {
    method: 'get',
  })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const editData = async ({ id, data }: { id: number; data: object }) => {
  return request(`http://public-api-v1.aspirantzhang.com/users/${id}`, {
    method: 'put',
    data,
  })
    .then(function (response) {
      message.success('Edit Success.');
    })
    .catch(function (error) {
      message.error('Edit Failed.');
    });
};

export const deleteData = async ({ id }: { id: number }) => {
  return request(`http://public-api-v1.aspirantzhang.com/users/${id}`, {
    method: 'delete',
  })
    .then(function (response) {
      message.success('Delete Success.');
    })
    .catch(function (error) {
      message.error('Delete Failed.');
    });
};

export const addData = async ({ id }: { id: number }) => {
  return request(`http://public-api-v1.aspirantzhang.com/users/`, {
    method: 'post',
  })
    .then(function (response) {
      message.success('Add Success.');
    })
    .catch(function (error) {
      message.error('Add Failed.');
    });
};
