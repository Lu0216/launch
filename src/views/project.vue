<template>
  <div class="ssp_project" style="width:100%;height:100%;">
    <div
      v-loading="loading"
      class="aaaaa"
      style="width:100%;height:100%;"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 1)">
      <h3>产品列表</h3>
      <div v-if="list.length>0" class="ssp_box">
        <el-row :gutter="24">
          <el-col v-for="(item, i) in list" :key="i" :span="span">
            <el-card :title="item.name" class="boxcard">
              <div class="content" @click="handleclick(item)">
                <!-- <span :style="{color:color16()}">{{ item.name }}</span> -->
                <span>{{ item.name }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <p
        v-else
        class="project_p"
      >亲，你没有任何项目的权限，请联系管理员:陈慧</p>
    </div>
  </div>
</template>
<script>
import { getList, getUserme } from '@/api/project'
import { setProject } from '@/utils/auth'
export default {
  name: 'Project',
  data() {
    return {
      loading: true,
      list1: [],
      list2: [],
      list: [],
      span: 0,
      screenWidth: 0
    }
  },
  mounted () {
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = window.innerWidth
        that.screenWidth = window.screenWidth
        that.setSpan(that.screenWidth)
      })()
    }
  },
  created() {
    this.getData()
    window.screenWidth = window.innerWidth
    this.screenWidth = window.screenWidth
    this.setSpan(this.screenWidth)
  },
  watch: {
    // 监听浏览器窗口宽度
    screenWidth (val) {
      if (!this.timer) {
        if (val < 1024) {
          this.span = 12
        } else if (val <= 1440) {
          this.span = 8
        } else if (val <= 1920) {
          this.span = 6
        } else {
          this.span = 4
        }
        this.timer = true
        const that = this
        setTimeout(function () {
          that.timer = false
        }, 400)
      }
    }
  },
  methods: {
    // 设置监听浏览器窗口宽度
    setSpan (val) {
      if (val < 1024) {
        this.span = 12
      } else if (val < 1440) {
        this.span = 8
      } else {
        this.span = 6
      }
    },
    // 获取产品列表
    getData: function() {
      getList({}).then(data => {
        if (data.error_code === 0) {
          this.list1 = data.data
          this.getuserme()
        }
      }).catch((err) => {
        this.$message({
          message: err.error_message || '获取产品失败',
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
            this.list1.map(obj => {
              if (obj.switch !== 0 && item.title === obj.name) {
                obj.auth = item.auth
                arr.push(obj)
              }
            })
          })
          this.loading = false
          this.list = arr
        }
      })
    },
    handleclick: function(data) {
      setProject(JSON.stringify(data))
      // this.$router.push({ path: this.redirect || '/dashboard' })
      window.location.href = '/dashboard'
    },
    rgb: function() {
      var r = Math.floor(Math.random() * 256)
      var g = Math.floor(Math.random() * 256)
      var b = Math.floor(Math.random() * 256)
      var rgb = '(' + r + ',' + g + ',' + b + ')'
      return rgb
    },
    color16: function() {
      var r = Math.floor(Math.random() * 256)
      var g = Math.floor(Math.random() * 256)
      var b = Math.floor(Math.random() * 256)
      var color = '#' + r.toString(16) + g.toString(16) + b.toString(16)
      return color
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.ssp_project{
  .ssp_box{
    width: 90%;
    margin: 0 auto;
  }
    .project_p{
      font-size: 18px;
      text-align: center;
      color: red;
      margin-top: 20px;
    }
    width: 100%;
    margin: 5% auto;
    h3{
        text-align: center;
        font-size: 20px;
        margin-bottom: 20px;
    }
    .aaaaa{
      width: 100%;
      min-height: 100%;
      background-size: 100%;
      position: relative;
    }
    .ssp_project_box{
        display: inline-block;
        cursor: pointer;
    }
    .boxcard{
        width: 90%;
        margin: 20px 5%;
        display: inline-block;
        height: 112px;
        background: #ecf5ff;
    }
    .boxcard:hover{
      background: #304156;
      color: #FFF!important;
    }
    .content{
        position: relative;
        width: 100%;
        height: 100%;
        font-size: 18px;
        span{
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            margin: 0px;
        }
    }
}
</style>
