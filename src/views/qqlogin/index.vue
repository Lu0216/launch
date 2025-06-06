<template>
  <div class="login-container">
    <div class="login-form">
      <h3 class="title">{{title}}xjhuan投放管理后台</h3>
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleLogin">
        企业微信登录
      </el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      title: process.env.BASE_TITLE,
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    handleLogin() {
      var url =
      window.location.hostname === 'localhost'
        ? `https://login.work.weixin.qq.com/wwlogin/sso/login?appid=ww63d3c940a5db5de5&redirect_uri=http%3A%2F%2Fwechat.xikaiyan.fun%2Fwecom%2Flogin&state=http://localhost:${window.location.port}/entry/qqlogin%3Fssos%3Dtest-tfx&agentid=1000006&login_type=CorpApp&`
        : 'https://login.work.weixin.qq.com/wwlogin/sso/login?appid=ww63d3c940a5db5de5&redirect_uri=http%3A%2F%2Fwechat.xikaiyan.fun%2Fwecom%2Flogin&state='+process.env.BASE_URL+'/entry/qqlogin%3Fssos%3D' +  process.env.WECHATLOGIN_STATE +'&agentid=1000006&login_type=CorpApp&'
      // var url = 'https://openapi.b.qq.com/oauth2/authorize?app_id=201113616&oauth_version=2&response_type=code&redirect_uri=http://nav.shzhanmeng.com/auth/callback&ui=web&state=' + process.env.QQLOGIN_STATE + '@' + process.env.BASE_URL + '/entry/qqlogin'
      if (this.redirect !== undefined && this.redirect !== '') {
        url = url + '@redirect=' + this.redirect
      }
      window.location = url
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
