import request from "@/utils/request";

// 关键行为ecpm配置列表
export function getList(params) {
  return request({
    url: "/api/custom_rule/ecpm/list",
    method: "post",
    data: params
  });
}

// 关键行为ecpm新增
export function addCongig(params) {
  return request({
    url: "/api/custom_rule/ecpm/save",
    method: "post",
    data: params
  });
}


