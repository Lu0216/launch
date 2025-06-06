import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param route
 * @param permission
 */
function hasPermission(menu, route) {
  if (route.meta && route.meta.permission && route.meta.permission.length > 0) {
    let flag = false
    flag = menu.indexOf(route.meta.permission[0]) > -1
    if (flag) {
      return true
    }
    return false
  }
  return true
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param allRoutes asyncRouterMap
 * @param permission
 */
 function filterAsyncRouter (routerMap, menu) {
  const res = []
  routerMap.map(route => {
    if (hasPermission(menu, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, menu)
      }
      // return true
      res.push(route)
      return true
    }
    // TODO
    return true
    // return false
  })
  return res
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise((resolve, reject) => {
        const { res } = data
        if (res) {
          var menu = res || []
        } else {
          reject(new Error('路由设置失败'))
        }
        const accessedRouters = filterAsyncRouter(asyncRouterMap, menu)
        // const accessedRouters = asyncRouterMap
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}
export default permission
