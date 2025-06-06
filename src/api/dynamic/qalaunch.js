import request from '@/utils/request'

// 新项目列表 区分快应用
export function getProjects(params) {
  return request({
    url: '/api/projectV2',
    method: 'get',
    params,
  })
}

// 媒体列表
export function getMedias(params) {
  return request({
    url: '/api/quickapp/link/medias',
    method: 'get',
    params,
  })
}

// 渠道号列表
export function getChannels(params) {
  return request({
    url: '/api/quickapp/link/qids',
    method: 'get',
    params,
  })
}

// 列表数据
export function getList(params) {
  return request({
    url: '/api/quickapp/link/list',
    method: 'get',
    params,
  })
}
