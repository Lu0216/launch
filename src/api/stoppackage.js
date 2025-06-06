import request from '@/utils/request'

// 搜索结果列表
export function searchList(params) {
    return request({
      url: '/api/package_launch_config/search',
      method: 'post',
      data:params
    })
}

// 批量操作
export function batch(params) {
    return request({
      url: '/api/package_launch_config/batch',
      method: 'post',
      data: params
    })
}
  

// 单个渠道号开启投放
export function enable(params) {
    return request({
      url: `/api/package_launch_config/enable/${params.id}`,
      method: 'get',
      params
    })
}

// 单个渠道号关闭投放
export function disabled(params) {
    return request({
      url: `/api/package_launch_config/disabled/${params.id}`,
      method: 'get',
      params
    })
}

// 批次明细
export function groupList(params) {
    return request({
      url: '/api/package_launch_config/batch/list',
      method: 'post',
      data:params
    })
}

// 明细列表
export function detailList(params) {
    return request({
      url: '/api/package_launch_config/detail/list',
      method: 'post',
      data:params
    })
}