<template>
    <div class="offline_wrap">
        <div class="offline_cont">
            <span  class="adname">锚点中文名称：</span>
                <el-input v-model="listQuery.anchor_name" class="form_input" @change="handleFilter"/>
            <span  class="adname">锚点值：</span>
                <el-input v-model="listQuery.anchor_val" class="form_input" @change="handleFilter"/>
            <span  class="adname">状态：</span>
             <el-select
                v-model="listQuery.status"
                :default-first-option = "true"
                class="filter-item select-item"
                filterable
                placeholder="请选择锚点值"
                @change="handleFilter">
                <el-option label="全部" value=""/>
                <el-option label="开启" value="1"/>
                <el-option label="关闭" value="0"/>
            </el-select>
             <el-button class="add_income" type="primary" icon="el-icon-add" @click="addDialog">新增</el-button>
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
         <Add 
            :title="title_add"
            :initData="initData"
            :dialogFormVisible="dialogFormVisible_add"
            :btnloading="btnloading"
            @updateAddvisible="updateAddvisible"
            @getAnchorAdd="getAnchorAdd"
            @getAnchorEdit="getAnchorEdit"
        />
    </div>
</template>

<script>

import { getAnchorList, getAnchorAdd, getAnchorEdit } from '@/api/anchor'
import TableColumns from '@/components/Eltable/index'
import Add from  './components/add.vue'
export default {
    name: 'mediaScene',
    components: {
        TableColumns,
        Add
    },
    data() {
        return{
            title_add:'',
            tableData: [],
            initData:{},
            listLoading: false,
            btnloading : false,
            dialogFormVisible_add: false,
            total: 0,
            selectid: '',
            listQuery: {
                anchor_name: '',
                anchor_val: '',
                status: '',
                page: 1,
                pageSize: 20
            },
            columns: [
                {
                   prop: 'id', 
                    label: '序号', 
                    align: 'center'  
                },{
                     prop: 'anchor_name', 
                    label: '锚点中文名称', 
                    align: 'center' 
                },{
                    prop: 'anchor_val', 
                    label: '锚点值', 
                    align: 'center' 
                },{
                    prop: 'status', 
                    label: '状态', 
                    align: 'center',
                    render: (h,params) => {
                        return params.row.status == 0 ? <span>关闭</span> : <span>开启</span>
                    }
                },{
                    prop: 'updated_at', 
                    label: '操作时间', 
                    align: 'center' 
                },{
                    prop: 'operator', 
                    label: '操作人', 
                    align: 'center' 
                },{
                    prop: 'operate', 
                    label: '操作', 
                    align: 'center', 
                    render: (h, params) => {
                        return (
                            <div>
                                <el-button type="primary" onClick={() => this.handleEdit(params.row)}>编辑</el-button>
                            </div>
                        )
                    }
                    
                }
            ],
        }
    },
    created() {
        this.getAnchorList()
    },
   
    methods: {
        // 获取列表数据
        getAnchorList() {
            this.listLoading = true
            let datasrc = this.listQuery;
            getAnchorList(datasrc).then((data) => {
                if(data.error_code === 0) {
                    this.total = data.meta.total;
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
        handleFilter () {
            const { listQuery } = this
            listQuery.page = 1
            this.getAnchorList()
        },
      
        //新增弹窗显示隐藏
        updateAddvisible(val) {
          this.dialogFormVisible_add = false;
        },
        addDialog(){
            this.dialogFormVisible_add = true
            this.title_add = "新增";
            this.initData = {}
        },
        handleEdit(row) {
            this.title_add = "编辑";
            this.dialogFormVisible_add = true
            this.initData = row
            this.selectid = row.id
        },
        getAnchorEdit(datasrc) {
            const params = {
                id: this.selectid,
                status: datasrc.status
            }
            this.btnloading = true
            getAnchorEdit(params).then((data) => {
                if(data.error_code === 0) {
                     this.$message({
                        type: 'success',
                        message: data.error_message || '编辑成功!'
                    })
                    this.btnloading = false
                    this.dialogFormVisible_add = false
                    this.getAnchorList()
                } else {
                    this.btnloading = false
                    this.$message({
                    type: 'error',
                    message: '添加失败!'
                    })
                }
            }).catch(()=> {
                this.btnloading = false
                this.dialogFormVisible_add = false
            })
        },
        getAnchorAdd(datasrc){
            this.btnloading = true
            getAnchorAdd(datasrc).then((data) => {
                if(data.error_code === 0) {
                     this.$message({
                        type: 'success',
                        message: data.error_message || '添加成功!'
                    })
                    this.btnloading = false
                    this.dialogFormVisible_add = false
                    this.getAnchorList()
                } else {
                    this.btnloading = false
                    this.$message({
                    type: 'error',
                    message: '添加失败!'
                    })
                }
            }).catch(()=> {
                this.btnloading = false
                this.dialogFormVisible_add = false
            })
        },
        // 分页- pageSize
        handleSizeChange (val) {
            const { listQuery } = this
            listQuery.pageSize = val
            listQuery.page = 1
            this.getAnchorList()
        },
        // 分页- page
        handleCurrentChange (val) {
            this.listQuery.page = val
            this.getAnchorList()
            }
        },
        
        
         
}
</script>


<style>
    .offline_wrap{
        padding: 10px 20px 20px 20px;
    }
    .offline_cont{
        margin-bottom:20px;
    }
    .select-item{
        width:150px;margin: 10px 20px 0px 0px;
    }
     .deleteDialog .el-dialog__body{
            padding-top: 0;
            text-align: right;
    }
    .form_input{
        width:200px
    }
</style>