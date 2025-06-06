import request from '@/utils/request'

// 代理商列表
export function getAgentList(params) {
    return request({
      url: '/api/agent/list',
      method: 'get',
      params
    })
}

// 代理商-新增
export function addAgent(params) {
    return request({
      url: '/api/agent/add',
      method: 'post',
      data: params
    })
}
  

// 代理商-编辑
export function editAgent(params) {
    return request({
      url: '/api/agent/edit',
      method: 'post',
      data: params
    })
}
  