<template>
  <div class="income_div">
    <div class="income_header">
     <span  class="adname">项目：</span>
      <el-select
        v-model="listQuery.proj_id"
        :default-first-option = "true"
        class="filter-item select-item"
        filterable
        placeholder="请选择项目"
        @change="handleFilter">
        <el-option label="全部" value=""/>
        <el-option v-for="(item) in projectsList" :key="item.id" :label="item.app_name" :value="item.id"/>
      </el-select>
       <span  class="adname">媒体：</span>
      <el-select
        v-model="listQuery.media_id"
        :default-first-option = "true"
        class="filter-item select-item"
        filterable
        placeholder="请选择媒体"
        @change="handleFilter">
        <el-option label="全部" value=""/>
        <el-option v-for="(item) in mediaList" :key="item.id" :label="item.name_cn" :value="item.id"/>
      </el-select>
        <span  class="adname">渠道号：</span>
        <el-input size="small" @change="handleFilter" class="filter-item select-item" v-model="listQuery.src" clearable placeholder="请输入渠道号" />
       <span  class="adname">优化代理：</span>
      <el-select
        v-model="listQuery.agency_opti_id"
        :default-first-option = "true"
        class="filter-item select-item"
        filterable
        placeholder="请选择优化代理"
        @change="handleFilter">
        <el-option label="全部" value=""/>
        <el-option v-for="(item) in agentList" :key="item.id" :label="item.short_name" :value="item.id"/>
      </el-select>
        <span  class="adname">计划id：</span>
        <el-input size="small" @change="handleFilter" class="filter-item select-item" v-model="listQuery.unit_id" clearable placeholder="请输入计划id" />
         <span  class="adname">是否复制计划：</span>
      <el-select
        v-model="listQuery.is_copy"
        :default-first-option = "true"
        class="filter-item select-item"
        filterable
        placeholder="请选择是否复制计划"
        @change="handleFilter">
        <el-option label="全部" value=""/>
        <el-option label="是" value="1"/>
        <el-option label="否" value="2"/>
      </el-select>
         <el-button class="add_income" type="primary" icon="el-icon-plus" @click="addDialog">添加</el-button>
        <el-button class="add_income" type="primary" icon="el-icon-folder-add" @click="importDialog">批量添加</el-button>
        <el-button class="add_income" type="primary" icon="el-icon-edit" @click="chooseTable()">批量删除</el-button>
    </div>
     <el-card shadow="never">
       <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          border="border"
          v-loading="listLoading"
          highlight-current-row
          >
         
          <el-table-column
            header-align="center"
            align="center"
            prop="app_name"
            label="项目"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="media"
            label="媒体"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="src"
            label="渠道号"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="agency_opti"
            label="优化代理"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="unit_id"
            label="计划id"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="unit_name"
            label="计划名称"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="ratio"
            label="概率"
          >
            <template slot-scope="scope">
              <span>{{scope.row.ratio + '%'}}</span>
            </template>
          </el-table-column >
           <el-table-column
            header-align="center"
            align="center"
            prop="advertis_ratio"
            label="转化回传概率"
          >
            <template slot-scope="scope">
              <span>{{scope.row.advertis_ratio + '%'}}</span>
            </template>
          </el-table-column >
           <el-table-column
            header-align="center"
            align="center"
            prop="advertis_ratio"
            label="是否复制计划"
          >
            <template slot-scope="scope" >
              <span v-if="scope.row.is_copy == 1">是</span>
              <span v-else-if="scope.row.is_copy == 2">否</span>
            </template>
          </el-table-column >
          <el-table-column
            header-align="center"
            align="center"
            prop="operator"
            label="操作人"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="operator_at"
            label="操作时间"
          >
          </el-table-column>
          <el-table-column
            prop="operate"
            label="操作"
            header-align="center"
            align="center"
            width="200"
            >
            <template slot-scope="scope">
             <el-button type="primary" @click="editDialog(scope.row)">编辑</el-button>
             <el-button type="primary" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination align="center" v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pagesize" @pagination="getList" />
    </el-card>
    <el-dialog :visible.sync="deleteVisible" title="提示">
      <div>确定要将该计划的此条配置删除吗？</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="deletePlan()">确 定</el-button>
      </div>
    </el-dialog>
    <Add
      :dialogFormVisible="dialogFormVisible_add"
      @updateAddvisible="updateAddvisible"
      @addPlan="addPlan"
    />
     <Edit
      :dialogFormVisible="dialogFormVisible_edit"
      :initData="initData"
      @updateEditvisible="updateEditvisible"
      @editPlan="editPlan"
    />
    <Batch 
      :dialogFormVisible="dialogFormVisible_batch" 
      @updateImportvisible="updateImportvisible"
      @batchPlan="batchPlan" 
    />
    <Delete 
      :dialogFormVisible="dialogFormVisible_batchDelete" 
      @updateImportDeletevisible="updateImportDeletevisible"
      @deletePlans="deletePlans" 
    />
  </div>
</template>
<script>

import Pagination from '@/components/Pagination'
import { getPlanList, addPlan, batchPlan, editPlan, deletePlans, deletePlan } from '@/api/backhaul/plan'
import { getAgent, getMediaList, getProjectList } from '@/api/dynamic/public'
import Add from  './components/Add'
import Edit from  './components/Edit'
import Batch from  './components/Batch'
import Delete from  './components/Delete'

export default {
  name: 'Income',
  components: { Pagination, Add, Edit, Batch, Delete },
  data() {
    return {
      dialogFormVisible_add: false,
      dialogFormVisible_edit:false,
      dialogFormVisible_batch:false,
      dialogFormVisible_batchDelete:false,
      deleteVisible:false,
      listLoading: true,
      tableData: [],
      multipleSelection:[],
      multipleSelectionChannel:'',
      projectsList: [],
      agentList: [],
      mediaList: [],
      total: 0,
      initData:{},
      listQuery: {
        proj_id:'',
        media_id:'',
        opti_id:'',
        src:'',
        is_copy:'',
        agency_opti_id:'',
        unit_id:'',
        page: 1,
        pagesize: 20
      }
    }
  },
  created() {
    this.getList()
    this.getAgent()
    this.getMediaList()
    this.getProjectList()
  },
  methods: {
    // 筛选
    handleFilter (value) {
      const { listQuery } = this
      listQuery.page = 1
      this.getList()
    },
    // 单条删除
    handleDelete(val) {
      this.deleteVisible = true
      this.multipleSelection = val.unit_id
      this.multipleSelectionChannel = val.unit_id
    },
    // 批量操作
    chooseTable(){
     this.dialogFormVisible_batchDelete = true
    },
    deletePlan(){
      let params={
        unit_id:this.multipleSelection
      }
       deletePlan(params).then((data) => {
          if (data.error_code === 0) {
            this.deleteVisible = false
            this.$message.success('删除成功')
            this.getList()
          } else {
            this.$message.success(data.error_message)
          }
        })
    },
    getAgent(){
      getAgent().then((data) => {
        if (data.error_code === 0) {
          this.agentList = data.data
        }
      }).catch(() => {
        this.$message({
          message: '加载代理失败',
          type: 'error'
        })
      })
    },
    getMediaList(){
      getMediaList().then((data) => {
        if (data.error_code === 0) {
          this.mediaList = data.data
        }
      }).catch(() => {
        this.$message({
          message: '加载媒体失败',
          type: 'error'
        })
      })
    },
    getProjectList(){
      getProjectList().then((data) => {
        if (data.error_code === 0) {
          this.projectsList = data.data
        }
      }).catch(() => {
        this.$message({
          message: '加载项目失败',
          type: 'error'
        })
      })
    },
    // 获取列表数据
    getList() {
      let datasrc = this.listQuery;
      getPlanList(datasrc).then((data) => {
        if (data.error_code === 0) {
          this.total = data.meta.total
          this.tableData = data.data
          this.listLoading = false
        }
      }).catch(() => {
        this.$message({
          message: '加载失败',
          type: 'error'
        })
      })
    },
    // 新增按钮点击
    addDialog(){
      this.dialogFormVisible_add = true
      this.initData = {}
    },
    // 编辑按钮点击
    editDialog(item){
      this.dialogFormVisible_edit = true
      this.initData = item
    },
    // 批量新增按钮点击
    importDialog(){
      this.dialogFormVisible_batch = true
    },
    //新增弹窗显示隐藏
    updateAddvisible(val){
      this.dialogFormVisible_add = val
    },
    // 编辑弹窗显示隐藏
    updateEditvisible(val){
      this.dialogFormVisible_edit = val
    },
    // 批量新增弹窗显示隐藏
    updateImportvisible(val){
      this.dialogFormVisible_batch = val
    },
     // 批量删除弹窗显示隐藏
    updateImportDeletevisible(val){
      this.dialogFormVisible_batchDelete = val
    },
    // 新增保存
    addPlan(datasrc){
      addPlan(datasrc).then((data) => {
        if (data.error_code === 0) {
          this.$message({
            type: 'success',
            message: '新增成功!'
          })
          this.getList()
        } else {
          this.$message({
            type: 'error',
            message: '新增失败!'
          })
        }
        this.dialogFormVisible_add = false
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '新增失败!'
        })
        this.dialogFormVisible_add = false
      })
    },
    // 编辑保存
    editPlan(datasrc){
      editPlan(datasrc).then((data) => {
        if (data.error_code === 0) {
          this.$message({
            type: 'success',
            message: '编辑成功!'
          })
          this.getList()
        } else {
          this.$message({
            type: 'error',
            message: '编辑失败!'
          })
        }
        this.dialogFormVisible_edit = false
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '编辑失败!'
        })
        this.dialogFormVisible_edit = false
      })
    },
    // 批量新增保存
    batchPlan(datasrc){
      batchPlan(datasrc).then((data) => {
        if (data.error_code === 0) {
          this.$message({
            type: 'success',
            message: '批量新增成功!'
          })
          this.getList()
        } else {
          this.$message({
            type: 'error',
            message: '批量新增失败!'
          })
        }
        this.dialogFormVisible_batch = false
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '批量新增失败!'
        })
        this.dialogFormVisible_batch = false
      })
    },
    // 批量删除保存
    deletePlans(datasrc){
      deletePlans(datasrc).then((data) => {
        if (data.error_code === 0) {
          this.$message({
            type: 'success',
            message: '批量删除成功!'
          })
          this.getList()
        } else {
          this.$message({
            type: 'error',
            message: '批量删除失败!'
          })
        }
        this.dialogFormVisible_batchDelete = false
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '批量删除失败!'
        })
        this.dialogFormVisible_batchDelete = false
      })
    },
    // 分页- pagesize
    handleSizeChange (val) {
      const { listQuery } = this
      listQuery.pagesize = val
      listQuery.page = 1
      this.getList()
    },
    // 分页- page
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    }
  }
}
</script>
<style>
.el-dialog{
    width:550px;
}
.income_div{
    padding: 10px 20px 20px 20px;
}
.income_header{
  margin-bottom:20px;
}
.incometable{
    border:none;
    border-left:1px solid #ebeef5;
    margin-top:20px;
}
.incometable::before{
    height: 0px;
}
.incometable .el-table__header{
    border-top:1px solid #ebeef5;
}
.incometable .el-table__body-wrapper{
    max-height: 600px;
    overflow-y: auto;
}
.income_div .el-dialog__header{
    border-bottom:1px solid #ebeef5;
}
.income_select{
    width:200px;
    margin-left:10px;
  }
 .adname{
   font-size:14px;
   margin-left:10px;
  }
.select-item{
  width:150px;margin: 10px 20px 0px 0px;
}
</style>
