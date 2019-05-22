import request from '@/utils/request'

export function signUp(username, email, password, detail) {
  const data = {
    username,
    email,
    password,
    detail
  }
  return request({
    url: '/user/new',
    method: 'post',
    data
  })
}
