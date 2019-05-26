import request from '@/utils/request'

export function userList(data) {
  const { pageIndex, pageSize } = data;
  return request({
    url: '/user/list',
    method: 'post',
    data: { pageIndex, pageSize }
  })
}

export function deleteUser(userId) {
  return request({
    url: '/user/delete',
    method: 'post',
    data: { userId }
  })
}
