import request from '@/utils/request'

// 清理计划明细列表
export function getDetailList(params) {
    return request({
      url: '/api/clean_plan/getDetailList',
      method: 'post',
      data: params
    })
}
// 列表
export function getList(params) {
    return request({
      url: '/api/clean_plan/getList',
      method: 'post',
      data: params
    })
}

// 列表
export function getAdd(params) {
    return request({
      url: '/api/clean_plan/add',
      method: 'post',
      data: params
    })
}

// 导入
export function getImport(params) {
    return request({
      url: '/api/clean_plan/import',
      method: 'post',
      data: params
    })
}

// 删除
export function getDel(params) {
    return request({
      url: '/api/clean_plan/del',
      method: 'post',
      data: params
    })
}


