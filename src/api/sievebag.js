import request from '@/utils/request'

// 实时筛包列表
export function getList(params) {
  return request({
    url: '/api/filter_rule/get_rule_list',
    method: 'post',
    data: params
  })
}
// 新增
export function getAdd(params) {
  return request({
    url: '/api/filter_rule/rule_add',
    method: 'post',
    data: params
  })
}
