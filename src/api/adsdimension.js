import request from '@/utils/request'

// 广告组纬度列表
export function getList(params) {
  return request({
    url: '/api/manage_campaign/search',
    method: 'post',
    data: params
  })
}
// 获取广告组纬度列表详情页
export function getDetaile(params) {
  return request({
    url: '/api/campaign_operation_log/search',
    method: 'post',
    data: params
  })
}

// 广告组纬度 停止投放
export function getDisabled(params) {
  return request({
    url: '/api/manage_campaign/disabled',
    method: 'post',
    data: params
  })
}

// 广告组纬度 开启投放
export function getEnabled(params) {
  return request({
    url: '/api/manage_campaign/enabled',
    method: 'post',
    data: params
  })
}

// 广告组纬度 修改预算
export function getBudget(params) {
  return request({
    url: '/api/manage_campaign/update_budget',
    method: 'post',
    data: params
  })
}

// 广告组纬度 批量操作
export function getBatch(params) {
  return request({
    url: '/api/manage_campaign/batch',
    method: 'post',
    data: params
  })
}


// 广告组纬度 操作人
export function getOperator(params) {
  return request({
    url: '/api/campaign_operation_log/operator_list',
    method: 'post',
    data: params
  })
}



// 广告组纬度 广告组状态（外部）
export function getStatuscd(params) {
  return request({
    url: '/api/manage_campaign/status',
    method: 'get',
    // data: params
    params,
  })
}
