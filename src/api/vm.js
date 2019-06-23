import request from '@/utils/request'


export function vmList(data) {
  return request({
    url: '/vm/list',
    method: 'post',
    data
  })
}

export function vmShow(id) {
  return request({
    url: '/vm/show',
    method: 'get',
    params: { id }
  })
}

export function saveVmOption(data) {
  return request({
    url: '/vmOptionTemplate/new',
    method: 'post',
    data
  })
}


export function listOption(data) {
  return request({
    url: '/vmOptionTemplate/list',
    method: 'post',
    data
  })
}

export function getPrimaryOptions() {
  return request({
    url: '/vmOptionTemplate/primary',
    method: 'get'
  })
}

export function deleteArg(id) {
  return request({
    url: '/vmOptionTemplate/delete',
    method: 'post',
    data: { id }
  })
}

export function editArg(data) {
  return request({
    url: '/vmOptionTemplate/update',
    method: 'post',
    data
  })
}

export function createVm(data) {
  return request({
    url: '/vm/create',
    method: 'post',
    data
  })
}

export function deleteVm(id) {
  return request({
    url: '/vm/delete',
    method: 'post',
    data: { id }
  })
}

export function getCmd(id) {
  return request({
    url: '/vm/getCmd',
    method: 'post',
    data: { id }
  })
}

export function run(id) {
  return request({
    url: '/vm/run',
    method: 'post',
    data: { id }
  })
}
