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
      <span  class="adname">批次id：</span>
      <el-input
        v-model="listQuery.batch_id"
        clearable
        class="filter-item select-item"
        placeholder="请输入批次id"
        @change="handleFilter" />
      <span  class="adname">渠道号：</span>
      <el-input
        v-model="listQuery.src"
        clearable
        class="filter-item select-item"
        placeholder="请输入渠道号"
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
import { detailList } from '@/api/stoppackage'
import { getProjectList, getMediaList } from '@/api/dynamic/public'
import TableColumns from '@/components/Eltable/index'

export default {
  name: 'Packagegroup',
  components: { TableColumns },
  data() {
    return {
      listLoading: true,
      tableData: [],
      projectsList: [],
      mediaList: [],
      total: 0,
      listQuery: {
        proj_id:'',
        media_id:'',
        batch_id:'',
        src:'',
        operation:'',
        page: 1,
        pagesize: 20
      },
      btnloading : false,
      columns: [
        {
          prop: 'detail_id', 
          label: '明细id', 
          align: 'center' 
        },
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
          prop: 'media', 
          label: '媒体', 
          align: 'center' 
        },
        {
          prop: 'src', 
          label: '渠道号', 
          align: 'center' 
        },
        {
          prop: 'media_account', 
          label: '主账号', 
          align: 'center' 
        },
         {
          prop: 'media_account_child', 
          label: '子账号', 
          align: 'center' 
        },
        {
          prop: 'opti', 
          label: '优化代理', 
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
          prop: 'is_success', 
          label: '是否成功', 
          align: 'center',
          render:(h,params) => {
             return (<span>{params.row.is_success == 1 ? '成功':'失败'}</span>)
          }
        },
        {
          prop: 'operation', 
          label: '操作人', 
          align: 'center' 
        },
        {
          prop: 'campaign_name', 
          label: '广告组名称', 
          align: 'center' 
        },
        {
          prop: 'status', 
          label: '当前广告组状态', 
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
          prop: 'finish_at', 
          label: '完成时间', 
          align: 'center' 
        }
      ]
    }
  },
  created() {
    this.listQuery.batch_id = this.$route.params.batch_id || ''
    this.getList()
    this.getProjectList()
    this.getMediaList()
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
    // 获取列表数据
    getList() {
      let datasrc = this.listQuery;
      detailList(datasrc).then((data) => {
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
