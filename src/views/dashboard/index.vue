<template>
  <div class="dashboard-container">
    <div class="dashboard-text">登录名:{{ name }}</div>
    <div class="dashboard-text">{{title}}投放管理平台</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getProject } from '@/utils/auth'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data(){
    return{
      title: process.env.BASE_TITLE,
    }
  },
  created() {
    
  },
  methods: {
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
