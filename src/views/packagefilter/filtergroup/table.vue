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
      <span class="adname">媒体：</span>
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
      <span class="adname">是否关键行为：</span>
      <el-select
        v-model="listQuery.is_tags"
        :default-first-option = "true"
        class="filter-item select-item"
        filterable
        placeholder="请选择媒体"
        @change="handleFilter">
        <el-option label="全部" value=""/>
        <el-option  label="是" :value="1"/>
        <el-option  label="否" :value="2"/>
      </el-select>
      <span class="adname">策略名称：</span>
      <el-select
        v-model="listQuery.package_filter_id"
        :default-first-option = "true"
        class="filter-item select-item"
        filterable
        placeholder="请选择媒体"
        @change="handleFilter">
        <el-option label="全部" value=""/>
        <el-option v-for="(item) in packagefilterList" :key="item.id" :label="item.package_filter_name" :value="item.id"/>
      </el-select>
      <span class="adname">渠道号：</span>
      <el-input v-model="listQuery.src" class="filter-item select-item" clearable placeholder="请输入渠道号" @change="handleFilter" />
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
    <Add 
      v-if="dialogFormVisible_add"
      :projectsList="projectsList" 
      :mediaList="mediaList"
      :dialogFormVisible="dialogFormVisible_add"
      :btnloading="btnloading"
      @updateImportvisible="updateImportvisible"
      @groupAdd="groupAdd"
    />
    <Edit 
      v-if="dialogFormVisible_edit"
      :initData="initData"
      :dialogFormVisible="dialogFormVisible_edit"
      :btnloading="btnloading_edit"
      @updateEditvisible="updateEditvisible"
      @groupEdit="groupEdit"
    />
  </div>
</template>
<script>
import { getGroupList, selectNameList, groupAdd, groupEdit } from '@/api/packagefilter'
import { getProjectList, getMediaList } from '@/api/dynamic/public'
import TableColumns from '@/components/Eltable/index'
import Add from  './components/add'
import Edit from  './components/edit'

export default {
  name: 'Stopchannelpackage',
  components: { TableColumns, Add, Edit },
  data() {
    return {
      dialogFormVisible_add:false,
      dialogFormVisible_edit:false,
      dialogType:'add',
      listLoading: false,
      disabledbtn: false,
      selectedId: '',
      tableData: [],
      projectsList: [],
      mediaList: [],
      packagefilterList:[],
      total: 0,
      initData:{},
      listQuery: {
        proj_id:'',
        package_filter_id:'',
        is_tags:'',
        media_id:'',
        src:'',
        page: 1,
        pagesize: 20
      },
      btnloading : false,
      btnloading_edit:false,
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
          prop: 'media', 
          label: '媒体', 
          align: 'center' 
        },
        {
          prop: 'is_tags', 
          label: '是否为关键行为', 
          align: 'center',
          render:(h,params) => {
             return (<span>{params.row.is_tags == 1 ? '是':'否'}</span>)
          }
        },
        {
          prop: 'src', 
          label: '渠道号', 
          align: 'center' 
        },
        {
          prop: 'package_filter_name', 
          label: '筛包策略组名称', 
          align: 'center' 
        },
         {
          prop: 'status', 
          label: '状态', 
          align: 'center',
          render:(h,params) => {
             return (<span>{params.row.status == 1 ? '启用':'停用'}</span>)
          }
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
                    <el-button type="primary" disabled={params.row.status == 2} onClick={() => this.editDialog(params.row)}>编辑</el-button>
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
    this.getMediaList()
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
      getGroupList(datasrc).then((data) => {
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
    editDialog(row){
        this.initData = row
        this.dialogFormVisible_edit = true
    },
    // 新增弹窗显示隐藏
    updateImportvisible(val){
      this.dialogFormVisible_add = val
    },
    // 编辑弹窗显示隐藏
    updateEditvisible(val){
      this.dialogFormVisible_edit = val
    },
    // 保存
    groupAdd(datasrc){
       this.btnloading = true
       groupAdd(datasrc).then((data) => {
        if (data.error_code === 0) {
          this.$message({
            type: 'success',
            message: data.error_message || '保存成功!'
          })
          this.dialogFormVisible_add = false
          this.getList()
        } else {
          this.$message({
            type: 'error',
            message: data.error_message || '保存失败!'
          })
        }
        this.btnloading = false
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '保存失败!'
        })
        this.btnloading = false
      })
    },
    // 保存
    groupEdit(datasrc){
       this.btnloading_edit = true
       groupEdit(datasrc).then((data) => {
        if (data.error_code === 0) {
          this.$message({
            type: 'success',
            message: data.error_message || '保存成功!'
          })
          this.dialogFormVisible_edit = false
          this.getList()
        } else {
          this.$message({
            type: 'error',
            message: data.error_message || '保存失败!'
          })
        }
        this.btnloading_edit = false
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '保存失败!'
        })
        this.btnloading_edit = false
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
