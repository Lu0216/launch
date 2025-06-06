<template>
  <div class="income_div">
    <div class="income_header">
     <span  class="adname">渠道号：</span>
      <el-input
        v-model="listQuery.src"
        clearable
        class="filter-item select-item"
        placeholder="请输入渠道号"
        @change="handleFilter" />
       <span  class="adname">计划状态：</span>
      <el-select
        v-model="listQuery.status"
        :default-first-option = "true"
        class="filter-item select-item"
        filterable
        placeholder="请选择计划状态"
        @change="handleFilter">
        <el-option label="全部" value=""/>
        <el-option label="投放中" :value="1"/>
        <el-option label="停投" :value="2"/>
      </el-select>
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
        <el-button class="add_income" type="primary" icon="el-icon-add" @click="addDialog">批量操作</el-button>
    </div>
     <el-card shadow="never">
      <TableColumns
        :dataSource="tableData"
        :total="total"
        :listLoading="listLoading"
        :columns="columns"
        :currentPage="listQuery.page"
        :pageSize="listQuery.pagesize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      >
      </TableColumns>
    </el-card>
    <Edit 
      :dialogType="dialogType"
      :initData="initData"
      :projectsList="projectsList" 
      :dialogFormVisible="dialogFormVisible_add"
      :btnloading="btnloading"
      @updateImportvisible="updateImportvisible"
      @batchChannel="batchChannel"
    />
  </div>
</template>
<script>
import { searchList, batch, enable, disabled } from '@/api/stoppackage'
import { getProjectList } from '@/api/dynamic/public'
import TableColumns from '@/components/Eltable/index'
import Edit from  './components/Edit'

export default {
  name: 'Stopchannelpackage',
  components: { TableColumns, Edit },
  data() {
    return {
      dialogFormVisible_add:false,
      dialogType:'add',
      listLoading: false,
      disabledbtn: false,
      selectedId: '',
      tableData: [],
      projectsList: [],
      agentList: [],
      mediaList: [],
      total: 0,
      initData:{},
      listQuery: {
        proj_id:'',
        status:'',
        src:'',
        page: 1,
        pagesize: 20
      },
      btnloading : false,
      columns: [
        {
          prop: 'proj', 
          label: '项目', 
          align: 'center' 
        },
        {
          prop: 'media', 
          label: '媒体', 
          align: 'center' 
        },
        {
          prop: 'opti', 
          label: '优化代理', 
          align: 'center' 
        },
        {
          prop: 'src', 
          label: '渠道号', 
          align: 'center' 
        },
        {
          prop: 'media_account_child', 
          label: '子账号', 
          align: 'center' 
        },
        {
          prop: 'campaign_name', 
          label: '计划名称', 
          align: 'center' 
        },
        {
          prop: 'status', 
          label: '当前计划状态', 
          align: 'center',
          render:(h,params) => {
             return (<span>{params.row.status == 1 ? '投放中':'停投'}</span>)
          }
        },
         {
          prop: 'operation_at', 
          label: '操作时间', 
          align: 'center' 
        },
        {
          prop: 'operate', 
          label: '操作', 
          align: 'center', 
          render: (h, params) => {
            return (
                <div>
                    <el-button type="danger" loading={this.disabledbtn && params.row.detail_id === this.selectedId} disabled={params.row.status == 2} onClick={() => this.disabled(params.row)}>停投</el-button>
                </div>
            )
          }

        }
      ]
    }
  },
  created() {
    this.getList()
    this.getProjectList()
  },
  methods: {
    // 筛选
    handleFilter (value) {
      const { listQuery } = this
      listQuery.page = 1
      this.getList()
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
      this.listLoading = true
      let datasrc = this.listQuery;
      searchList(datasrc).then((data) => {
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
    addDialog(){
      this.dialogFormVisible_add = true
    },
    // 新增编辑弹窗显示隐藏
    updateImportvisible(val){
      this.dialogFormVisible_add = val
    },
    // 保存
    batchChannel(datasrc){
       this.btnloading = true
       batch(datasrc).then((data) => {
        if (data.error_code === 0) {
          this.$message({
            type: 'success',
            message: data.meta || '批量操作成功!'
          })
          this.getList()
        } else {
          this.$message({
            type: 'error',
            message: data.error_message || '批量操作失败!'
          })
        }
        this.dialogFormVisible_add = false
        this.btnloading = false
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '批量操作失败!'
        })
        this.dialogFormVisible_add = false
        this.btnloading = false
      })
    },
    // 开启投放
    enable(datasrc){
      enable({id:datasrc.detail_id}).then((data) => {
        if (data.error_code === 0) {
          this.$message({
            type: 'success',
            message: '开启投放成功!'
          })
          this.getList()
        } else {
          this.$message({
            type: 'error',
            message: '开启投放失败!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '开启投放失败!'
        })
      })
    },
    // 关闭投放
    disabled(datasrc){
      this.disabledbtn = true
      this.selectedId = datasrc.detail_id
      disabled({id:datasrc.detail_id}).then((data) => {
        if (data.error_code === 0) {
          this.$message({
            type: 'success',
            message: '关闭投放成功!'
          })
          this.getList()
        } else {
          this.$message({
            type: 'error',
            message: '关闭投放失败!'
          })
        }
        this.disabledbtn = false
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '关闭投放失败!'
        })
        this.disabledbtn = false
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
    },
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
