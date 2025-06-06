<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>

    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <div v-if="options.length>0" class="project">
          <el-select v-model="value" placeholder="请选择" @change="projectChange">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>

        <screenfull content="全屏" class="right-menu-item hover-effect"/>

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select class="right-menu-item hover-effect"/>
        </el-tooltip>

      </template>

      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link class="inlineBlock" to="/dashboard">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import { getList, getUserme } from '@/api/project'
import { getProject, setProject } from '@/utils/auth'

export default {
  components: {
    Breadcrumb,
    Screenfull,
    SizeSelect,
    Hamburger
  },
  data() {
    return {
      value: '',
      options: [],
      options1: [],
      project: {}
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar',
      'device'
    ])
  },
  created() {
    // this.getProj()
    // this.getData()
  },
  methods: {
    // 获取产品列表
    getData: function() {
      getList({}).then(data => {
        if (data.error_code === 0) {
          this.options1 = data.data
          this.getuserme()
        }
      }).catch((err) => {
        this.$message({
          message: err.error_message,
          type: 'error'
        })
      })
    },
    // 获取用户权限产品
    getuserme() {
      getUserme().then(data => {
        if (data.error_code === 0) {
          // this.list = data.data
          var arr = []
          data.data.permissions.map(item => {
            this.options1.map(obj => {
              if (item.title === obj.name) {
                obj.auth = item.auth
                arr.push(obj)
              }
            })
          })
          this.options = arr
        }
      })
    },
    // 产品下拉选择
    projectChange(value) {
      this.value = value
      this.options.map(item => {
        if (item.id === this.value) {
          this.project = item
          // if (this.$route.path === '/dashboard') {
          //   this.$router.push({ path: '/project' })
          // } else {
          setProject(JSON.stringify(this.project))
          this.$router.push({ path: '/dashboard' })
          // }
          window.location.reload()
        }
      })
    },
    // 获取产品id
    getProj: function() {
      if (getProject('project')) {
        this.value = JSON.parse(getProject('project')).id
      } else {
        this.$router.push({ path: '/project' })
      }
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    overflow: hidden;
    .project{
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 16px;
      color: #5a5e66;
      vertical-align: text-bottom;
      .red{
        color: red;
        font-size: 18px;
      }
    }
    .hamburger-container {
      line-height: 46px;
      height: 100%;
      float: left;
      cursor: pointer;
      transition: background .3s;

      &:hover {
        background: rgba(0, 0, 0, .025)
      }
    }

    .breadcrumb-container {
      float: left;
    }

    .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        padding: 0 8px;
        height: 100%;
        font-size: 18px;
        color: #5a5e66;
        vertical-align: text-bottom;

        &.hover-effect {
          cursor: pointer;
          transition: background .3s;

          &:hover {
            background: rgba(0, 0, 0, .025)
          }
        }
      }

      .avatar-container {
        margin-right: 30px;

        .avatar-wrapper {
          margin-top: 5px;
          position: relative;

          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>

