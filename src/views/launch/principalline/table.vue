<template>
  <div class="income_div">
    <div class="income_header">
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
      <span  class="adname">渠道号：</span>
        <el-input size="small" @change="handleFilter" class="filter-item select-item" v-model="listQuery.channel" clearable placeholder="请输入渠道号" />
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
import { getMediaList, getProjectList } from '@/api/dynamic/public'
import { getList} from '@/api/principalline'
import TableColumns from '@/components/Eltable/index'
import { getToken } from '@/utils/auth'

export default {
  name: 'Income',
  components: { TableColumns, },
  data() {
    return {
      dialogFormVisible_add: false,
      listLoading: false,
      btnloading:false,
      addDialogType:'add',
      tableData: [],
      projectsList: [],  //项目
      mediaList: [],  //媒体
      total: 0,
      initData:{},
      listQuery: {
        proj_id:'',
        media_id:'',
        channel:'',
        page: 1,
        pagesize: 20,
      },
      columns: [
        {
          prop: 'project_name', 
          label: '项目', 
          align: 'center' 
        },
        {
          prop: 'media_name', 
          label: '媒体', 
          align: 'center' 
        },
        {
          prop: 'channel', 
          label: '渠道号', 
          align: 'center' 
        },
        {
          prop: 'package_download_url', 
          label: '主线包下载链接', 
          align: 'center',
          render:(h,params) => {
              return (<el-tooltip placement="top" >
              <div slot="content" style="width:300px;">{params.row.package_download_url}</div>
              <div style="width:100px;white-space:nowrap;text-overflow:ellipsis;verflow:hidden;">{params.row.package_download_url}</div>
            </el-tooltip>)
          }
        },
        {
          prop: 'operator_at', 
          label: '操作时间', 
          align: 'center' 
        },
        // {
        //   prop: 'operate', 
        //   label: '操作', 
        //   align: 'center', 
        //   render: (h, params) => {
        //     return (<el-button type="primary" disabled={params.row.package_download_url == ''} onClick={() => this.editDialog(params.row)}>复制下载链接</el-button>)
        //   }

        // }
      ]
    }
  },
  created() {
    this.getList()
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
    // 获取媒体 -- 下拉
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
    // 获取 项目 -- 下拉
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
      this.listLoading = true
      getList(datasrc).then((data) => {
        if (data.error_code === 0) {
          this.total = data.meta.total
          this.tableData = data.data
          this.listLoading = false
        }
      }).catch(() => {
        this.listLoading = false
        this.$message({
          message: '加载失败',
          type: 'error'
        })
      })
    },
    // 复制下载链接
    editDialog(params){
    //   this.dialogFormVisible_add = true
    //   this.addDialogType = 'edit',
      console.log('复制复制复制');
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
.date-item{
  margin: 10px 20px 0px 0px;
}
</style>
