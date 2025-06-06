<template>
    <div class="offline_wrap">
        <div class="offline_cont">
            <span class="adname">项目：</span>
            <el-select
              v-model="listQuery.proj_id"
              clearable
              class="filter-item select-item"
              filterable
              placeholder="全部"
              @change="handleFilter"
            >
              <el-option
                v-for="item in projectList"
                :key="item.id"
                :label="item.app_name"
                :value="item.id"
              />
            </el-select>
            <span class="adname">子账号：</span>
            <el-input
            style="width: 15%;"
                @change="handleFilter"
                class="filter-item select-item"
                v-model="listQuery.advertiser_id"
                clearable
                placeholder="请输入子账号"
            />
            <span class="adname">渠道号：</span>
            <el-input clearable v-model="listQuery.channel" 
                class="filter-item select-item" 
                placeholder="请填写渠道号" 
                @change="handleFilter"/>
     

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
            @getLearnEdit="confirmStatusChange" 
            @getLearnAdd="getLearnAdd"
        />
    </div>
</template>

<script>
import { getProjectList } from "@/api/dynamic/public";
import { getLearnList, getLearnSave, getChildId } from "@/api/learning";
import TableColumns from '@/components/Eltable/index'
import Add from  './components/add.vue'
import { getToken } from "@/utils/auth"; // getToken from cookie
export default {
    name: 'learningPeriod',
    components: {
        TableColumns,
        Add
    },
    data() {
        return{
            title_add:'',
            tableData: [],
            initData:{},
            projectList: [],
            advertiser_idList: [],
            listLoading: false,
            btnloading : false,
            dialogFormVisible_add: false,
            total: 0,
            token: getToken(),
            selectid: '',
            listQuery: {
                proj_id: '',
                advertiser_id: '',
                channel: '',
                status: '',
                page: 1,
                pageSize: 20
            },
            columns: [
                {
                   prop: 'proj_code', 
                    label: '项目', 
                    align: 'center'  
                },{
                     prop: 'advertiser_id', 
                    label: '子账号', 
                    align: 'center' 
                }, 
                {
                    prop: 'channel', 
                    label: '渠道号', 
                    align: 'center',
                    width:'180', 
                    },
                {
                    prop: 'created_at', 
                    label: '创建时间', 
                    align: 'center' 
                },{
                    prop: 'updated_at', 
                    label: '更新时间', 
                    align: 'center' 
                },
                {
                    prop: 'device_cnt', 
                    label: '实时新增设备数', 
                    align: 'center' 
                },
                {
                    prop: 'bid_pass', 
                    label: '实时过学习期数', 
                    align: 'center' 
                },
                {
                    prop: 'status', 
                    label: '学习期状态', 
                    align: 'center',
                    render: (h,params) => {
                        return params.row.status == 0 ? <span>关闭</span> : <span>开启</span>
                    }
                },
                {
                    prop: 'limit_device_cnt', 
                    label: '条件1：新增设备数', 
                    align: 'center' 
                },
                {
                    prop: 'limit_bid_pass', 
                    label: '条件2：过学习期的二级计划数量', 
                    align: 'center',
                },
                {
                    prop: 'behavior_num', 
                    label: '关键行为回传数量', 
                    align: 'center' 
                },
                {
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
        this.getProjectList()
        this.getLearnList()
    },
   
    methods: {
      // 请求项目
      getProjectList() {
        getProjectList().then((data) => {
          if (data.error_code === 0) {
            this.projectList = data.data;
          }
        });
      },
      // 获取列表数据
        getLearnList() {
            this.listLoading = true
            let datasrc = this.listQuery;
            console.log(datasrc);
            getLearnList(datasrc).then((data) => {
                if(data.error_code === 0) {
                    console.log('111',data.data);
                    this.total = data.meta.total;
                    this.tableData = data.data.map(item => {
                        if (item.limit_bid_pass === -1 || item.limit_bid_pass === 0 ) {
                            item.limit_bid_pass = ''
                        }
                        return item
                    })
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
            this.getLearnList()
        },
        confirmStatusChange(datasrc) {
            if (datasrc.status === 1 && this.initData.status === 0) {
            // 弹出二次确认框
            this.$confirm('已关闭的子账号重新开启，将重置学习期，请谨慎操作', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 用户点击确定按钮后执行的逻辑
                this.getLearnEdit(datasrc); // 继续执行编辑逻辑
            })
            } else {
                this.getLearnEdit(datasrc)
            }
        },
        // 编辑
        getLearnEdit(datasrc) {
            if (datasrc.limit_bid_pass === null || datasrc.limit_bid_pass == '') {
                datasrc.limit_bid_pass = -1
            }
            const params = {
                id: this.selectid,
                proj_id: datasrc.proj_id,
                advertiser_id: datasrc.advertiser_id,
                status: datasrc.status,
                limit_device_cnt: datasrc.limit_device_cnt,
                limit_bid_pass: datasrc.limit_bid_pass,
                behavior_num: datasrc.behavior_num
            }
            console.log('000',params);
            this.btnloading = true
            getLearnSave(params).then((data) => {
                if(data.error_code === 0) {
                     this.$message({
                        type: 'success',
                        message: data.error_message || '编辑成功!'
                    })
                    this.btnloading = false
                    this.dialogFormVisible_add = false
                    this.getLearnList()
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
        // 添加
        getLearnAdd(datasrc){
            if (datasrc.limit_bid_pass === null || datasrc.limit_bid_pass == '') {
                datasrc.limit_bid_pass = -1
            }
            const params = {
                proj_id: datasrc.proj_id,
                advertiser_id: datasrc.advertiser_id,
                status: datasrc.status,
                limit_device_cnt: datasrc.limit_device_cnt,
                limit_bid_pass: datasrc.limit_bid_pass,
                behavior_num: datasrc.behavior_num
            }
            console.log(params);
            const exists = this.tableData.some(item => item.advertiser_id === params.advertiser_id)
            
            if (exists) {
                this.$message({
                    type: 'warning',
                    message: '已有该配置项，请勿重复添加'
                })
                return
            }
            this.btnloading = true
            getLearnSave(params).then((data) => {
                if(data.error_code === 0) {
                     this.$message({
                        type: 'success',
                        message: data.error_message || '添加成功!'
                    })
                    this.btnloading = false
                    this.dialogFormVisible_add = false
                    this.getLearnList()
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
        // 分页- pageSize
        handleSizeChange (val) {
            const { listQuery } = this
            listQuery.pageSize = val
            listQuery.page = 1
        },
        // 分页- page
        handleCurrentChange (val) {
            this.listQuery.page = val
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