<template>
  <div class="returnTask_div">
    <el-button type="primary" icon="el-icon-edit" size="mini" @click="returnTask_Add">新增</el-button>
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
      v-model="listQuery.status"
      :default-first-option = "true"
      size="mini"
      style="width: 200px;"
      class="filter-item"
      filterable
      @change="handlestatus">
      <el-option v-for="(item) in status_arr" :key="item.status_title" :label="item.status_title" :value="item.status_id"/>
    </el-select>
    <el-table
      v-loading="loading"
      :data="tableData"
      class="returnTask_table"
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
        prop="start_time"
        label="开始时间"
        sortable
        align="center"/>
      <el-table-column
        prop="end_time"
        label="结束时间"
        sortable
        align="center"/>
      <el-table-column
        prop="status"
        label="状态"
        sortable
        align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == '0'" type="info">等待执行</el-tag>
          <el-tag v-else-if="scope.row.status == '1'" type="success">执行中</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="info"
        label="描述"
        sortable
        align="center"/>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog
      :visible.sync="dialogVisible"
      title="新增">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="demo-ruleForm" label-width="140px">
        <el-form-item label="渠道号" prop="channel">
          <el-select
            v-model="ruleForm.channel"
            :default-first-option = "true"
            size="mini"
            style="width: 300px"
            class="filter-item"
            filterable
            placeholder="请选择渠道(输入进行搜索)"
            @change="handleChannel">
            <el-option key="" label="请选择渠道(输入进行搜索)" value="" />
            <el-option v-for="(item) in channels" :key="item.channel" :label="item.channel" :value="item.channel_id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间-结束时间" prop="date">
          <el-date-picker
            v-model="ruleForm.date"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm_click('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { returnTask_Data, returnTask_addTask } from '@/api/return'
export default {
  name: 'RreturnTask',
  components: { Pagination },
  data() {
    return {
      title: '日报返量任务',
      loading: true,
      tableData: [],
      dialogVisible: false,
      channels: [],
      channel_select: {},
      ruleForm: {
        channel: '',
        date: ''
      },
      rules: {
        channel: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      total: 1,
      listQuery: {
        channel_id: '',
        status: '',
        page: 1,
        limit: 20
      },
      status_arr: [
        { status_id: 0, status_title: '等待执行' },
        { status_id: 1, status_title: '执行中' }
      ]
    }
  },
  created() {
    this.getChannels()
    this.getData()
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
    getData() {
      returnTask_Data(this.listQuery).then((data) => {
        if (data.error_code === 0) {
          this.tableData = data.data
          this.total = data.meta.total
        } else {
          this.$message({
            message: data.error_message,
            type: 'error'
          })
        }
        this.loading = false
      }).catch((err) => {
        this.$message({
          message: err.error_message,
          type: 'error'
        })
        this.loading = false
      })
    },
    returnTask_addTask(datasrc) {
      this.dialogVisible = false
      returnTask_addTask(datasrc).then((data) => {
        if (data.error_code === 0) {
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.loading = true
          this.getData()
        } else {
          this.$message({
            message: data.error_message,
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
    returnTask_Add() {
      this.dialogVisible = true
    },
    confirm_click(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var datasrc = {
            channel_id: this.ruleForm.channel,
            start_time: this.ruleForm.date[0],
            end_time: this.ruleForm.date[1]
          }
          this.returnTask_addTask(datasrc)
        } else {
          return false
        }
      })
    },
    handleChannel(value) {
      // this.getData()
    },
    handleFilter(value) {
      this.listQuery.channel_id = value
      this.getData()
    },
    handlestatus(value) {
      this.listQuery.status = value
      this.getData()
    },
    getList(value) {
      this.listQuery.page = value.page
      this.listQuery.limit = value.limit
      this.getData()
    }
  }
}
</script>
<style>
.returnTask_div{
    padding: 10px 20px 20px 20px;
}
.returnTask_table{
    border:none;
    border-left:1px solid #ebeef5;
    margin-top:20px;
}
.returnTask_table::before{
    height: 0px;
}
.returnTask_table .el-table__header{
    border-top:1px solid #ebeef5;
}
.returnTask_table .el-table__body-wrapper{
    max-height: 600px;
    overflow-y: auto;
}
.returnTask_div .el-dialog__header{
    border-bottom:1px solid #ebeef5;
}
.returnTask_div .el-dialog{
    width: 540px;
}
</style>
