import request from '@/utils/request'

// 列表
export function getAgentList(params) {
    return request({
      url: '/api/backhaul/agent/list',
      method: 'post',
      data:params
    })
}

// 新增
export function addAgent(params) {
    return request({
      url: '/api/backhaul/agent/add',
      method: 'post',
      data: params
    })
}
  

// 编辑
export function editAgent(params) {
    return request({
      url: '/api/backhaul/agent/edit',
      method: 'post',
      data: params
    })
}