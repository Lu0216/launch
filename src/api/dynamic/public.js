import request from '@/utils/request'

// 媒体列表
export function getMediaList(params) {
  return request({
    url: '/api/medias',
    method: 'post',
    data:params
  })
}

// 媒体主账号列表
export function getMediaMasterList(params) {
    return request({
      url: '/api/media/account',
      method: 'post',
      data:params
    })
  }

// 媒体子账号列表
export function getMediaChildList(params) {
    return request({
      url: '/api/media/account/child?account_id='+params.account_id,
      method: 'post',
      data:params
    })
  }


// 媒体主账号，子账号列表
export function getMediaTagList(params) {
  return request({
    url: '/api/media/accountByTagId',
    method: 'post',
    data:params
  })
}
// 项目列表
export function getProjectList(params) {
    return request({
      url: '/api/project',
      method: 'post',
      data:params
    })
  }

// 代理列表
export function getAgent(params) {
    return request({
      url: '/api/agent/listAll',
      method: 'post',
      data:params
    })
  }

// 通过项目标签获取广点通媒体id
export function getAppid(params) {
  return request({
    url: '/api/channelPackage/getGdtMediaAppId',
    method: 'post',
    data:params
  })
}