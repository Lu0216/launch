<template>
  <div class="app-container">
    <div class="filter-container" size="mini">
      <el-button
        class="filter-item"
        style="margin: 10px 20px 0px 0px;"
        type="primary"
        icon="el-icon-edit"
        size="mini"
        @click="handleCreate">新增用户</el-button>
      <el-select
        v-model="listQuery.channel_id"
        :default-first-option = "true"
        size="mini"
        style="width: 300px;margin: 10px 20px 0px 0px;"
        class="filter-item"
        filterable
        placeholder="请选择渠道(输入进行搜索)"
        @change="handleFilter">
        <el-option key="" label="请选择渠道(输入进行搜索)" value="" />
        <el-option v-for="(item, key) in channels" :key="item" :label="item" :value="key"/>
      </el-select>
      <el-input
        v-model="listQuery.name"
        style="width: 200px;margin: 10px 20px 0px 0px;"
        size="mini"
        class="filter-item"
        placeholder="请输入用户名"
        @change="handleFilter"/>
    </div>
    <el-divider/>
    <el-table
      v-loading="listLoading"
      :data="lists"
      show-header
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="用户ID" sortable prop="id" align="center" width="90">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" prop="role_id" sortable width="130" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.role_id|roleFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email" sortable width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>z
      </el-table-column>
      <el-table-column label="用户名" prop="username" sortable width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道经理" prop="manager" sortable width="150" align="center">
        <template slot-scope="scope">
          <span>
            {{ scope.row.manager }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="关联渠道" prop="thousand_uv_cost" sortable width="250" align="center">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.channels.length" trigger="hover" placement="left">
            <div class="priority">
              <span v-for="(item,index) in scope.row.channels" :key="index">{{ mappingChannel(item) }}<br></span>
            </div>
            <span slot="reference" size="medium">
              <small>
                <span v-for="(item,index) in scope.row.channels" v-if="index<=1" :key="index">{{ mappingChannel(item) }}<br></span>
                <span v-if="scope.row.channels.length > 2">...</span>
              </small>
            </span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" sortable width="150" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="success">正常</el-tag>
          <el-tag v-else-if="scope.row.status == 0" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="created_at" sortable width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="openDialog(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="dialogFormVisible" :title="dialogStatus==='create'?'新建返量用户':'编辑返量用户'" width="40%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 90%; margin-left:10px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username"/>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email"/>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-radio v-model="temp.role_id" label="0">管理员</el-radio>
          <el-radio v-model="temp.role_id" label="1">渠道管理员</el-radio>
          <el-radio v-model="temp.role_id" label="2">渠道经理</el-radio>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="temp.status"
            active-text="启用"
            inactive-text="禁用"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value= "1"
            inactive-value="0"/>
        </el-form-item>
        <el-form-item label="关联渠道" prop="channels">
          <el-transfer
            v-model="temp.channels"
            :data="transfer_channels"
            :titles="['渠道', '已选中']"
            :button-texts="['移除', '选中']"
            filterable/>
        </el-form-item>
        <el-form-item label="重置密码" prop="password">
          <el-input v-model="temp.password"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?handleCreateData():handleUpdateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { returnUser, addUser, editUser } from '@/api/return'
import Pagination from '@/components/Pagination'

export default {
  name: 'ReturnUserList',
  components: { Pagination },
  filters: {
    roleFilter(role_id) {
      const roleMap = {
        0: '超级管理员',
        1: '渠道管理员',
        2: '渠道经理'
      }
      return roleMap[role_id]
    }
  },
  data() {
    return {
      lists: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        name: '',
        channel_id: ''
      },
      channels: [],
      listLoading: false,

      dialogFormVisible: false,
      temp: {
        id: undefined,
        role_id: undefined,
        username: undefined,
        password: '',
        email: '',
        status: undefined,
        channels: []
      },
      transfer_channels: [],
      dialogStatus: 'edit',
      rules: {
        usernmae: [{ required: true, message: '用户名必须填写', trigger: 'blur' }],
        role_id: [{ required: true, message: '角色必须填写', trigger: 'blur' }],
        status: [{ required: true, message: '角色必须填写', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getChannels()
    this.getList()
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      returnUser(this.listQuery).then(response => {
        this.lists = response.data
        this.total = response.meta.total
        setTimeout(() => {
          this.listLoading = false
        }, 50)
      })
    },
    // 查询
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 获取渠道
    getChannels() {
      this.$store.dispatch('getChannels').then(() => {
        this.channels = this.$store.getters.channels
      })
    },
    mappingChannel(channel_id) {
      return this.channels[channel_id]
    },
    // 初始化穿梭框数据
    initTransferData() {
      if (!this.transfer_channels.length) {
        for (var key in this.channels) {
          this.transfer_channels.push({
            key: parseInt(key),
            label: this.channels[key]
          })
        }
      }
    },
    // 重置
    resetTemp() {
      this.temp = {
        id: undefined,
        role_id: undefined,
        username: undefined,
        password: '',
        email: '',
        status: '0',
        channels: []
      }
    },
    // 打开弹窗
    openDialog(row) {
      // 设置穿梭框
      this.initTransferData()
      this.resetTemp()
      this.temp = Object.assign({}, row)
      this.temp.role_id = row.role_id + ''
      this.temp.status = row.status + ''
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 更新数据
    handleUpdateData() {
      const tempData = Object.assign({}, this.temp)
      editUser(tempData).then(() => {
        for (const v of this.lists) {
          if (v.id === this.temp.id) {
            const index = this.lists.indexOf(v)
            this.temp.password = ''
            this.lists.splice(index, 1, this.temp)
            break
          }
        }
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    // 新增
    handleCreate() {
      this.initTransferData()
      this.resetTemp()
      this.temp.password = '123456'
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreateData() {
      addUser(this.temp).then(() => {
        this.temp.password = ''
        //        this.lists.unshift(this.temp)
        this.handleFilter()
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
<style>
  .priority {
    max-height: 200px;
    overflow-y: auto;
  }
  .table .el-checkbox{
    width:auto !important;
  }
</style>
