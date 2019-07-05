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
    url: '/vm/detail',
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

export function getAllOptions() {
  return request({
    url: '/vmOptionTemplate/all',
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

export function OSList(data) {
  return request({
    url: '/os/list',
    method: 'post',
    data
  })
}

export function OSEnabled() {
  return request({
    url: '/os/enabled',
    method: 'get'
  })
}

export function OSDetail(id) {
  return request({
    url: '/os/detail',
    method: 'post',
    data: {id}
  })
}

export function deleteOS(id) {
  return request({
    url: '/os/delete',
    method: 'post',
    data: { id }
  })
}


export function saveOS(data) {
  return request({
    url: '/os/new',
    method: 'post',
    data
  })
}

export function updateOS(data) {
  return request({
    url: '/os/update',
    method: 'post',
    data
  })
}
