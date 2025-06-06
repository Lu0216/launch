<template>
  <div class="income_div">
    <div class="income_header">
      <div class="search-box">
          <el-input size="small" class="filter-item select-item" v-model="search.src" clearable placeholder="请输入渠道号" @change="changeSrc"/>
          <el-button  class="add_income" @click="handleSearch" type="primary">搜索</el-button>
          <span class="adname">概率设置来自： {{search.from}}</span>
          <span class="adname">概率： {{search.ratio}}</span>
      </div>
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
        <span  class="adname">渠道号：</span>
        <el-input size="small" @change="handleFilter" class="filter-item select-item" v-model="listQuery.src" clearable placeholder="请输入渠道号" />
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
         <el-button class="add_income" type="primary" icon="el-icon-plus" @click="addDialog">添加</el-button>
        <el-button class="add_income" type="primary" icon="el-icon-folder-add" @click="importDialog">批量添加</el-button>
        <el-button :disabled="multipleSelection.length == 0" class="add_income" type="primary" icon="el-icon-edit" @click="chooseTable()">批量删除</el-button>
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
          @selection-change="handleSelectionChange">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="proj"
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
            prop="opti"
            label="优化代理"
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
            prop="operator"
            label="操作人"
          >
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            prop="updated_at"
            label="操作时间"
          >
          </el-table-column>
          <el-table-column
            prop="operate"
            label="操作"
            header-align="center"
            align="center"
            >
            <template slot-scope="scope">
             <el-button type="primary" @click="editDialog(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <Pagination align="center" v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pagesize" @pagination="getList" />
    </el-card>
    <el-dialog :visible.sync="deleteVisible" title="删除">
      <div>您确定要删除渠道号：{{multipleSelectionChannel}}</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteScreen()">确 定</el-button>
      </div>
    </el-dialog>
    <Add
      :dialogFormVisible="dialogFormVisible_add"
      @updateAddvisible="updateAddvisible"
      @addScreen="addScreen"
    />
     <Edit
      :dialogFormVisible="dialogFormVisible_edit"
      :initData="initData"
      @updateEditvisible="updateEditvisible"
      @editScreen="editScreen"
    />
    <Batch 
      :projectsList="projectsList" 
      :mediaList="mediaList"
      :agentList="agentList"
      :dialogFormVisible="dialogFormVisible_batch" 
      @updateImportvisible="updateImportvisible"
      @batchScreen="batchScreen" 
    />
  </div>
</template>
<script>

import Pagination from '@/components/Pagination'
import { getScreenList, addScreen, batchScreen, editScreen, searchScreen, deleteScreen } from '@/api/backhaul/screen'
import { getAgent, getMediaList, getProjectList } from '@/api/dynamic/public'
import Add from  './components/Add'
import Edit from  './components/Edit'
import Batch from  './components/Batch'

export default {
  name: 'Income',
  components: { Pagination, Add, Edit, Batch },
  data() {
    return {
      dialogFormVisible_add: false,
      dialogFormVisible_edit:false,
      dialogFormVisible_batch:false,
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
      search:{
        src:'',
        from:'',
        ratio:''
      },
      listQuery: {
        proj_id:'',
        media_id:'',
        opti_id:'',
        src:'',
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
    changeSrc() {
      if(!this.search.src){
        this.search.from = ''
        this.search.ratio = ''
      }
    },
    // 搜索
    handleSearch () {
      if(!this.search.src){
        this.search.from = ''
        this.search.ratio=''
        this.$message.warning("请输入要查询的渠道号！")
        return
      }
      searchScreen({src:this.search.src}).then((data) => {
        if (data.error_code === 0) {
          this.search.from = data.data.from
          this.search.ratio = data.data.ratio ? data.data.ratio  + '%' : ''
        }
      }).catch(() => {
        this.$message({
          message: '查询失败',
          type: 'error'
        })
      })
    },
    // 筛选
    handleFilter (value) {
      const { listQuery } = this
      listQuery.page = 1
      this.getList()
    },
    // 多选项操作
    handleSelectionChange(val) {
      let channels = []
      if (val.length > 0) {
        for (var key in val) {
          channels.push(val[key].src)
        }
      }
      this.multipleSelection = channels
      this.multipleSelectionChannel = channels.join(', ')
    },
    // 批量操作
    chooseTable(){
     this.deleteVisible = true
    },
    deleteScreen(){
      let params={
        src:this.multipleSelection
      }
      deleteScreen(params).then((data) => {
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
      getScreenList(datasrc).then((data) => {
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
    // 新增保存
    addScreen(datasrc){
      addScreen(datasrc).then((data) => {
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
    editScreen(datasrc){
      editScreen(datasrc).then((data) => {
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
    batchScreen(datasrc){
      batchScreen(datasrc).then((data) => {
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
.search-box{
  padding: 10px;
  background: #F2F2F2;
  border-radius: 3px;
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
