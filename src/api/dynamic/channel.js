import request from '@/utils/request'

// 用户列表
export function getChannelList(params) {
    return request({
      url: '/api/channelPackage/list',
      method: 'post',
      data:params
    })
}

// 新增渠道包
export function addChannel(params) {
    return request({
      url: '/api/channelPackage/add',
      method: 'post',
      data: params
    })
}

// 批量新增渠道包
export function importChannel(params) {
    return request({
      url: '/api/channelPackage/import',
      method: 'post',
      data: params
    })
}

// 编辑渠道包
export function editChannel(params) {
  return request({
    url: '/api/channelPackage/edit',
    method: 'post',
    data: params
  })
}

// 编辑渠道包
export function batchEditChannel(params) {
  return request({
    url: '/api/channelPackage/batch/edit',
    method: 'post',
    data: params
  })
}

// 获取渠道标签
export function getTagsList(params) {
  return request({
    url: '/api/channelPackage/tags',
    method: 'get',
    data:params
  })
}

// 重新打包
export function getReset(params) {
  return request({
    url: '/api/channelPackage/reset',
    method: 'post',
    data:params
  })
}