import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const project = 'project'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setProject(value) {
  return Cookies.set(project, value)
}
export function getProject() {
  return Cookies.get(project)
}
