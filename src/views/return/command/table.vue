<template>
  <div class="app-container">
    <div class="filter-container" size="mini">
      <el-button
        class="filter-item"
        style="margin: 10px 20px 0px 0px;"
        type="primary"
        icon="el-icon-edit"
        size="mini"
        @click="handleCreate">新增口令</el-button>
      <el-input
        v-model="listQuery.channel"
        style="width: 200px;margin: 10px 20px 0px 0px;"
        size="mini"
        class="filter-item"
        placeholder="请输入渠道"
        @change="handleFilter"/>
      <el-input
        v-model="listQuery.ad_id"
        style="width: 200px;margin: 10px 20px 0px 0px;"
        size="mini"
        class="filter-item"
        placeholder="请输入广告位ID"
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
      <el-select
        v-model="listQuery.status"
        size="mini"
        style="width: 200px;margin: 10px 20px 0px 0px;"
        filterable
        class="filter-item"
        placeholder="请选择可搜索"
        @change="handleFilter">
        <el-option key="" label="请选择状态" value="" />
        <el-option key="0" label="启用" value="0" />
        <el-option key="1" label="禁用" value="1" />
      </el-select>

      <!--<el-button-->
      <!--class="filter-item"-->
      <!--style="margin-left: 10px;"-->
      <!--type="info"-->
      <!--icon="el-icon-edit"-->
      <!--size="mini"-->
      <!--@click="openGenerateData">复制口令</el-button>-->
    </div>
    <el-divider/>
    <el-table
      v-loading="listLoading"
      :data="lists"
      class="ratiotable"
      show-header
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="日期" sortable prop="date" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="广告位ID" prop="ad_id" sortable align="center">
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="openDialog(scope.row)">
            {{ scope.row.ad_id }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="计划ID" prop="strategy_id" sortable align="center">
        <template slot-scope="scope">
          {{ scope.row.strategy_id }}
        </template>
      </el-table-column>
      <el-table-column label="计划名称" prop="strategy_name" sortable align="center">
        <template slot-scope="scope">
          {{ scope.row.strategy_name }}
        </template>z
      </el-table-column>
      <el-table-column label="渠道号" prop="channel" sortable align="center">
        <template slot-scope="scope">
          {{ scope.row.channel }}
        </template>
      </el-table-column>
      <el-table-column label="分配数" prop="rate" sortable align="center">
        <template slot-scope="scope">
          {{ scope.row.rate }}
        </template>
      </el-table-column>
      <el-table-column label="广告位" prop="adsense" sortable align="center">
        <template slot-scope="scope">
          {{ scope.row.adsense }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" sortable align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 0" type="success">启用</el-tag>
          <el-tag v-else-if="scope.row.status == 1" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :visible.sync="dialogFormVisible" :title="dialogStatus==='create'?新增口令:'编辑口令'" width="454px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 300px; margin-left:20px;">
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-if="dialogStatus==='create'"
            v-model="temp.date"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期" />
          <span v-else>
            {{ temp.date }}
          </span>
        </el-form-item>
        <el-form-item label="广告ID" prop="ad_id">
          <el-input v-if="dialogStatus==='create'" v-model="temp.ad_id"/>
          <span v-else>
            {{ temp.ad_id }}
          </span>
        </el-form-item>
        <el-form-item label="渠道" prop="channel">
          <el-input v-if="dialogStatus==='create'" v-model="temp.channel"/>
          <span v-else>
            {{ temp.ad_id }}
          </span>
        </el-form-item>
        <el-form-item label="广告位" prop="adsense">
          <el-input v-model="temp.adsense"/>
        </el-form-item>
        <el-form-item label="分配数">
          <el-input v-model="temp.rate"/>
        </el-form-item>
        <el-form-item label="分配数">
          <el-radio-group v-model="temp.status">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?handleCreateData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { commandList, saveCommand } from '@/api/return'
import { getDate } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  name: 'CommandList',
  components: { Pagination },
  data() {
    return {
      lists: [],
      total: 0,
      listQuery: {
        date: [getDate(), getDate(0)],
        channel: '',
        ad_id: '',
        status: ''
      },
      listLoading: false,

      dialogFormVisible: false,
      temp: {
        date: getDate(),
        ad_id: undefined,
        channel: '',
        rate: 100,
        adsense: '',
        status: 0
      },
      dialogStatus: 'edit',
      rules: {
        date: [{ required: true, message: '请选择日期', trigger: 'blur' }],
        ad_id: [{ required: true, message: '请填写广告位', trigger: 'blur' }],
        channel: [{ required: true, message: '请填写渠道', trigger: 'blur' }],
        adsense: [{ required: true, message: '请填写广告位', trigger: 'blur' }],
        rate: [{ required: true, message: '请填写分配数', trigger: 'blur' }],
        status: [{ required: true, message: '请填写状态', trigger: 'blur' }]
      },

      generateDialogFormVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      commandList(this.listQuery).then(response => {
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
      saveCommand(tempData).then(() => {
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
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 重置
    resetTemp() {
      this.temp = {
        date: getDate(),
        ad_id: undefined,
        channel: '',
        rate: 100,
        adsense: '',
        status: 0
      }
    },
    handleCreateData() {
      saveCommand(this.temp).then(() => {
        this.resetTemp()
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    openGenerateData() {
      this.generateDialogFormVisible = true
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
