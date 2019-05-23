import request from '@/utils/request'

export function userList() {
  return request({
    url: '/user/list',
    method: 'get'
  })
}
