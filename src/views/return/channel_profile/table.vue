<template>
  <div class="channel_profile_div">
    <el-select
      v-model="listQuery.channel_id"
      :default-first-option = "true"
      size="mini"
      style="width: 200px;"
      class="filter-item"
      filterable
      placeholder="请选择渠道(输入进行搜索)"
      @change="handleFilter">
      <el-option key="" label="请选择渠道(输入进行搜索)" value="" />
      <el-option v-for="(item) in channels" :key="item.channel" :label="item.channel" :value="item.channel_id"/>
    </el-select>
    <el-select
      v-model="listQuery.is_settle"
      :default-first-option = "true"
      size="mini"
      style="width: 200px;"
      class="filter-item"
      filterable
      placeholder="请选择结算状态"
      @change="handleIssettle">
      <el-option v-for="(item) in is_settle_arr" :key="item.is_settle" :label="item.is_settle" :value="item.is_settle_id"/>
    </el-select>
    <el-table
      v-loading="loading"
      :data="tableData"
      class="channel_profile_table"
      border
      fit
      highlight-current-row>
      <el-table-column
        prop="channel.channel_new"
        label="渠道号"
        sortable
        align="center"/>
      <el-table-column
        prop="channel.name"
        label="渠道名称"
        sortable
        align="center"/>
      <el-table-column
        prop="is_settle"
        label="结算状态"
        sortable
        align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.is_settle == '0'" type="info">不结算</el-tag>
          <el-tag v-else-if="scope.row.is_settle == '1'" type="success">&nbsp;&nbsp;结算&nbsp;&nbsp;</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="handleClick(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="dialogVisible"
      title="结算状态"
      width="30%">
      <el-radio-group v-model="radio">
        <el-radio :label="0">不结算</el-radio>
        <el-radio :label="1">结算</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit_click">确 定</el-button>
      </span>
    </el-dialog>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { channel_profile_Data, channel_profile_edit } from '@/api/return'
export default {
  name: 'ChannelProfile',
  components: { Pagination },
  data() {
    return {
      title: '渠道结算',
      tableData: [],
      channels: [],
      is_settle_arr: [
        {
          is_settle: '不结算',
          is_settle_id: '0'
        },
        {
          is_settle: '结算',
          is_settle_id: '1'
        }
      ],
      loading: true,
      value: true,
      total: 1,
      dialogVisible: false,
      radio: '',
      id: '',
      channel_id: '',
      listQuery: {
        page: 1,
        limit: 20,
        channel_id: '',
        is_settle: ''
      }
    }
  },
  created() {
    this.getData()
    this.getChannels()
  },
  methods: {
    // 获取渠道
    getChannels() {
      this.$store.dispatch('getChannels').then(() => {
        this.channel_select = this.$store.getters.channels
        for (var i in this.$store.getters.channels) {
          this.channels.push(
            {
              'channel_id': i,
              'channel': this.$store.getters.channels[i]
            }
          )
        }
      })
    },
    getList(value) {
      this.listQuery.page = value.page
      this.listQuery.limit = value.limit
      this.loading = true
      this.getData()
    },
    getData() {
      var datasrc = this.listQuery
      channel_profile_Data(datasrc).then((data) => {
        if (data.error_code === 0) {
          this.loading = false
          this.tableData = data.data
          this.total = data.meta.total
        } else {
          this.$message({
            message: '加载失败',
            type: 'error'
          })
        }
      }).catch((err) => {
        this.$message({
          message: err.error_message,
          type: 'error'
        })
      })
    },
    handleFilter(value) {
      this.loading = true
      this.listQuery.channel_id = value
      this.getData()
    },
    handleIssettle(value) {
      this.loading = true
      this.listQuery.is_settle = value
      this.getData()
    },
    handleClick(item) {
      this.dialogVisible = true
      this.radio = item.is_settle
      this.id = item.id
      this.channel_id = item.channel_id
    },
    edit_click() {
      this.dialogVisible = false
      var datasrc = {
        id: this.id,
        channel_id: this.channel_id,
        is_settle: this.radio
      }
      channel_profile_edit(datasrc).then((data) => {
        if (data.error_code === 0) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: data.error_message,
            type: 'error'
          })
        }
        this.getData()
      }).catch((err) => {
        this.loading = false
        this.$message({
          message: err.error_message,
          type: 'error'
        })
      })
    }
  }
}
</script>
<style>
.channel_profile_div{
    padding: 10px 20px 20px 20px;
}

.channel_profile_table{
    border:none;
    border-left:1px solid #ebeef5;
    margin-top:20px;
}
.channel_profile_table::before{
    height: 0px;
}
.channel_profile_table .el-table__header{
    border-top:1px solid #ebeef5;
}
.channel_profile_table .el-table__body-wrapper{
    max-height: 600px;
    overflow-y: auto;
}
.channel_profile_div .el-dialog__header{
    border-bottom:1px solid #ebeef5;
}
.channel_profile_div .el-dialog{
    width: 500px;
}
</style>
