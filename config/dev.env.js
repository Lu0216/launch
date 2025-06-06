'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports =  {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',
  BASE_API: '"http://test-api-tfx.xjhuan.fun"',  // 开发api 自行定义
  BASE_TITLE:'"xjhuan"',
  AGENT_RATE:80,
  // mengfanguang.dev.ssp.com
  BASE_URL: '"http://test-tfx.xjhuan.com"'  //前端地址

}
// npm run lint -- --fix
