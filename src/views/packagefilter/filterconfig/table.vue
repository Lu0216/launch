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
       <span  class="adname">策略名称：</span>
      <el-select
        v-model="listQuery.package_filter_id"
        :default-first-option = "true"
        class="filter-item select-item"
        filterable
        placeholder="请选择策略名称"
        @change="handleFilter">
        <el-option label="全部" value=""/>
        <el-option v-for="(item) in packagefilterList" :key="item.id" :label="item.package_filter_name" :value="item.id"/>
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
    <Batch 
      :initData="initData"
      :projectsList="projectsList" 
      :dialogFormVisible="dialogFormVisible_add"
      :btnloading="btnloading"
      @updateImportvisible="updateImportvisible"
      @batchConfig="batchConfig"
    />
  </div>
</template>
<script>
import { getList, selectNameList, batch, enable, disabled } from '@/api/packagefilter'
import { getProjectList } from '@/api/dynamic/public'
import { getToken } from '@/utils/auth'
import TableColumns from '@/components/Eltable/index'
import Batch from  './components/batch'

export default {
  name: 'Filterconfig',
  components: { TableColumns, Batch },
  data() {
    return {
      dialogFormVisible_add:false,
      listLoading: false,
      btnloading : false,
      tableData: [],
      projectsList: [],
      packagefilterList: [],
      total: 0,
      initData:{},
      listQuery: {
        proj_id:'',
        package_filter_id:'',
        page: 1,
        pagesize: 20
      },
      columns: [
        {
          prop: 'id', 
          label: '序号', 
          align: 'center' 
        },
        {
          prop: 'proj', 
          label: '项目', 
          align: 'center' 
        },
        {
          prop: 'package_filter_name', 
          label: '策略名称', 
          align: 'center' 
        },
        {
          prop: 'updated_at', 
          label: '更新时间', 
          align: 'center' 
        },
        {
          prop: 'operation', 
          label: '操作人', 
          align: 'center' 
        },
        {
          prop: 'operate', 
          label: '操作', 
          align: 'center', 
          render: (h, params) => {
            return (
                <div>
                    <el-button type="primary" onClick={() => this.showDetail(params.row)}>查看详情</el-button>
                    <el-button type="primary" onClick={() => this.download(params.row)}>下载文件</el-button>
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
    this.selectNameList()
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
    selectNameList(){
        selectNameList().then((data) => {
            if (data.error_code === 0) {
                this.packagefilterList = data.data
            }
        }).catch(() => {
            this.$message({
                message: '加载策略名称失败',
                type: 'error'
            })
        })
    },
    // 获取列表数据
    getList() {
      this.listLoading = true
      let datasrc = this.listQuery;
      getList(datasrc).then((data) => {
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
    batchConfig(datasrc){
       this.btnloading = true
       batch(datasrc).then((data) => {
        if (data.error_code === 0) {
          this.$message({
            type: 'success',
            message: data.error_message || '批量操作成功!'
          })
          this.dialogFormVisible_add = false
          this.getList()
        } else {
          this.$message({
            type: 'error',
            message: data.error_message || '批量操作失败!'
          })
        }
        this.btnloading = false
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '批量操作失败!'
        })
        this.btnloading = false
      })
    },
    // 查看详情
    showDetail(row){
        this.$router.push({ path: '/filterconfigdetail', query:{id:row.id,proj_id:row.proj_id} })
    },
    // 批量下载按钮点击
    download(row) {
     const baseUrl = process.env.BASE_API;
     const token = getToken();
     let url = `${baseUrl}/api/package_filter/download?package_filter_id=${row.id}&token=${token}`
     window.open(url);
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
