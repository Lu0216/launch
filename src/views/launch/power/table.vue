<template>
  <div class="income_div">
    <div class="income_header">
      <span  class="adname">姓名：</span>
       <el-input size="small" @change="handleSearch" class="filter-item select-item" v-model="listQuery.name_cn" clearable placeholder="请输入姓名" />
        <span  class="adname">LDAP账号：</span>
       <el-input size="small" @change="handleSearch" class="filter-item select-item" v-model="listQuery.name" clearable placeholder="请输入账号" />
       <span  class="adname">项目：</span>
      <el-select
        v-model="listQuery.project"
        :default-first-option = "true"
        class="filter-item select-item"
        filterable
        placeholder="请选择项目"
        @change="handleSearch">
        <el-option label="全部" value=""/>
        <el-option v-for="(item) in projectsList" :key="item.id" :label="item.app_name" :value="item.id"/>
      </el-select>
        <el-button class="add_income" type="primary" icon="el-icon-edit" @click="addUser">添加账号</el-button>
    </div>
     <el-card shadow="never">
      <TableColumns
        :dataSource="tableData"
        :total="total"
        :listLoading="listLoading"
        :columns="columns"
        :currentPage="listQuery.page"
        :pageSize="listQuery.pageSize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      >
      </TableColumns>
    </el-card>

    <el-dialog :visible.sync="dialogFormVisible_add" :title="dialogtitle">
      <AddDialog
        :addForm="addForm"
        :projectsList="projectsList"
        :dialogFormVisible="dialogFormVisible_add"
        @handleCancel="handleCancel" 
        @saveUser="saveUser"
      />
    </el-dialog>
  </div>
</template>
<script>
import { getUserList, saveUser, deleteUser } from '@/api/dynamic/power'
import { getProjectList } from '@/api/dynamic/public'
import TableColumns from '@/components/Eltable/index'
import AddDialog from './components/addDialog'
export default {
  name: 'Income',
  components: { TableColumns, AddDialog },
  data() {
    return {
      dialogtitle: '添加账号',
      dialogFormVisible_add: false,
      listLoading: false,
      formLabelWidth: '120px',
      total: 0,
      addForm: {
        name: '',
        table: '',
        state: ''
      },
      listQuery: {
        name: '',
        name_cn: '',
        project: '',
        page: 1,
        pageSize: 20
      },
      mediaOptions:["今日头条","快手","广点通","应用宝","华为","小米","oppo","vivo","百度","趣头条","触宝"],
      projectsList:[],
      tableData: [],
       columns: [
        {
          prop: 'id', 
          label: '序号', 
          align: 'center' 
        },
        {
          prop: 'name_cn', 
          label: '姓名', 
          align: 'center' 
        },
        {
          prop: 'name', 
          label: 'LDAP账号', 
          align: 'center' 
        },
        {
          prop: 'project_name', 
          label: '账号权限', 
          align: 'center'
        },
        {
          prop: 'created_at', 
          label: '创建时间', 
          align: 'center' 
        },
        {
          prop: 'operate', 
          label: '操作', 
          align: 'center', 
          width: 200, // 列宽
          render: (h, params) => {
            const editButton = h('el-button', {
              props: {
                type: 'primary'
              },
              on: {
                click: () => {
                  this.editUser(params)
                }
              }
            }, '编辑')
             const delButton = h('el-button', {
              props: {
                type: 'primary'
              },
              on: {
                click: () => {
                  this.deleteUser(params)
                }
              }
            }, '删除')
            return h('div', [editButton, delButton])
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
    handleSearch (value) {
      const { listQuery } = this
      listQuery.page = 1
      this.getList()
    },

    // 获取项目列表
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

    // 获取表格数据
    getList() {
      let datasrc =this.listQuery
      getUserList(datasrc).then((data) => {
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

    // 新增用户
    addUser() {
      this.dialogFormVisible_add = true
      this.dialogtitle = '添加账号'
      this.addForm = {
        name: '',
        name_cn: '',
        project_ids: ''
      }
    },

    // 编辑用户
    editUser(data){
      this.dialogtitle = '编辑账号'
      const row = data.row
      this.dialogFormVisible_add = true
      this.addForm = {
        name: row.name,
        name_cn: row.name_cn,
        project_ids: row.project_id
      }
    },

    // 删除用户
    deleteUser(data){
      this.$confirm(`此操作将删除用户【${data.row.name_cn}】, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser({id: data.row.id}).then((data) => {
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
            this.dialogFormVisible_add = false
          }).catch(() => {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
            this.dialogFormVisible_add = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },

    // 保存用户信息
    saveUser(form) {
      saveUser(form).then((data) => {
        if (data.error_code === 0) {
          this.$message({
            type: 'success',
            message: `${this.dialogtitle}成功!`
          })
          this.getList()
        } else {
          this.$message({
            type: 'error',
            message: `${this.dialogtitle}失败!`
          })
        }
        this.dialogFormVisible_add = false
      }).catch(() => {
        this.$message({
          type: 'error',
          message: `${this.dialogtitle}失败!`
        })
        this.dialogFormVisible_add = false
      })
    },

    //弹窗关闭
    handleCancel(){
      this.dialogFormVisible_add = false
    },

    // 分页- pageSize
    handleSizeChange (val) {
      const { listQuery } = this
      listQuery.pageSize = val
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
</style>
