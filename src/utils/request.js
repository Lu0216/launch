import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken, getProject } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 90000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
   
    // if (getProject) {
    //   if (config.url !== '/user/login' && config.url !== '/user/getInfo' && config.url !== '/user/logout' && config.url !== '/base/getProd' && config.url !== '/permission/me') {
    //     config.url 
    //   }
    // }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
   
    if (res.error_code !== 0) {
      // Message({
      //   message: res.error_message,
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      //
      // // 1000:非法的token
      if (res.error_code === 1000 || res.error_code === 1002) {
        return MessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      Message({
        message: res.error_message || '1000请求错误',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(res)
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.error_message || '1001请求错误',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default service
