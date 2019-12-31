import request from '@/utils/request'

export function createSetting(data) {
  const {name, value, type} = data;
  return request({
    url: '/setting/new',
    method: 'post',
    data: { name, value, type }
  });

}

export function getSettings(data) {
  const { pageIndex, pageSize } = data;
  return request({
    url: '/setting/list',
    method: 'post',
    data: { pageIndex, pageSize }
  });
}

export function updateSetting(data) {
  const {id, name, value, type} = data;
  return request({
    url: '/setting/update',
    method: 'post',
    data: { id, name, value, type }
  });
}

export function deleteSetting(id) {
  return request({
    url: '/setting/delete',
    method: 'post',
    data: { id }
  });
}
