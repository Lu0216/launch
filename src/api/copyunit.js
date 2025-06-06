import request from '@/utils/request'

// 列表
export function getList(params) {
    return request({
      url: '/api/copy_unit/control/list',
      method: 'post',
      data:params
    })
}
//添加
export function add(params) {
    return request({
      url: '/api/copy_unit/control/add',
      method: 'post',
      data:params
    })
}

//编辑
export function edit(params) {
    return request({
      url: '/api/copy_unit/control/edit',
      method: 'post',
      data:params
    })
}

//删除
export function del(params) {
    return request({
      url: '/api/copy_unit/control/delete',
      method: 'post',
      data:params
    })
}