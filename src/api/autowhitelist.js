import request from '@/utils/request'

// 离线白名单
export function getListOffline(params) {
    return request({
      url: '/api/auto_campaign_controls/list',
      method: 'post',
      data:params
    })
}

// 离线白名单新增
export function addOffline(params) {
    return request({
      url: '/api/auto_campaign_controls/add',
      method: 'post',
      data:params
    })
}


// 离线白名单删除
export function deleteOffline(params) {
    return request({
      url: '/api/auto_campaign_controls/delete',
      method: 'post',
      data:params
    })
}

// 实时白名单
export function getListRealtime(params) {
    return request({
      url: '/api/real_auto_campaign_controls/list',
      method: 'post',
      data:params
    })
}

// 实时白名单新增
export function addRealtime(params) {
    return request({
      url: '/api/real_auto_campaign_controls/add',
      method: 'post',
      data:params
    })
}

// 实时白名单删除
export function deleteRealtime(params) {
    return request({
      url: '/api/real_auto_campaign_controls/delete',
      method: 'post',
      data:params
    })
}

// 空跑白名单
export function getListAirrun(params) {
    return request({
      url: '/api/auto_empty_campaign_controls/list',
      method: 'post',
      data:params
    })
}

// 空跑白名单新增
export function addAirrun(params) {
    return request({
      url: '/api/auto_empty_campaign_controls/add',
      method: 'post',
      data:params
    })
}


// 空跑白名单删除
export function deleteAirrun(params) {
    return request({
      url: '/api/auto_empty_campaign_controls/delete',
      method: 'post',
      data:params
    })
}