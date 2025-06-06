import request from '@/utils/request'

// 项目列表
export function getProject(params) {
    return request({
      url: '/api/project',
      method: 'post',
      data:params
    })
}

// 列表
export function getPlanList(params) {
    return request({
      url: '/api/unit_screen/list',
      method: 'post',
      data:params
    })
}

// 新增
export function addPlan(params) {
    return request({
      url: '/api/unit_screen/add',
      method: 'post',
      data:params
    })
}


// 编辑
export function editPlan(params) {
    return request({
      url: '/api/unit_screen/edit',
      method: 'post',
      data:params
    })
}

// 多条删除
export function deletePlans(params) {
    return request({
      url: '/api/unit_screen/batch/delete',
      method: 'post',
      data:params
    })
}

// 删除
export function deletePlan(params) {
    return request({
      url: '/api/unit_screen/delete',
      method: 'post',
      data:params
    })
}



// 批量新增
export function batchPlan(params) {
    return request({
      url: '/api/unit_screen/batch/add',
      method: 'post',
      data:params
    })
}