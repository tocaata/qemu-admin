import request from '@/utils/request'

export function signUp(username, email, password) {
  const data = {
    username,
    email,
    password
  }
  return request({
    url: '/user/new',
    method: 'post',
    data
  })
}
