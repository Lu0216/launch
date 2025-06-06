<template>
  <div class="app-container">
    <div class="filter-container" size="mini">
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
        <el-option v-for="(item) in channels" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-input
        v-model="listQuery.channel_name"
        style="width: 200px;margin: 10px 20px 0px 0px;"
        size="mini"
        class="filter-item"
        placeholder="请输入渠道名称"
        @change="handleFilter"/>
      <el-date-picker
        v-model="listQuery.date"
        size="mini"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        style="margin: 10px 20px 0px 0px;"
        @change="handleFilter"/>
      <el-tag>总收入：{{ Total_income }}</el-tag>
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
      <el-table-column label="日期" sortable prop="date" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道号" prop="channel_id" sortable width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channel_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道名称" prop="channel_name" sortable width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channel_name }}</span>
        </template>z
      </el-table-column>
      <el-table-column label="返量UV" prop="return_amount_uv" sortable width="150" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="openDialog(scope.row)">
            {{ scope.row.return_amount_uv }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="收入" prop="income" sortable width="150" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="openDialog(scope.row)">
            {{ scope.row.income }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="去重UV" prop="not_repeat_uv" sortable width="150" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="openDialog(scope.row)">
            {{ scope.row.not_repeat_uv }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="created_at" sortable width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否展示" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="openDialog(scope.row)">
            <el-tag v-if="scope.row.is_show == 1" type="success">展示</el-tag>
            <el-tag v-else-if="scope.row.is_show == 0" type="danger">禁用</el-tag>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogFormVisible" title="编辑返量数据" width="30%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 90%; margin-left:10px;">
        <el-form-item label="渠道号">
          <span>{{ temp.channel_id }}</span>
        </el-form-item>
        <el-form-item label="返量UV" prop="return_amount_uv">
          <el-input v-model="temp.return_amount_uv"/>
        </el-form-item>
        <el-form-item label="收入" prop="income">
          <el-input v-model="temp.income"/>
        </el-form-item>
        <el-form-item label="去重UV" prop="not_repeat_uv">
          <el-input v-model="temp.not_repeat_uv"/>
        </el-form-item>
        <el-form-item label="是否展示" prop="is_show">
          <el-switch
            v-model="temp.is_show"
            active-text="展示"
            inactive-text="禁用"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value= "1"
            inactive-value="0"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { returnData, editReturnData } from '@/api/return'
import { getDate } from '@/utils'

export default {
  name: 'ReturnUserList',
  data() {
    return {
      lists: null,
      listQuery: {
        page: 1,
        limit: 20,
        date: '',
        channel_id: '',
        channel_name: ''
      },
      channels: [],
      listLoading: false,

      dialogFormVisible: false,
      temp: {
        id: undefined,
        channel_id: undefined,
        return_amount_uv: undefined,
        income: '',
        not_repeat_uv: '',
        is_show: undefined
      },
      rules: {
        usernmae: [{ required: true, message: '用户名必须填写', trigger: 'blur' }],
        role_id: [{ required: true, message: '角色必须填写', trigger: 'blur' }],
        status: [{ required: true, message: '角色必须填写', trigger: 'blur' }]
      },
      Total_income: 0
    }
  },
  created() {
    this.listQuery.date = [
      getDate(7),
      getDate()
    ]
    this.getChannels()
    this.getList()
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      returnData(this.listQuery).then(response => {
        this.lists = response.data
        var income = 0
        for (var i = 0; i < response.data.length; i++) {
          income += Number(response.data[i]['income']) * 100
        }
        this.Total_income = income / 100
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
    // 打开弹窗
    openDialog(row) {
      // 设置穿梭框
      this.temp = Object.assign({}, row)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 更新数据
    handleUpdateData() {
      const tempData = Object.assign({}, this.temp)
      editReturnData(tempData).then(() => {
        for (const v of this.lists) {
          if (v.id === this.temp.id) {
            const index = this.lists.indexOf(v)
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
