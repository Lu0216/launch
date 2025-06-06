<template>
  <div class="income_div">
    <div class="income_header">
     <span  class="adname">代理：</span>
      <el-select
        v-model="listQuery.opti_id"
        :default-first-option = "true"
        class="filter-item select-item"
        filterable
        placeholder="请选择代理"
        @change="handleFilter">
        <el-option label="全部" value=""/>
        <el-option v-for="(item) in agentList" :key="item.id" :label="item.short_name" :value="item.id"/>
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
        <el-button class="add_income" type="primary" icon="el-icon-add" @click="addDialog">添加</el-button>
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
      :addDialogType="addDialogType"
      :initData="initData"
      :projectsList="projectsList" 
      :mediaList="mediaList"
      :agentList="agentList"
      :dialogFormVisible="dialogFormVisible_add"
      :btnloading="btnloading"
      @updateAddvisible="updateAddvisible"
      @saveAgent="saveAgent"
    />
  </div>
</template>
<script>
import { getAgentList, addAgent, editAgent } from '@/api/backhaul/agent'
import { getAgent, getMediaList, getProjectList } from '@/api/dynamic/public'
import TableColumns from '@/components/Eltable/index'
import Edit from  './components/Edit'

export default {
  name: 'Income',
  components: { TableColumns, Edit },
  data() {
    return {
      dialogFormVisible_add:false,
      addDialogType:'add',
      listLoading: true,
      tableData: [],
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
          prop: 'ratio', 
          label: '概率', 
          align: 'center',
          render:(h,params) => {
             return (<span>{params.row.ratio + '%'}</span>)
          }
        },
         {
          prop: 'operator', 
          label: '操作人', 
          align: 'center' 
        },
         {
          prop: 'updated_at', 
          label: '操作时间', 
          align: 'center' 
        },
        {
          prop: 'operate', 
          label: '操作', 
          align: 'center', 
          render: (h, params) => {
            return (<el-button type="primary" onClick={() => this.editDialog(params.row)}>编辑</el-button>)
          }

        }
      ]
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
      getAgentList(datasrc).then((data) => {
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
    // 编辑按钮点击
    editDialog(item){
      this.dialogFormVisible_add = true
      this.initData = item
      this.addDialogType = 'edit'
    },
    // 新增按钮点击
    addDialog(){
      this.dialogFormVisible_add = true
      this.initData = {}
      this.addDialogType = 'add'
    },
    // 新增编辑弹窗显示隐藏
    updateAddvisible(val){
      console.log(val,'val');
      this.dialogFormVisible_add = val
    },
    // 保存
    saveAgent(datasrc){
       this.btnloading = true
       if(this.addDialogType === 'add'){
        this.addAgent(datasrc)
      }else{
        this.editAgent(datasrc)
      }
    },
    // 编辑保存
    editAgent(datasrc){
      editAgent(datasrc).then((data) => {
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
        this.dialogFormVisible_add = false
        this.btnloading = false
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '编辑失败!'
        })
        this.dialogFormVisible_add = false
        this.btnloading = false
      })
    },
    // 批量新增保存
    addAgent(datasrc){
      addAgent(datasrc).then((data) => {
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
        this.btnloading = false
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '新增失败!'
        })
        this.dialogFormVisible_add = false
        this.btnloading = false
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
