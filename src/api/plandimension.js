import request from '@/utils/request'

// 计划纬度列表
export function getList(params) {
  return request({
    url: '/api/ad_units/getList',
    method: 'post',
    data: params
  })
}
// 计划纬度列表详情页
export function getDetaile(params) {
  return request({
    url: '/api/ad_units/getScreenList',
    method: 'post',
    data: params
  })
}

// 计划纬度 停止投放
export function getStatus(params) {
  return request({
    url: '/api/ad_units/batch/updateStatus',
    method: 'post',
    data: params
  })
}

// // 计划纬度 开启投放
// export function getEnabled(params) {
//   return request({
//     url: '/api/manage_campaign/enabled',
//     method: 'post',
//     data: params
//   })
// }

// 计划纬度 修改出价
export function getBudget(params) {
  return request({
    url: '/api/ad_units/change/bid',
    method: 'post',
    data: params
  })
}
// 计划纬度 修改出价 操作记录
export function getBidtable(params) {
  return request({
    url: '/api/ad_units/change/bid/history',
    method: 'post',
    data: params
  })
}
// 计划纬度 修改深度转化出价
export function getDeepbid(params) {
  return request({
    url: '/api/ad_units/change/deep_bid',
    method: 'post',
    data: params
  })
}
// 计划纬度 修改深度转化出价 操作记录
export function getDeepbidtable(params) {
  return request({
    url: '/api/ad_units/change/deep_bid/history',
    method: 'post',
    data: params
  })
}

// 计划纬度 批量操作
// export function getBatch(params) {
//   return request({
//     url: '/api/manage_campaign/batch',
//     method: 'post',
//     data: params
//   })
// }

// 计划纬度 操作人
export function getActUser(params) {
  return request({
    url: '/api/ad_units/getActUser',
    method: 'post',
    data: params
  })
}

// 计划纬度 广告组状态（外部）
export function getStatuscd(params) {
  return request({
    url: '/api/ad_units/status',
    method: 'get',
    // data: params
    params,
  })
}
