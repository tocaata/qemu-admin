import request from '@/utils/request'


export function vmList(data) {
  return request({
    url: '/vm/list',
    method: 'post',
    data
  })
}

export function vmDetail(id) {
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

export function getEnabledOptions() {
  return request({
    url: '/vmOptionTemplate/all',
    method: 'get',
    params: { enabled: true }
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

export function cloneVm(id) {
  return request({
    url: '/vm/clone',
    method: 'post',
    data: {id}
  })
}

export function deleteVm(id) {
  return request({
    url: '/vm/delete',
    method: 'post',
    data: { id }
  })
}

export function editVm(data) {
  return request({
    url: '/vm/update',
    method: 'post',
    data
  })
}

export function deleteConfig(machineId, configId) {
  return request({
    url: '/vm/deleteConfig',
    method: 'post',
    data: {
      machineId,
      configId
    }
  });
}

export function editConfig (machineId, configId, configParams ) {
  return request({
    url: '/vm/editConfig',
    method: 'post',
    data: {
      machineId,
      configId,
      configParams
    }
  });
}


export function addConfig (machineId, templateId) {
  return request({
    url: '/vm/addConfig',
    method: 'post',
    data: {
      machineId,
      templateId
    }
  });
}

export function getCmd(id) {
  return request({
    url: '/vm/getCmd',
    method: 'post',
    data: { id }
  })
}

export function exec(id, cmd, args) {
  return request({
    url: '/vm/exec',
    method: 'post',
    data: { id, cmd, args }
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
