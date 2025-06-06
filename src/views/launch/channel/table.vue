<template>
  <div class="income_div">
    <div class="income_header">
     <span  class="adname">代理：</span>
      <el-select
        v-model="listQuery.agent_id"
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
        <span  class="adname">账号：</span>
      <el-select
        v-model="listQuery.account_id"
        :default-first-option = "true"
        class="filter-item select-item"
        filterable
        placeholder="请选择账号"
        @change="handleFilter">
        <el-option label="全部" value=""/>
        <el-option v-for="(item) in masterList" :key="item.id" :label="item.account" :value="item.id"/>
      </el-select>
      <span  class="adname">渠道号：</span>
      <el-input size="small" @change="handleFilter" class="filter-item select-item" v-model="listQuery.channel" clearable placeholder="请输入渠道号" />
      <span class="adname">打包状态：</span>
      <!-- 打包状态 1：打包成功；2：打包中；3：打包失败 -->
      <el-select
        v-model="listQuery.package_status"
        :default-first-option="true"
        class="filter-item select-item"
        filterable
        placeholder="请选择打包状态"
        @change="handleFilter"
      >
        <el-option label="全部" value="" />
        <el-option label="打包成功" :value="1" />
        <el-option label="打包中" :value="2" />
        <el-option label="打包失败" :value="3" />
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
      <span  class="adname">渠道标签：</span>
      <el-select
        v-model="listQuery.tag_id"
        :default-first-option = "true"
        class="filter-item select-item"
        filterable
        placeholder="请选择渠道标签"
        @change="handleFilter">
        <el-option label="全部" value=""/>
        <el-option v-for="(item) in tagsList" :key="item.tag_id" :label="item.tag_name" :value="item.tag_id"/>
      </el-select>
      <span  class="adname">批次id：</span>
      <el-input size="small" @change="handleFilter" class="filter-item select-item" v-model="listQuery.batch_sn" clearable placeholder="请输入批次id" />
      <span  class="adname">操作人：</span>
      <el-input size="small" @change="handleFilter" class="filter-item select-item" v-model="listQuery.operator" clearable placeholder="请输入操作人" />
      <span  class="adname">操作时间：</span>
      <el-date-picker
        class="date-item"
        clearable
        v-model="listQueryDate"
        @change="changeDate"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"/>
         <el-button class="add_income" type="primary" icon="el-icon-plus" @click="addDialog">添加</el-button>
        <!-- <el-button class="add_income" type="primary" icon="el-icon-folder-add" @click="importDialog">批量添加</el-button> -->
        <el-button class="add_income" type="primary" icon="el-icon-download" @click="download">批量下载</el-button>
        <el-button class="add_income" type="primary" icon="el-icon-edit" @click="batchEditDialog">批量更新</el-button>
    </div>
     <el-card shadow="never">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        border
        stripe
        v-loading="listLoading"
      >
        <el-table-column
          prop="batch_sn"
          label="批次id"
          align="center"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          prop="project_name"
          label="项目"
          align="center"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          prop="channel"
          label="渠道号"
          align="center"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          prop="is_main_src"
          label="是否主线包"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_main_src == '1'" type="success"
              >是</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="feedback_url"
          label="检测链接"
          align="center"
          min-width="180px"
        >
        <template slot-scope="scope">
          <div v-if="scope.row.feedback_url_v2"></div>
          <el-tooltip v-else placement="top" >
            <div slot="content" style="width:300px;">{{scope.row.feedback_url}}</div>
            <div style="width:150px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">{{scope.row.feedback_url}}</div>
          </el-tooltip>
        </template>
        </el-table-column>
        <el-table-column
          prop="feedback_url1"
          label="曝光监测链接"
          align="center"
          min-width="180px"
        >
        <template slot-scope="scope">
          <el-tooltip placement="top" >
            <div slot="content" style="width:300px;">{{scope.row.feedback_url1}}</div>
            <div style="width:150px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">{{scope.row.feedback_url1}}</div>
          </el-tooltip>
        </template>
        </el-table-column>
        <!-- <el-table-column
          prop="feedback_url2"
          label="唤醒链接"
          align="center"
          min-width="180px"
        >
        <template slot-scope="scope">
          <el-tooltip placement="top" >
            <div slot="content" style="width:300px;">{{scope.row.feedback_url2}}</div>
            <div style="width:150px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">{{scope.row.feedback_url2}}</div>
          </el-tooltip>
        </template>
        </el-table-column>
        <el-table-column
          prop="feedback_url3"
          label="二跳落地页链接"
          align="center"
          min-width="180px"
        >
        <template slot-scope="scope">
          <el-tooltip placement="top" >
            <div slot="content" style="width:300px;">{{scope.row.feedback_url3}}</div>
            <div style="width:150px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">{{scope.row.feedback_url3}}</div>
          </el-tooltip>
        </template>
        </el-table-column> -->
        <el-table-column
          prop="feedback_url_v2"
          label="今日头条2.0检测链接"
          align="center"
          min-width="180px"
        >
        <template slot-scope="scope">
          <el-tooltip placement="top" >
            <div slot="content" style="width:300px;">{{scope.row.feedback_url_v2}}</div>
            <div style="width:150px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">{{scope.row.feedback_url_v2}}</div>
          </el-tooltip>
        </template>
        </el-table-column>
        <el-table-column
          prop="package_download_url"
          label="包下载地址"
          align="center"
          min-width="180px"
        >
        <template slot-scope="scope">
          <el-tooltip placement="top" >
            <div slot="content" style="width:300px;">{{scope.row.package_download_url}}</div>
            <div style="width:150px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">{{scope.row.package_download_url}}</div>
          </el-tooltip>
        </template>
        </el-table-column>
        <el-table-column
          prop="is_main_src"
          label="打包状态"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.package_status == '1'" type="success"
              >打包成功</el-tag
            >
            <el-tag v-if="scope.row.package_status == '2'">打包中</el-tag>
            <el-tag v-if="scope.row.package_status == '3'" type="danger"
              >打包失败</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="media_name"
          label="媒体名称"
          align="center"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          prop="core_agents"
          label="核心代理"
          align="center"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          prop="opti_agents"
          label="优化代理"
          align="center"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          prop="media_account_child_id"
          label="子账户id"
          align="center"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          prop="tag"
          label="渠道标签"
          align="center"
          min-width="120px"
        >
        </el-table-column>
          <el-table-column
          prop="gdt_media_appid"
          label="广点通媒体appid"
          align="center"
          min-width="130px"
        >
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          align="center"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          prop="operator"
          label="操作人"
          align="center"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          prop="operator_at"
          label="操作时间"
          align="center"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          prop="operate"
          label="操作"
          fixed="right"
          align="center"
          min-width="240px"
        >
          <template slot-scope="scope">
            <div style="text-align:left;">
              <el-button type="primary" :disabled="scope.row.tag_type != 1" @click="editDialog(scope.row)">编辑</el-button>
              <!-- need_package是否需要打包 1：需要打包；2：不需要打包 -->
              <el-button type="warning" v-if="scope.row.package_status != '1' && scope.row.package_status != '2'&&scope.row.package_status != ''" @click="changeDb(scope.row)">重新打包</el-button>
            </div>
          </template>
        </el-table-column>
        
      </el-table>
      <Pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pagesize"
        @pagination="getList"
      />

    </el-card>
    <AddDialog
      :tagsList="tagsList"
      :btnloading="btnloading"
      :projectsList="projectsList"
      :masterList="masterList"
      :dialogFormVisible="dialogFormVisible_add"
      :initData="initData"
      :dialogType="addDialogType"
      @updateAddvisible="updateAddvisible"
      @saveChannel="saveChannel"
    />
    <ImportDialog 
      :tagsList="tagsList"
      :btnloading="importbtnloading"
      :projectsList="projectsList" 
      :masterList="masterList" 
      :dialogFormVisible="dialogFormVisible_import" 
      :dialogType="importDialogType"
      @updateImportvisible="updateImportvisible"
      @batchChannel="batchChannel" 
    />
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { getChannelList, addChannel, importChannel, editChannel, batchEditChannel, getTagsList ,getReset} from '@/api/dynamic/channel'
import { getAgent, getMediaList, getMediaMasterList, getProjectList } from '@/api/dynamic/public'
import TableColumns from '@/components/Eltable/index'
import AddDialog from  './components/AddDialog'
import ImportDialog from  './components/ImportDialog'
import { getToken } from '@/utils/auth'

export default {
  name: 'Income',
  components: { Pagination,TableColumns, AddDialog, ImportDialog },
  data() {
    return {
      dialogFormVisible: false,
      dialogFormVisible_add: false,
      dialogFormVisible_import:false,
      listLoading: true,
      btnloading:false,
      importbtnloading:false,
      addDialogType:'add',
      importDialogType:'import',
      stratedy_state:[],
      tableData: [],
      tagsList: [],
      projectsList: [],
      agentList: [],
      mediaList: [],
      masterList: [],
      total: 0,
      initData:{},
      listQueryDate:'',
      listQuery: {
        proj_id:'',
        agent_id:'',
        account_id:'',
        media_id:'',
        channel:'',
        tag_id:'',
        batch_sn:'',
        operator:'',
        start_time:'',
        end_time:'',
        page: 1,
        pagesize: 10,
        package_status:'',
        is_main_src:'',
        feedback_url:'',
        package_download_url:'',
      },
      isShow:false,
    }
  },
  created() {
    this.getList()
    this.getAgent()
    this.getMediaList()
    this.getMediaMasterList()
    this.getProjectList()
    this.getTagsList()
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
    getMediaMasterList(){
      getMediaMasterList().then((data) => {
        if (data.error_code === 0) {
          this.masterList = data.data
        }
      }).catch(() => {
        this.$message({
          message: '加载账号失败',
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
    getTagsList(){
      getTagsList().then((data) => {
        if (data.error_code === 0) {
          this.tagsList = data.data
        }
      }).catch(() => {
        this.$message({
          message: '加载渠道标签失败',
          type: 'error'
        })
      })
    },
    changeDate(val){
      if(val){
        this.listQuery.start_time = val[0]
        this.listQuery.end_time = val[1]
      }else{
        this.listQuery.start_time = ''
        this.listQuery.end_time = ''
      }
      this.getList()
    },
    // 获取列表数据
    getList() {
      let datasrc = this.listQuery;
      this.listLoading = true
      getChannelList(datasrc).then((data) => {
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
      this.addDialogType = 'add'
      this.initData = {}
    },
    // 批量新增按钮点击
    importDialog(){
      this.dialogFormVisible_import = true
      this.importDialogType = 'import'
    },
    // 批量更新按钮点击
    batchEditDialog(){
      this.dialogFormVisible_import = true
      this.importDialogType = 'importEdit'
    },
    // 批量下载按钮点击
    download() {
     const baseUrl = process.env.BASE_API;
     const token = getToken();
     let url = `${baseUrl}/api/channelPackage/export?proj_id=${this.listQuery.proj_id}&agent_id=${this.listQuery.agent_id}&account_id=${this.listQuery.account_id}&media_id=${this.listQuery.media_id}&channel=${this.listQuery.channel}&tag_id=${this.listQuery.tag_id}&batch_sn=${this.listQuery.batch_sn}&operator=${this.listQuery.operator}&start_time=${this.listQuery.start_time}&end_time=${this.listQuery.end_time}&token=${token}&is_main_src=${this.listQuery.is_main_src}&feedback_url=${this.listQuery.feedback_url}&package_download_url=${this.listQuery.package_download_url}&package_status=${this.listQuery.package_status}`
     window.open(url);
    },
    //新增弹窗显示隐藏
    updateAddvisible(val){
      this.dialogFormVisible_add = val
    },
    // 批量新增弹窗显示隐藏
    updateImportvisible(val){
      this.dialogFormVisible_import = val
    },
    editDialog(params){
      this.dialogFormVisible_add = true
      this.addDialogType = 'edit'
      this.initData = params
    },
    // 重新打包
    changeDb(row) {
      getReset({src:row.channel,proj_id:row.proj_id}).then(res => {
        if(res.error_code == 0) {
          this.getList()
        }
      }).catch(() => {
        this.$message.error('重新打包接口请求失败！')
      })
    },
    saveChannel(datasrc){
      this.btnloading = true
      if(this.addDialogType === 'add'){
        this.addChannel(datasrc)
      }else{
        this.editChannel(datasrc)
      }
    },
    // 新增保存
    addChannel(datasrc){
      addChannel(datasrc).then((data) => {
        if (data.error_code === 0) {
          this.$message({
            type: 'success',
            message: '新增成功!'
          })
        } else {
          this.$message({
            type: 'error',
            message: '新增失败!'
          })
        }
        this.btnloading = false
        this.dialogFormVisible_add = false
        this.getList()
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '新增失败!'
        })
        this.btnloading = false
        this.dialogFormVisible_add = false
        this.getList()
      })
    },
    // 编辑保存
    editChannel(datasrc){
      editChannel(datasrc).then((data) => {
        if (data.error_code === 0) {
          this.$message({
            type: 'success',
            message: '编辑成功!'
          })
          this.dialogFormVisible_add = false
          this.getList()
        } else {
          this.$message({
            type: 'error',
            message: '编辑失败!'
          })
        }
        this.btnloading = false
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '编辑失败!'
        })
        this.btnloading = false
      })
    },
    // 批量新增保存
    batchChannel(datasrc){
      this.importbtnloading = true
      if(this.importDialogType === 'import'){
        this.importChannel(datasrc)
      }else{
        this.batchEditChannel(datasrc)
      }
    },
    importChannel(datasrc){
      importChannel(datasrc).then((data) => {
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
        this.dialogFormVisible_import = false
        this.importbtnloading = false
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '批量新增失败!'
        })
        this.dialogFormVisible_import = false
        this.importbtnloading = false
      })
    },
    batchEditChannel(datasrc){
      batchEditChannel(datasrc).then((data) => {
        if (data.error_code === 0) {
          this.$message({
            type: 'success',
            message: '批量更新成功!'
          })
          this.getList()
        } else {
          this.$message({
            type: 'error',
            message: '批量更新失败!'
          })
        }
        this.dialogFormVisible_import = false
        this.importbtnloading = false
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '批量更新失败!'
        })
        this.dialogFormVisible_import = false
        this.importbtnloading = false
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
.date-item{
  margin: 10px 20px 0px 0px;
}
</style>
