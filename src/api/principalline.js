import request from '@/utils/request'

// 主线包管理 -- 列表页
export function getList(params) {
  return request({
    url: '/api/channelPackage/main/list',
    method: 'post',
    data:params
  })
}
