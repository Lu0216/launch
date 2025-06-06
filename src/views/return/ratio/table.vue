<template>
  <div class="app-container">
    <div class="filter-container" size="mini">
      <el-button
        class="filter-item"
        style="margin: 10px 20px 0px 0px;"
        type="primary"
        icon="el-icon-edit"
        size="mini"
        @click="handleCreate">新增投放</el-button>
      <el-select
        v-model="listQuery.channel_new"
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

      <el-button
        class="filter-item"
        style="margin: 10px 20px 0px 0px;"
        type="info"
        icon="el-icon-edit"
        size="mini"
        @click="openGenerateData">生成日报</el-button>
    </div>
    <el-divider/>
    <el-table
      v-loading="listLoading"
      :data="lists"
      :show-summary="true"
      class="ratiotable"
      show-header
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="渠道" sortable prop="channel_id" align="center">
        <template slot-scope="scope">
          <span>{{ mappingChannel(scope.row.channel_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="UV返量比" prop="return_ratio" sortable align="center">
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="openDialog(scope.row)">
            {{ scope.row.return_ratio }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="千次UV系数" prop="thousand_uv_ratio" sortable align="center">
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="openDialog(scope.row)">
            {{ scope.row.thousand_uv_ratio }}
          </el-button>
        </template>z
      </el-table-column>
      <el-table-column label="千次固定成本" prop="thousand_uv_cost" sortable align="center">
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="openDialog(scope.row)">
            {{ scope.row.thousand_uv_cost }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogFormVisible" title="设置系数" width="454px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 300px; margin-left:60px;">
        <el-form-item label="渠道号" prop="channel_id">
          <el-select
            v-if="dialogStatus==='create'"
            v-model="temp.channel_id"
            :default-first-option = "true"
            class="filter-item"
            filterable
            placeholder="请选择渠道">
            <el-option key="" label="请选择渠道" value="" />
            <el-option v-for="(item,key) in channels" :key="item" :label="item" :value="key"/>
          </el-select>
          <span v-if="dialogStatus==='edit'">{{ mappingChannel(temp.channel_id) }}</span>
        </el-form-item>
        <el-form-item label="UV返量比" prop="return_ratio">
          <el-input v-model="temp.return_ratio"/>
        </el-form-item>
        <el-form-item label="千次uv系数">
          <el-input v-model="temp.thousand_uv_ratio"/>
        </el-form-item>
        <el-form-item label="固定千次UV成本">
          <el-input v-model="temp.thousand_uv_cost"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?handleCreateData():updateData()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="generateDialogFormVisible" title="生成日报" width="454px">
      <el-form ref="fixForm" label-position="left" label-width="50px" style="width: 100px; margin-left:60px;">
        <el-form-item label="日期" prop="fix_date">
          <el-date-picker
            v-model="date"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="generateDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="generateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { ratioList, editRatio, createRatio, generateData } from '@/api/return'
import { getDate } from '@/utils'

export default {
  name: 'ReturnDailyList',
  data() {
    return {
      lists: [],
      listQuery: {
        date: [],
        channel_new: ''
      },
      channels: [],
      listLoading: false,

      dialogFormVisible: false,
      temp: {
        id: undefined,
        channel_id: undefined,
        return_ratio: 0.00,
        thousand_uv_ratio: 0,
        thousand_uv_cost: 0
      },
      dialogStatus: 'edit',
      rules: {
        channel_id: [{ required: true, message: '请选择渠道号', trigger: 'change' }],
        return_ratio: [{ required: true, message: '填写UV返量比', trigger: 'blur' }]
      },

      generateDialogFormVisible: false,
      date: ''
    }
  },
  created() {
    this.getChannels()
    this.getList()
    this.date = getDate()
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      ratioList(this.listQuery).then(response => {
        this.lists = response.data
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
    // 打开弹窗
    openDialog(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'edit'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 更新数据
    updateData() {
      const tempData = Object.assign({}, this.temp)
      editRatio(tempData).then(() => {
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
    },
    // 新增
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 重置
    resetTemp() {
      this.temp = {
        id: undefined,
        channel_id: undefined,
        return_ratio: 0.00,
        thousand_uv_ratio: 0,
        thousand_uv_cost: 0
      }
    },
    handleCreateData() {
      createRatio(this.temp).then(() => {
        this.lists.unshift(this.temp)
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    openGenerateData() {
      this.generateDialogFormVisible = true
    },
    // 生成日报
    generateData() {
      generateData({ date: this.date }).then(() => {
        this.generateDialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '生成成功',
          type: 'success',
          duration: 2000
        })
        this.$router.push({ path: '/return/ratioList' })
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
  /* .table .el-checkbox{
    width:auto !important;
  }
  .channel_div{
    padding: 10px 20px 20px 20px;
  } */
  .ratiotable{
      border:none;
      border-left:1px solid #ebeef5;
      margin-top:20px;
  }
  .ratiotable::before{
      height: 0px;
  }
  .ratiotable .el-table__header{
      border-top:1px solid #ebeef5;
  }
  .ratiotable .el-table__body-wrapper{
      max-height: 600px;
      overflow-y: auto;
  }
</style>
