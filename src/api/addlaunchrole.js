import request from '@/utils/request'

/**
 * 
 * 关键行为规则管理
 */

// 关键行为规则管理 -- 下拉框-- 关键行为类型
export function getRulesType(params) {
  return request({
    url: '/api/custom_rule/types',
    method: 'get',
    params
  })
}

// 关键行为规则管理 -- 列表
export function getList(params) {
    return request({
      url: '/api/custom_rule/list',
      method: 'post',
      data:params
    })
}

// 关键行为规则管理 -- 新增
export function getAdd(params) {
    return request({
      url: '/api/custom_rule/saveV2',
      method: 'post',
      data:params
    })
}

// 关键行为规则管理 -- 编辑
export function getEdit(params) {
    return request({
      url: `/api/custom_rule/edit`,
      method: 'post',
      data:params
    })
}

// 关键行为规则管理 -- 批量编辑
export function getBatchEdit(params) {
  return request({
    url: '/api/custom_rule/batch_edit',
    method: 'post',
    data: params
  })
}


