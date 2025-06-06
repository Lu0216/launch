const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  menu: state => state.user.menu,
  permission_routers: state => state.permission.routers, // 全局路由
  addRouters: state => state.permission.addRouters, // 动态路由
  channels: state => state.baseData.channels, // 渠道
  flows: state => state.baseData.flows, // 信息流
  custom_data: state => state.baseData.custom_data, // 自定义数据
  all_adsenses: state => state.baseData.all_adsenses, // 所有广告位
  selected_adsenses: state => state.baseData.selected_adsenses, // 选中的广告位
  init_priority: state => state.baseData.init_priority, // 选中的广告位
  ad_users: state => state.baseData.ad_users, // 广告客户
  all_orders: state => state.baseData.all_orders // 所有的订单
}
export default getters
