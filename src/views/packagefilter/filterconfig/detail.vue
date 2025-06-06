<template>
  <div class="income_div">
    <div class="income_header">
        <!-- <div>
            <el-button class="add_income" type="info" icon="el-icon-add" @click="goBack">返回上一页</el-button>
        </div> -->
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
       <span  class="adname">筛包类型：</span>
      <el-select
        v-model="listQuery.mold"
        :default-first-option = "true"
        class="filter-item select-item"
        filterable
        placeholder="请选择筛包类型"
        @change="handleFilter">
        <el-option label="全部" value=""/>
        <el-option v-for="(item,index) in allType" :key="index" :label="item" :value="item"/>
      </el-select>
      <span  class="adname">筛包结论：</span>
      <el-select
        v-model="listQuery.result"
        :default-first-option = "true"
        class="filter-item select-item"
        filterable
        placeholder="请选择筛包结论"
        @change="handleFilter">
        <el-option label="全部" value=""/>
        <el-option v-for="(item,index) in allResult" :key="index" :label="item" :value="item"/>
      </el-select>
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
import { detailList, selectNameList, selectTypeList, selectResultsList } from '@/api/packagefilter'
import { getProjectList } from '@/api/dynamic/public'
import TableColumns from '@/components/Eltable/index'

export default {
  name: 'Filterconfigdetail',
  components: { TableColumns },
  data() {
    return {
      dialogFormVisible_add:false,
      listLoading: false,
      tableData: [],
      projectsList: [],
      packagefilterList: [],
      allType:[],
      allResult:[],
      total: 0,
      listQuery: {
        proj_id:'',
        package_filter_id:'',
        mold:'',
        result:'',
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
          prop: 'package_filter_name', 
          label: '策略名称', 
          align: 'center' 
        },
         {
          prop: 'mold', 
          label: '筛包类型', 
          align: 'center' 
        },
         {
          prop: 'result', 
          label: '筛包结论', 
          align: 'center' 
        },
         {
          prop: 'condition', 
          label: '判断条件', 
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
        }
      ]
    }
  },
  created() {
    this.listQuery.package_filter_id = this.$route.query.id || ''
    this.listQuery.proj_id = this.$route.query.proj_id || ''
    this.getList()
    this.getProjectList()
    this.selectNameList()
    this.selectTypeList()
    this.selectResultsList()
  },
  methods: {
    // 筛选
    handleFilter (value) {
      const { listQuery } = this
      listQuery.page = 1
      this.getList()
    },
    // 项目列表
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
    // 策略名称列表
    selectNameList(){
        selectNameList().then((data) => {
            if (data.error_code === 0) {
                this.packagefilterList = data.data
            }
        }).catch(() => {
            this.$message({
                message: '加载项目失败',
                type: 'error'
            })
        })
    },
    // 筛包类型列表
    selectTypeList(){
        selectTypeList().then((data) => {
            if (data.error_code === 0) {
                this.allType = data.data
            }
        }).catch(() => {
            this.$message({
                message: '加载项目失败',
                type: 'error'
            })
        })
    },
    // 筛包结论列表
    selectResultsList(){
        selectResultsList().then((data) => {
            if (data.error_code === 0) {
                this.allResult = data.data
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
