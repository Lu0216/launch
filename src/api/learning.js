import request from "@/utils/request";

// 学习期管理列表
export function getLearnList(params) {
  return request({
    url: "/api/learning/configs",
    method: "post",
    data: params
  });
}

// 学习期管理新增/编辑
export function getLearnSave(params) {
  return request({
    url: "/api/learning/saveConfig",
    method: "post",
    data: params
  });
}

// 获取项目下子账号
export function getChildId(params) {
  return request({
    url: "/api/media/account/childByProjId",
    method: "post",
    data: params
  });
}


// 激活锚点列表
export function getActivateList(params) {
  return request({
    url: '/api/learning/activate/list',
    method: 'post',
    data:params
  })
}

// 激活锚点新增
export function addActivate(params) {
  return request({
    url: '/api/learning/activate/add',
    method: 'post',
    data: params
  })
}
// 激活锚点批量编辑
export function editActivate(params) {
return request({
  url: '/api/learning/activate/edit',
  method: 'post',
  data: params
})
}


// 激活锚点批量删除
export function deleteActivate(params) {
  return request({
    url: '/api/learning/activate/delete',
    method: 'post',
    data: params
  })
}

// 激活锚点新增多条 重复覆盖
export function saveActive(params) {
return request({
  url:'/api/learning/activate/saveV2',
  method:'post',
  data:params
})
}


// 关键行为规则管理 -- 列表
export function getList(params) {
  return request({
    url: '/api/learning/behavior/list',
    method: 'post',
    data:params
  })
}

// 关键行为规则管理 -- 新增
export function getAdd(params) {
  return request({
    url: '/api/learning/behavior/saveV2',
    method: 'post',
    data:params
  })
}

// 关键行为规则管理 -- 编辑
export function getEdit(params) {
  return request({
    url: `/api/learning/behavior/edit`,
    method: 'post',
    data:params
  })
}

// 关键行为规则管理 -- 批量编辑
export function getBatchEdit(params) {
return request({
  url: '/api/learning/behavior/batch_edit',
  method: 'post',
  data: params
})
}

