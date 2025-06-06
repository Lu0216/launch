<template>
    <div class="offline_wrap">
        <div class="offline_cont">
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
            :projectsList="projectsList" 
            :mediaList="mediaList"
            :dialogFormVisible="dialogFormVisible_add"
            :btnloading="btnloading"
            @updateImportvisible="updateImportvisible"
            @addAirrun="addAirrun"
        />
        <el-dialog width="400px"  class="deleteDialog" close-on-click-modal :visible.sync="deleteDialogVisible" title="删除">
            <p style="line-height:20px;text-align:left">删除后，{{this.deleteproj}}项目和{{deletemedia}}媒体不再空跑计划的自动化停投，确认是否删除</p>
            <el-button type="primary" @click="handleDeleteDialog">确 定</el-button>
        </el-dialog>
    </div>
</template>

<script>

import { getListAirrun, addAirrun, deleteAirrun } from '@/api/autowhitelist'
import { getProjectList, getMediaList } from '@/api/dynamic/public'
import TableColumns from '@/components/Eltable/index'
import Add from  './add'
export default {
    name: 'Offline',
    components: {TableColumns,Add},
    data() {
        return{
            projectsList: [],
            mediaList: [],
            tableData: [],
            listLoading: false,
            btnloading : false,
            dialogFormVisible_add: false,
            deleteDialogVisible: false,
            deleteId: '',
            deleteproj:'',
            deletemedia:'',
            total: 0,
            listQuery: {
                proj_id: '',
                media_id: '',
                page: 1,
                pagesize: 20
            },
            columns: [
                {
                   prop: 'app_name', 
                    label: '项目', 
                    align: 'center'  
                },{
                     prop: 'media', 
                    label: '媒体', 
                    align: 'center' 
                },{
                    prop: 'created_at', 
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
                                <el-button type="primary" onClick={() => this.handleDelete(params.row)}>删除</el-button>
                            </div>
                        )
                    }
                    
                }
            ]
        }
    },
    created() {
        this.getListAirrun()
        this.getProjectList()
        this.getMediaList()
    },
   
    methods: {
       
        // 获取列表数据
        getListAirrun() {
            this.listLoading = true
            let datasrc = this.listQuery;
            getListAirrun(datasrc).then((data) => {
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
        handleFilter (value) {
            const { listQuery } = this
            listQuery.page = 1
            this.getListAirrun()
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
        // 新增编辑弹窗显示隐藏
        updateImportvisible(val){
            this.dialogFormVisible_add = val
        },
        addDialog(){
            this.dialogFormVisible_add = true
        },
        handleDelete(row) {
            this.deleteproj = row.app_name;
            this.deletemedia = row.media;
            this.deleteId = row.id
            this.deleteDialogVisible = true
        },
        handleDeleteDialog() {
            deleteAirrun({id:this.deleteId}).then( (data) => {
                if(data.error_code === 0) {
                    this.$message({
                        type: 'success',
                        message: data.error_message || '删除成功!'
                    })
                    this.deleteDialogVisible = false
                    this.getListAirrun()
                }
            })
        },
        addAirrun(datasrc){
            this.btnloading = true
            addAirrun(datasrc).then((data) => {
                if(data.error_code === 0) {
                     this.$message({
                        type: 'success',
                        message: data.error_message || '添加成功!'
                    })
                    this.btnloading = false
                    this.dialogFormVisible_add = false
                    this.getListAirrun()
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
        // 分页- pagesize
        handleSizeChange (val) {
            const { listQuery } = this
            listQuery.pagesize = val
            listQuery.page = 1
            this.getListAirrun()
        },
        // 分页- page
        handleCurrentChange (val) {
            this.listQuery.page = val
            this.getListAirrun()
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
</style>