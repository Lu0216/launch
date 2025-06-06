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
      <span  class="adname">批次id：</span>
      <el-input
        v-model="listQuery.batch_id"
        clearable
        class="filter-item select-item"
        placeholder="请输入批次id"
        @change="handleFilter" />
      <span class="adname">操作人：</span>
      <el-input
        v-model="listQuery.operation"
        clearable
        class="filter-item select-item"
        placeholder="请输入操作人"
        @change="handleFilter" />
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
  </div>
</template>
<script>
import { groupList } from '@/api/stoppackage'
import { getProjectList } from '@/api/dynamic/public'
import TableColumns from '@/components/Eltable/index'

export default {
  name: 'Packagegroup',
  components: { TableColumns },
  data() {
    return {
      listLoading: true,
      tableData: [],
      projectsList: [],
      total: 0,
      listQuery: {
        proj_id:'',
        status:'',
        batch_id:'',
        operation:'',
        page: 1,
        pagesize: 20
      },
      btnloading : false,
      columns: [
        {
          prop: 'batch_id', 
          label: '批次id', 
          align: 'center' 
        },
        {
          prop: 'proj', 
          label: '项目', 
          align: 'center' 
        },
        {
          prop: 'operate_num', 
          label: '操作个数', 
          align: 'center' 
        },
        {
          prop: 'finish_num', 
          label: '完成个数', 
          align: 'center' 
        },
        {
          prop: 'success_num', 
          label: '成功个数', 
          align: 'center' 
        },
         {
          prop: 'failure_num', 
          label: '失败个数', 
          align: 'center' 
        },
         {
          prop: 'operation', 
          label: '操作人', 
          align: 'center' 
        },
        {
          prop: 'operation_state', 
          label: '操作类型', 
          align: 'center',
          render:(h,params) => {
             return (<span>{params.row.operation_state == 1 ? '投放':'停投'}</span>)
          }
        },
        {
          prop: 'process_state', 
          label: '处理状态', 
          align: 'center',
          render:(h,params) => {
            let a = '未知'
            if(params.row.process_state == 1){
              a = '待处理'
            }else if(params.row.process_state == 2){
              a = '处理中'
            }else if(params.row.process_state == 3){
              a = '已处理'
            }
             return (<span>{a}</span>)
          }
        },
        {
          prop: 'operation_at', 
          label: '操作时间', 
          align: 'center' 
        },
        {
          prop: 'finish_at', 
          label: '完成时间', 
          align: 'center' 
        },
        {
          prop: 'operate', 
          label: '操作', 
          align: 'center', 
          render: (h, params) => {
            return (
                <div>
                    <el-button type="primary" onClick={() => this.showdetail(params.row)}>查看</el-button>
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
      let datasrc = this.listQuery;
      groupList(datasrc).then((data) => {
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
    showdetail(row){
      this.$router.push({name:'packagedetail',params:{batch_id:row.batch_id}})
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
