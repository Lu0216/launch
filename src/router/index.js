import Vue from 'vue'
import Router from 'vue-router'
import { strategy } from 'webpack-merge'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
// import { component } from 'vue/types/umd'
import { name } from 'file-loader'


/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  {
    path: '/entry/qqlogin',
    // component: () => import('@/views/qqlogin/entry'),
    component: () => import('@/views/qqlogin/entry'),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/noredirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/',
        name: '404',
        component: () => import('@/views/404'),
        hidden: true
      },
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: process.env.BASE_TITLE, icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
  { path: '/login', component: () => import('@/views/qqlogin/index'), hidden: true },
  // { path: '/login', component: () => import('@/views/qqlogin/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    meta: { title: process.env.BASE_TITLE, icon: 'example' },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: process.env.BASE_TITLE, icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '*',
    hidden: true,
    component: () => import('@/views/404')
  }
]
export const asyncRouterMap = [
  {
    path: '/launch',
    component: Layout,
    name: 'launch',
    redirect: 'noredirect',
    meta: { title: '投放管理', icon: 'nested', permission: ['launch'] },
    children: [
      {
        path: '/agent',
        name: 'index',
        component: () => import('@/views/launch/agent/index'),
        meta: { title: '代理管理', icon: 'list', permission: ['agent'] },
        children: [
          {
            path: '/agent',
            name: 'agent/index',
            hidden: true,
            component: () => import('@/views/launch/agent/table')
          }
        ]
      },
      {
        path: '/master',
        name: 'master/index',
        component: () => import('@/views/launch/master/index'),
        meta: { title: '主账号管理', icon: 'form', permission: ['master'] },
        children: [
          {
            path: '/master',
            name: 'master/table',
            hidden: true,
            component: () => import('@/views/launch/master/table')
          }
        ]
      },
      {
        path: '/sub',
        name: 'sub/index',
        component: () => import('@/views/launch/sub/index'),
        meta: { title: '子账号管理', icon: 'form', permission: ['sub'] },
        children: [
          {
            path: '/sub',
            name: 'sub/table',
            hidden: true,
            component: () => import('@/views/launch/sub/table')
          }
        ]
      },
      {
        path: '/specialsub',
        name: 'specialsub/index',
        component: () => import('@/views/launch/specialsub/index'),
        meta: { title: '返货子账号管理', icon: 'form', permission: ['specialsub'] },
        children: [
          {
            path: '/specialsub',
            name: 'specialsub/table',
            hidden: true,
            component: () => import('@/views/launch/specialsub/table')
          }
        ]
      },
      {
        path: '/channel',
        name: 'channel/index',
        component: () => import('@/views/launch/channel/index'),
        meta: { title: '渠道包管理', icon: 'form', permission: ['channel'] },
        children: [
          {
            path: '/channel',
            name: 'channel/table',
            hidden: true,
            component: () => import('@/views/launch/channel/table')
          }
        ]
      },
      {
        path: '/authlink',
        name: 'authlink/index',
        component: () => import('@/views/launch/authlink/index'),
        meta: { title: '授权链接管理', icon: 'form', permission: ['authlink'] },
        children: [
          {
            path: '/authlink',
            name: 'authlink/table',
            hidden: true,
            component: () => import('@/views/launch/authlink/table')
          }
        ]
      },
      {
        path: '/launchtest',
        name: 'launchtest/index',
        component: () => import('@/views/launch/launchtest/index'),
        meta: { title: '投放联调', icon: 'form', permission: ['launchtest'] },
        children: [
          {
            path: '/launchtest',
            name: 'launchtest/table',
            hidden: true,
            component: () => import('@/views/launch/launchtest/table')
          }
        ]
      },
      {
        path: '/qalaunch',
        name: 'qalaunch/index',
        component: () => import('@/views/launch/qalaunch/index'),
        meta: { title: 'qa投放链接管理', icon: 'form', permission: ['qalaunch'] },
        children: [
          {
            path: '/qalaunch',
            name: 'qalaunch/table',
            hidden: true,
            component: () => import('@/views/launch/qalaunch/table')
          }
        ]
      },
      {
        path: '/principalline',
        name: 'principalline/index',
        component: () => import('@/views/launch/principalline/index'),
        meta: { title: '主线包管理', icon: 'form', permission: ['principalline'] },
        children: [
          {
            path: '/principalline',
            name: 'principalline/table',
            hidden: true,
            component: () => import('@/views/launch/principalline/table')
          }
        ]
      },
      {
        path: '/power',
        name: 'power/index',
        component: () => import('@/views/launch/power/index'),
        meta: { title: '权限管理', icon: 'form', permission: ['power'] },
        children: [
          {
            path: '/power',
            name: 'power/table',
            hidden: true,
            component: () => import('@/views/launch/power/table')
          }
        ]
      }
    ]
  },
  {
    path: '/backhaul',
    component: Layout,
    name: 'backhaul',
    redirect: 'noredirect',
    meta: { title: '回传管理', icon: 'link', permission: ['backhaul'] },
    children: [
      {
        path: '/plan',
        name: 'plan',
        component: () => import('@/views/backhaul/plan/table'),
        meta: { title: '计划维度回传管理', icon: 'list', permission: ['backhaulplan'] }
      },
      {
        path: '/screen',
        name: 'screen',
        component: () => import('@/views/backhaul/screen/table'),
        meta: { title: '渠道包回传管理', icon: 'list', permission: ['screen'] }
      },
      {
        path: '/backhaulagent',
        name: 'backhaulagent',
        component: () => import('@/views/backhaul/agent/table'),
        meta: { title: '代理回传管理', icon: 'list', permission: ['backhaulagent'] }
      },
      {
        path: '/exception',
        name: 'exception',
        component: () => import('@/views/backhaul/exception/table'),
        meta: { title: '子账户回传管理', icon: 'list', permission: ['exception'] }
      },
      {
        path: '/newAnchor',
        name: 'newAnchor',
        component: () => import('@/views/backhaul/newAnchor/table'),
        meta: { title: '回传锚点gap配置管理', icon: 'list', permission: ['newAnchor'] }
      },
      {
        path: '/quickAppAnchor',
        name: 'quickAppAnchor',
        component: () => import('@/views/backhaul/quickAppAnchor/table'),
        meta: { title: '快应用回传锚点gap配置管理', icon: 'list', permission: ['quickAppAnchor'] }
      },
    ]
  },
  {
    path: '/stoppackage',
    component: Layout,
    name: 'stoppackage',
    redirect: 'noredirect',
    meta: { title: '停包管理', icon: 'link', permission: ['stoppackage'] },
    children: [
      {
        path: '/stopchannelpackage',
        name: 'stopchannelpackage',
        component: () => import('@/views/stoppackage/stopchannelpackage/table'),
        meta: { title: '渠道包停包管理', icon: 'list', permission: ['stopchannelpackage'] }
      },
      {
        path: '/packagegroup',
        name: 'packagegroup',
        component: () => import('@/views/stoppackage/packagegroup/table'),
        meta: { title: '停包批次', icon: 'list', permission: ['packagegroup'] }
      },
      {
        path: '/packagedetail',
        name: 'packagedetail',
        component: () => import('@/views/stoppackage/packagedetail/table'),
        meta: { title: '停包明细', icon: 'list', permission: ['packagedetail'] }
      },
      {
        path: '/adsdimension',
        name: 'adsdimension',
        component: () => import('@/views/stoppackage/adsdimension/table'),
        meta: { title: '广告组维度', icon: 'list', permission: ['adsdimension'] }
      },
      {
        path: '/plandimension',
        name: 'plandimension',
        component: () => import('@/views/stoppackage/plandimension/table'),
        meta: { title: '计划维度', icon: 'list', permission: ['plandimension'] }
      },
      {
        path: '/adsdetail',
        name: 'adsdetail',
        component: () => import('@/views/stoppackage/adsdetail/table'),
        meta: { title: '广告组维度操作明细', icon: 'list',  permission: ['adsdetail']}
      },
      {
        path: '/plandetail',
        name: 'plandetail',
        component: () => import('@/views/stoppackage/plandetail/table'),
        meta: { title: '计划维度操作明细', icon: 'list',  permission: ['plandetail']}
      },
      {
        path: '/copyplan',
        name: 'copyplan',
        component: () => import('@/views/stoppackage/copyplan/table'),
        meta: { title: '复制计划', icon: 'list',  permission: ['copyplan']}
      }
    ]
  },
  {
    path: '/packagefilter',
    component: Layout,
    name: 'packagefilter',
    redirect: 'noredirect',
    meta: { title: '离线筛包规则管理', icon: 'search', permission: ['packagefilter'] },
    children: [
      {
        path: '/filterconfig',
        name: 'filterconfig',
        component: () => import('@/views/packagefilter/filterconfig/table'),
        meta: { title: '筛包策略管理', icon: 'list', permission: ['filterconfig'] },
      },
      {
        path: '/filterconfigdetail',
        name: 'filterconfigdetail',
        component: () => import('@/views/packagefilter/filterconfig/detail'),
        meta: { title: '筛包策略明细', icon: 'list', permission: ['filterconfigdetail'] },
      },
      {
        path: '/filtergroup',
        name: 'filtergroup',
        component: () => import('@/views/packagefilter/filtergroup/table'),
        meta: { title: '项目媒体-筛包策略管理', icon: 'list', permission: ['filtergroup'] }
      }
    ]
  },
  {
    path: '/realtimepkgfilter',
    component: Layout,
    name: 'realtimepkgfilter',
    redirect: 'noredirect',
    meta: { title: '实时筛包规则管理', icon: 'search', permission: ['realtimepkgfilter'] },
    children: [
      {
        path: '/sievebag',
        name: 'sievebag',
        component: () => import('@/views/realtimepkgfilter/sievebag/table'),
        meta: { title: '实时筛包规则管理', icon: 'list', permission: ['sievebag'] }
      }
    ]
  },{
    path: '/autoWhiteList',
    component: Layout,
    name: 'autoWhiteList',
    redirect: 'noredirect',
    meta: { title: '自动停投白名单管理', icon: 'list', permission: ['autoWhiteList'] },
    children: [
      {
        path: '/offlineWhite',
        name: 'offline',
        component: () => import('@/views/autoWhiteList/offline/table'),
        meta: { title: '离线自动化白名单管理', icon: 'list', permission: ['offlineWhite'] }
      },
      {
        path: '/realtimeWhite',
        name: 'realtimeWhite',
        component: () => import('@/views/autoWhiteList/realtime/table'),
        meta: { title: '实时自动化白名单管理', icon: 'list', permission: ['realtimeWhite'] }
      },
      {
        path: '/airrunWhite',
        name: 'airrunWhite',
        component: () => import('@/views/autoWhiteList/airrun/table'),
        meta: { title: '空跑计划白名单管理', icon: 'list', permission: ['airrunWhite'] }
      },
    ]
  },
  {
    path: '/whitelist',
    component: Layout,
    name: 'whitelist',
    redirect: 'noredirect',
    meta: { title: '白名单管理', icon: 'search', permission: ['whitelist'] },
    children: [
      {
        path: '/copyuint',
        name: 'copyuint',
        component: () => import('@/views/whitelist/copyunit/table'),
        meta: { title: '复制计划白名单管理', icon: 'list', permission: ['copyunit'] }
      }
    ]
  },
  {
    path: '/activateBack',
    component: Layout,
    name: 'activateBack',
    redirect: 'noredirect',
    meta: { title: '激活回传锚点管理', icon: 'search', permission: ['activateBack'] },
    children: [
      {
        path: '/subAccountScene',
        name: 'subAccountScene',
        component: () => import('@/views/activateBack/subAccountScene/table'),
        meta: { title: '子账户维度-锚点配置', icon: 'list', permission: ['subAccountScene'] }
      },
      {
        path: '/mediaScene',
        name: 'mediaScene',
        component: () => import('@/views/activateBack/mediaScene/table'),
        meta: { title: '媒体维度-锚点配置', icon: 'list', permission: ['mediaScene'] }
      },
      {
        path: '/anchor',
        name: 'anchor',
        component: () => import('@/views/activateBack/anchor/table'),
        meta: { title: '锚点管理', icon: 'list', permission: ['anchor'] }
      },
      {
        path: '/anchorApply',
        name: 'anchorApply',
        component: () => import('@/views/activateBack/anchorApply/table'),
        meta: { title: '锚点应用项目管理', icon: 'list', permission: ['anchorApply'] }
      }
    ]
  },
  // {
  //   path: '/addlaunchrules',
  //   component: Layout,
  //   name: 'addlaunchrules',
  //   redirect: 'noredirect',
  //   meta: { title: '新增关键行为规则管理', icon: 'search', permission: ['addlaunchrules'] },
  //   children: [
  //     {
  //       path: '/rules',
  //       name: 'rules',
  //       component: () => import('@/views/addlaunchrules/rules/table'),
  //       meta: { title: '关键行为规则管理', icon: 'list', permission: ['addlaunchrulestwo'] }
  //     }
  //   ]
  // },
  {
    path: '/addlaunchrule',
    component: Layout,
    name: 'addlaunchrule',
    redirect: 'noredirect',
    meta: { title: '新增关键行为规则管理2.0', icon: 'search', permission: ['addlaunchrules'] },
    children: [
      {
        path: '/rule',
        name: 'rule',
        component: () => import('@/views/addlaunchrule/rule/table'),
        meta: { title: '关键行为规则管理2.0', icon: 'list', permission: ['addlaunchrulestwo'] }
      },
      {
        path: '/ecpmConfig',
        name: 'ecpmConfig',
        component: () => import('@/views/addlaunchrule/ecpmConfig/table'),
        meta: { title: '关键行为ecpm配置', icon: 'list', permission: ['ecpmConfig'] }
      },
    ]
  },
  {
    path: '/quickAppRules',
    component: Layout,
    name: 'quickAppRules',
    redirect: 'noredirect',
    meta: { title: '快应用关键行为规则管理', icon: 'search', permission: ['quickAppRules'] },
    children: [
      {
        path: '/quickRules',
        name: 'quickRules',
        component: () => import('@/views/quickAppRules/quickRules/table'),
        meta: { title: '快应用关键行为规则管理', icon: 'list', permission: ['quickRules'] }
      }
    ]
  },
  {
    path: '/log',
    component: Layout,
    name: 'log',
    redirect: 'noredirect',
    meta: { title: '投放后台操作日志', icon: 'search', permission: ['log'] },
    children: [
      {
        path: '/operatelog',
        name: 'operatelog',
        component: () => import('@/views/log/operatelog/table'),
        meta: { title: '投放联调操作日志', icon: 'list', permission: ['operatelog'] }
      },
    ]
  },
  {
    path: '/planclean',
    component: Layout,
    name: 'planclean',
    redirect: 'noredirect',
    meta: { title: '低效计划清理管理', icon: 'list', permission: ['planclean'] },
    children: [
      {
        path: '/cleansub',
        name: 'cleansub',
        component: () => import('@/views/planclean/sub/table'),
        meta: { title: '清理子账号管理', icon: 'list', permission: ['cleansub'] }
      },
      {
        path: '/cleandetail',
        name: 'cleandetail',
        component: () => import('@/views/planclean/detail/table'),
        meta: { title: '清理计划明细', icon: 'list', permission: ['cleandetail'] }
      }
    ]
  },
  {
    path: '/payoutAmount',
    component: Layout,
    name: 'payoutAmount',
    redirect: 'noredirect',
    meta: { title: '媒体赔付', icon: 'list', permission: ['payoutAmount'] },
    children: [
      {
        path: '/payoutAmountReport',
        name: 'payoutAmountReport',
        component: () => import('@/views/payoutAmount/payoutAmountReport/table'),
        meta: { title: '媒体赔付列表', icon: 'list', permission: ['payoutAmountReport'] }
      }
    ]
  },
  {
    path: '/headlineAdPreview',
    component: Layout,
    name: 'headlineAdPreview',
    redirect: 'noredirect',
    meta: { title:'头条广告预览', icon: 'list', permission: ['headlineAdPreview'] },
    children: [
      {
        path: '/adPreview',
        name: 'adPreview',
        component: () => import('@/views/headlineAdPreview/adPreview/table'),
        meta: { title: '头条广告预览', icon: 'list', permission: ['adPreview'] }
      }
    ]
  },
  {
    path: '/reportforms',
    component: Layout,
    name: 'reportforms',
    redirect: 'noredirect',
    meta: { title: 'roi报表', icon: 'list', permission: ['reportforms'] },
    children: [
      {
        path: '/launchReport',
        name: 'launchReport',
        component: () => import('@/views/reportforms/launch/table'),
        meta: { title: '投放报表', icon: 'list', permission: ['launchReport'] }
      },
      {
        path: '/revenueReport',
        name: 'revenueReport',
        component: () => import('@/views/reportforms/revenue/table'),
        meta: { title: '营收报表', icon: 'list', permission: ['revenueReport'] }
      },
      {
        path: '/launchReports',
        name: 'launchReports',
        component: () => import('@/views/reportforms/launchs/table'),
        meta: { title: '投放报表(机型版本)', icon: 'list', permission: ['launchReports'] }
      }
    ]
  },
  {
    path: '/learningPeriod',
    component: Layout,
    name: 'learningPeriod',
    redirect: 'noredirect',
    meta: { title:'学习期管理', icon: 'search', permission: ['learningPeriod'] },
    children: [
      {
        path: '/learning',
        name: 'learning',
        component: () => import('@/views/learningPeriod/learning/table'),
        meta: { title: '学习期管理', icon: 'search', permission: ['learning'] }
      },
      {
        path: '/learnAnchor',
        name: 'learnAnchor',
        component: () => import('@/views/learningPeriod/learnAnchor/table'),
        meta: { title: '学习期激活锚点管理', icon: 'search', permission: ['learnAnchor'] }
      },
      {
        path: '/learnBehavior',
        name: 'learnBehavior',
        component: () => import('@/views/learningPeriod/learnBehavior/table'),
        meta: { title: '学习期关键行为管理', icon: 'search', permission: ['learnBehavior'] }
      },
    ]
  },
  {
    path: '/configStrategy',
    component: Layout,
    name: 'configStrategy',
    redirect: 'noredirect',
    meta: { title: '配置策略修改记录', icon: 'list', permission: ['configStrategy'] },
    children: [
      {
        path: '/anchorModify',
        name: 'anchorModify',
        component: () => import('@/views/configStrategy/anchor/table'),
        meta: { title: '激活锚点修改记录', icon: 'list', permission: ['anchorModify'] }
      },
      {
        path: '/behaviorModify',
        name: 'behaviorModify',
        component: () => import('@/views/configStrategy/behavior/table'),
        meta: { title: '关键行为修改记录', icon: 'list', permission: ['behaviorModify'] }
      },
    ]
  },
]

export default new Router({
  mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
