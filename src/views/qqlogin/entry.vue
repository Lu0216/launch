<template>
  <div class="entry_qqlogin" style="width:100%;height:100%;">
    <div
      v-loading="loading"
      style="width:100%;height:100%;"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    />
  </div>
</template>
<script>
import { setToken } from '@/utils/auth'
export default {
  data() {
    return {
      loading: true
    }
  },
  beforeCreate() {
    const { query } = this.$route
    this.$store.commit('SET_TOKEN', query.token)
    this.$store.commit('SET_NAME', query.name)

    setToken(query.token)
    this.loading = true
    // alert(query.token)
    // this.$router.push({ path: this.redirect || '/adsenses' })
    // this.$router.push({ path: '/project' })
    window.location.href = '/dashboard'
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
