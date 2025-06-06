import request from "@/utils/request";

// 赔付金列表
export function getPayoutAmountList(params) {
  return request({
    url: "/api/report/list",
    method: "post",
    data: params
  });
}