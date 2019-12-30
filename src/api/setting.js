import request from '@/utils/request'

export function getSettings(data) {
  const { pageIndex, pageSize } = data;
  return request({
    url: '/setting/list',
    method: 'post',
    data: { pageIndex, pageSize }
  });
}

export function deleteSetting(id) {
  return request({
    url: '/setting/delete',
    method: 'post',
    data: { id }
  });
}
