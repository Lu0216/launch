import request from '@/utils/request'

// 筛包策略列表
export function getList(params) {
    return request({
      url: '/api/package_filter/tactics/list',
      method: 'post',
      data:params
    })
}

// 批量导入
export function batch(params) {
    return request({
      url: '/api/package_filter/tactics/batch',
      method: 'post',
      data: params
    })
}

// 筛包明细列表
export function detailList(params) {
    return request({
      url: '/api/package_filter/tactics/detail',
      method: 'post',
      data:params
    })
}
  

// 筛包策略名称下拉列表
export function selectNameList(params) {
    return request({
      url: '/api/package_filter/filters',
      method: 'get',
      params
    })
}

// 筛包策略类型下拉列表
export function selectTypeList(params) {
    return request({
      url: '/api/package_filter/molds',
      method: 'get',
      params
    })
}

// 筛包策略结论下拉列表
export function selectResultsList(params) {
    return request({
      url: '/api/package_filter/results',
      method: 'get',
      params
    })
}

// 筛包策略项目媒体管理列表
export function getGroupList(params) {
    return request({
      url: '/api/package_filter/list',
      method: 'post',
      data:params
    })
}

// 筛包策略项目媒体添加
export function groupAdd(params) {
    return request({
      url: '/api/package_filter/add',
      method: 'post',
      data:params
    })
}

// 筛包策略项目媒体编辑
export function groupEdit(params) {
  return request({
    url: `/api/package_filter/edit/${params.id}`,
    method: 'post',
    data:params
  })
}