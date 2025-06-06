// import { login, logout, getInfo } from '@/api/login'
import { login,getInfo} from '@/api/dynamic/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

export function mapChildren (data) {
  var drr = [];
  (function mapdata (data) {
    if (data.length > 0) {
      data.map(item => {
        if (item.children) {
          drr.push(item.auth)
          return mapdata(item.children)
        } else {
          drr.push(item.auth)
        }
      })
    } else {
      drr.push(data.auth)
    }
  })(data)
  return drr
}
const user = {
  state: {
    token: getToken(),
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    menu: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_MENU: (state, menu) => {
      state.menu = menu
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const params={
        name:userInfo.name.trim(),
        password:userInfo.password
      }
      return new Promise((resolve, reject) => {
        login(params).then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data
          var obj = []
          if (('permissions' in data) && data.permissions.length > 0) {
            obj = mapChildren(data.permissions)
            // data.permissions.map(item => {
            //   if (item.children) {
            //     obj[item.id] = mapChildren(item.children)
            //   }
            // })
            commit('SET_MENU', data.permissions)
            commit('SET_ROLES', data.role)
          } else {
            resolve({ obj, data })
          }
          commit('SET_NAME', data.userName)
          commit('SET_AVATAR', data.avatar ? data.avatar : 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
          resolve({ obj, data })
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        // logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_MENU', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      // })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },
    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getInfo(role).then(response => {
          const data = response.data
          // commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          // commit('SET_AVATAR', data.avatar)
          // commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    }
  }
}

export default user
