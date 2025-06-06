import request from "@/utils/request";

// 锚点管理列表
export function getAnchorList(params) {
  return request({
    url: "/api/anchor/getAnchorList",
    method: "post",
    data: params
  });
}

// 锚点管理新增
export function getAnchorAdd(params) {
  return request({
    url: "/api/anchor/add",
    method: "post",
    data: params
  });
}

// 锚点管理编辑
export function getAnchorEdit(params) {
  return request({
    url: "/api/anchor/edit",
    method: "post",
    data: params
  });
}

// 锚点应用项目管理列表
export function getProjAnchorList(params) {
  return request({
    url: "/api/anchor/getProjAnchorList",
    method: "post",
    data: params
  });
}

// 锚点应用项目管理新增
export function getProjAnchorAdd(params) {
  return request({
    url: "/api/anchor/projAnchorAdd",
    method: "post",
    data: params
  });
}

// 锚点应用项目管理编辑
export function getProjAnchorEdit(params) {
  return request({
    url: "/api/anchor/projAnchorEdit",
    method: "post",
    data: params
  });
}

// 指定项目锚点列表
export function getAnchorByProj(params) {
  return request({
    url: "/api/anchor/getAnchorByProj",
    method: "post",
    data: params
  });
}

// 锚点应用项目管理新增
export function getProjAnchorAddBatch(params) {
  return request({
    url: "/api/anchor/projAnchorAddBatch",
    method: "post",
    data: params
  });
}
