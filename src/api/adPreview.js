import request from '@/utils/request'

// 头条广告预览列表
export function getList(params) {
  return request({
    url: '/api/qrcode/list',
    method: 'post',
    data: params
  })
}