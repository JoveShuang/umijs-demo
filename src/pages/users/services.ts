import request from 'umi-request';

export const getRemoteList = async () => {
  return request('http://public-api-v1.aspirantzhang.com/users', {
    method: 'get',
  })
  .then(function(response) {
    const data = response.data.map(item => {
      return item
    })
    console.log(data)
    return data
  })
  .catch(function(error) {
    console.log(error);
  });
}

export const editListData = async ({ id, data }:{ id:number, data:object }) => {
  return request(`http://public-api-v1.aspirantzhang.com/users/${id}`, {
    method: 'put',
    data
  })
  .then(function(response) {
    return response
  })
  .catch(function(error) {
    console.log(error);
  });
}
