import request from '@/utils/request'

export function signUp(username, name, email, password, detail) {
  const data = {
    username,
    name,
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
