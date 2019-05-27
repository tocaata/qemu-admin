import request from '@/utils/request'


export function vmList(data) {
  return request({
    url: '/vm/list',
    method: 'post',
    data
  })
}

export function saveVmOption(data) {
  return request({
    url: '/vm/newOption',
    method: 'post',
    data
  })
}


export function listOption(data) {
  return request({
    url: '/vm/listOption',
    method: 'post',
    data
  })
}

