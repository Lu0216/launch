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
      v-if="dialogFormVisible_edit"
      :title="title"
      :initData="initData"
      :projectsList="projectsList" 
      :mediaList="mediaList"
      :dialogFormVisible="dialogFormVisible_edit"
      :btnloading="btnloading"
      @updateEditvisible="updateEditvisible"
      @saveData="saveData"
    />
  </div>
</template>
<script>
import { getList, add, edit, del } from '@/api/copyunit'
import { getProjectList, getMediaList } from '@/api/dynamic/public'
import TableColumns from '@/components/Eltable/index'
import Edit from  './components/edit'

export default {
  name: 'Stopchannelpackage',
  components: { TableColumns, Edit },
  data() {
    return {
      dialogFormVisible_edit:false,
      title:'新增',
      listLoading: false,
      tableData: [],
      projectsList: [],
      mediaList: [],
      total: 0,
      initData:{},
      listQuery: {
        proj_id:'',
        media_id:'',
        page: 1,
        pagesize: 20
      },
      btnloading : false,
      columns: [
        {
          prop: 'app_name', 
          label: '项目', 
          align: 'center' 
        },
        {
          prop: 'media', 
          label: '媒体', 
          align: 'center' 
        },
        {
          prop: 'is_copy_ratio', 
          label: '激活回传GAP是否复制', 
          align: 'center',
          render:(h,params) => {
             return (<span>{params.row.is_copy_ratio == 1 ? '是':'否'}</span>)
          }
        },
        {
          prop: 'is_copy_advertis_ratio', 
          label: '转化回传GAP是否复制', 
          align: 'center',
          render:(h,params) => {
             return (<span>{params.row.is_copy_advertis_ratio == 1 ? '是':'否'}</span>)
          }
        },
        {
          prop: 'operator', 
          label: '操作人', 
          align: 'center' 
        },
        {
          prop: 'operator_at', 
          label: '操作时间', 
          align: 'center',
          width: 200
        },
        {
          prop: 'operate', 
          label: '操作', 
          align: 'center', 
          width: 200,
          render: (h, params) => {
            return (
                <div>
                    <el-button type="primary" onClick={() => this.editDialog(params.row)}>编辑</el-button>
                    <el-button type="danger" onClick={() => this.delete(params.row)}>删除</el-button>
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
      this.title = '新增'
      this.initData = {}
      this.dialogFormVisible_edit = true
    },
    editDialog(row){
        this.title = '编辑'
        this.initData = row
        this.dialogFormVisible_edit = true
    },
    // 新增/编辑弹窗显示隐藏
    updateEditvisible(val){
      this.dialogFormVisible_edit = val
    },
    saveData(datasrc){
        const {title, initData} = this
        if(title === '编辑'){
            datasrc.id = initData.id
            this.edit(datasrc)
        }else{
            this.add(datasrc)
        }
    },
    // 保存
    add(datasrc){
       this.btnloading = true
       add(datasrc).then((data) => {
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
    edit(datasrc){
       this.btnloading = true
       edit(datasrc).then((data) => {
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
        this.btnloading = false
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '保存失败!'
        })
        this.btnloading = false
      })
    },
    // 删除用户
    delete(data){
      this.$confirm(`删除后，【${data.app_name}】项目和【${data.media}】媒体不再执行优质计划复制功能，确认是否删除？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del({id: data.id}).then((data) => {
            if (data.error_code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getList()
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
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
