<template>
  <div class="login">
    <div class="login-container">
      <div class="login-form">
        <div class="title">{{title}}投放管理后台</div>
        <!-- <img src="~@/assets/images/login_right_title.png" draggable="false" alt="登录标题"> -->
        <el-form
          id="formLogin"
          class="user-layout-login"
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
        >
          <el-form-item prop="name">
            <el-input
              v-model="loginForm.name"
              name="name"
              :disabled="loading"
              type="text"
              auto-complete="on"
              clearable
              @keyup.enter.native="handleLogin"
              class="dialog-input-text"
              placeholder="请输入账号" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="loginForm.password"
              :disabled="loading"
              show-password
              clearable
              name="password"
              class="dialog-input-text"
              auto-complete="on"
              placeholder="请输入密码"
              @keyup.enter.native="handleLogin" />
          </el-form-item>
          <el-button class="submit-btn" :loading="loading" @click.native.prevent="handleLogin">立即登录</el-button>
        </el-form>
      </div>

    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/index'
import store from '@/store'

export default {
  name: 'Login',
  data () {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      title: process.env.BASE_TITLE,
      loginForm: {
        name: '',
        password: ''
      },
      loginRules: {
        name: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      redirect: undefined,
      visible: false
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      }
    }
  },
  created () {
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    handleLogin (e) {
      e.preventDefault()
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.Login(this.loginForm)
            .then((res) => this.loginSuccess(res))
        } 
      })
    },
    loginSuccess (res) {
       store.dispatch('GetInfo').then(res => {
         window.location.href="/"
        // 延迟 1 秒显示欢迎信息
        setTimeout(() => {
          this.$message.success({
            message: '登陆成功',
            description: `${timeFix()}，欢迎回来`
          })
        }, 100)
        this.isLoginError = false
      })

    },
  }
}
</script>

<style  scoped>
.login{
  position: relative;
  overflow: hidden;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2d3a4b;
}
 .login .login-container{
    width: 1200px;
    height: 752px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    overflow: hidden;
    transform: scale(0.9);
 }
 .login-form .title{
    font-size: 26px;
    color: #eee;
    margin: 0 auto 40px;
    text-align: center;
    font-weight: 700;
 }
 .login .login-container   .main-img{
      height: 100%;
      width:100%;
    }
  .login .login-container  .login-form{
      width: 444px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      flex-direction: column;
      position: absolute;
      align-items: center;
      left: 50%;
      margin-left:-222px;
  }
    .login .login-container  .login-form  img{
        margin-bottom: 80px;
      }
     .login .login-container  .login-form .el-form{
        width: 388px;
     }
     .login .login-container  .login-form   .el-form-item{
          margin-bottom: 30px;
        }
      .login .login-container  .login-form  .submit-btn{
         margin-top: 10px;
          width: 388px;
          height: 58px;
          color: #ffffff;
          font-weight: bolder;
          background-color: #409eff;
          border-color: #409eff;
        }
    .login .login-container  .login-form  .cooperation{
        position: absolute;
        bottom: 20px;
        right: 20px;
      }
  .bottomBar{
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,.2);
    line-height: 40px;
    color: #868686;
    text-align: center;
  }
  .login-mask{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0,0,0,.3);
  }
  .login-mask  .message{
      position: relative;
      box-shadow: 0 0 40px rgba(0,0,0,.5);
      border-radius: 10px;
      overflow: hidden;
      width: 567px;
      height: 286px;
  }
  .login-mask  .message    .icon{
        display: block;
        position: absolute;
        width: 12px;
        height: 12px;
        right: 10px;
        top: 10px;
        /* background: url('~@/assets/images/login_close.png') no-repeat center/cover; */
        cursor: pointer;
      }
  .message-leave-active,
  .message-enter-active {
    transition: opacity .4s ease;
  }
  .message-enter,.message-leave-to {
    opacity: 0;
  }

  .register{
    text-align: center;
    color: #fff;
    margin: 30px 0 0 45px;
  }
  .register  span{
      color: #333;
      cursor: pointer;
    }
 
</style>
<style>
.dialog-input-text input.el-input__inner {
        border:1px solid #DCDFE6;
        height:48px;
        text-align: center;
        color: #333333;
     }
</style>
