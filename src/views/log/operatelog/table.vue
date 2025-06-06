<template>
    <div class="authlink_div">
        <div class="authlink_header">
            <span class="adname">项目：</span>
            <el-select
                v-model="listQuery.app_code"
                clearable
                class="filter-item select-item"
                filterable
                placeholder="请选择项目"
                 @change="appnameSelect"
            >
                <el-option label="全部" value=""/>
                 <el-option v-for="(item) in projectsList" :key="item.id" :label="item.app_name" :value="item.app_name"/>
            </el-select>
            <span class="adname">渠道号：</span>
            <el-input style="width:200px;" size="small" class="filter-item select-item" v-model="listQuery.qid" clearable placeholder="请输入渠道号" />
            <span class="adname">操作人：</span>
            <el-input style="width:200px;" size="small" class="filter-item select-item" v-model="listQuery.operator" clearable placeholder="请输入渠道号" />
            <el-button class="add_income" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        </div>
        <el-card shadow="never">
            <TableColumns
                :dataSource="list"
                :total="total"
                :listLoading="listLoading"
                :columns="columns"
                :currentPage="pagination.page"
                :pageSize="pagination.pageSize"
                @handleSizeChange="handleSizeChange"
                @handleCurrentChange="handleCurrentChange"
            >
            </TableColumns>
        </el-card>
    </div>
</template>

<script>
import TableColumns from '@/components/Eltable/index'
import { getProjectList} from '@/api/dynamic/public'
import {getRecordList} from '@/api/dynamic/log'
export default {
    name: 'log',
    components: { TableColumns },
    data() {
        return {
            listQuery: {
                app_code: '',
                operator: '',
                qid: ''
            },
            searchQuery: {
                zm_app_name: '',
                _id: '',
                operator: '',
                qid: ''
            },
            projectsList: [],
            list: [],
            total: 0,
            listLoading: false,
            backStatus:true,
            form: {
                project: '',
                channel: '',
                operate: ''
            },
            columns: [
                {
                    prop: 'app_code',
                    label: '项目',
                    align: 'center'
                },
                {
                    prop: 'qid',
                    label: '渠道号',
                    align: 'center'
                },
                 {
                    prop: 'call_back_url',
                    label: '媒体检测链接',
                    align: 'center',
                    render: (h,params) => {
                        return (
                            <el-tooltip placement="top" >
                                <div slot="content" style="width:300px;">{params.row.call_back_url}</div>
                                <div style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">{params.row.call_back_url}</div>
                            </el-tooltip>
                        )
                    }
                },
                 {
                    prop: 'type',
                    label: '操作行为',
                    align: 'center',
                    render: (h, params) => {
                        if(params.row.type == 'Activate') {
                            return (<span>点击激活回传</span>)
                        } else if(params.row.type == 'Advertis'){
                            return (<span>点击关键行为回传</span>)
                        }
                    }
                },
                {
                    prop: 'is_success',
                    label: '回传结果',
                    align: 'center',
                    render: (h,params) => {
                        if(params.row.is_success == 1) {
                            return <span>成功</span>
                        } else {
                            return <span>失败</span>
                        }
                    }
                },
                {
                    prop: 'updated_at',
                    label: '操作时间',
                    align: 'center'
                },
                {
                    prop: 'operator',
                    label: '操作人',
                    align: 'center'
                },
            ],
            pagination: {
                page: 1,
                pageSize: 10
            },
        }
    },
    created() {
        this.getProjectList()
        if(this.$route.query.id) {
            this.searchQuery._id = this.$route.query.id
            this.handleFilter()
        } else {
            this.handleFilter()
        }
    },
    methods: {
        handleFilter () {
            this.listLoading = true
            this.searchQuery.operator = this.listQuery.operator
            this.searchQuery.qid = this.listQuery.qid
            const { pagination } = this;
            const params = {
                ...pagination,
                ...this.searchQuery,
            };
            getRecordList(params).then((data) => {
                if(data.error_code === 0) {
                    this.total = data.meta.total
                    this.list = data.data
                    this.listLoading = false
                }
            }).catch(() => {
                this.listLoading = false;
                this.$message({
                    message: "加载失败",
                    type: "error",
                });
            });
        },
        getProjectList() {
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
         appnameSelect(v) {
            this.projectsList.map(item => {
                if(item.app_name == v) {
                    this.searchQuery.zm_app_name = item.zm_app_name
                }
            })
        },
        // 分页- pageSize
        handleSizeChange (val) {
            const { pagination } = this
            pagination.pageSize = val
            pagination.page = 1
            this.handleFilter()
        },
        // 分页- page
        handleCurrentChange (val) {
            this.pagination.page = val
            this.handleFilter()
        }
    }
}
</script>


<style>
.el-dialog{
    width:550px;
}
.authlink_div{
    padding: 10px 20px 20px 20px;
}
.authlink_header{
  margin-bottom:20px;
}
.adname{
   font-size:14px;
   margin-left:10px;
  }
  .add_income{
      margin-left: 10px;
  }
  
</style>