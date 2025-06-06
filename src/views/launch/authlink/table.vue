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
                 @change="handleFilter"
            >
                <el-option label="全部" value=""/>
                 <el-option v-for="(item) in projectsList" :key="item.id" :label="item.app_name" :value="item.app_name"/>
            </el-select>
            <span class="adname">媒体：</span>
            <el-select
                v-model="listQuery.media"
                clearable
                class="filter-item select-item"
                filterable
                placeholder="请选择媒体"
                 @change="handleFilter"
            >
                <el-option label="全部" value=""/>
                <el-option v-for="(item) in mediaList" :key="item.id" :label="item.name_cn" :value="item.name_cn"/>
            </el-select>
             <el-button class="add_income" type="primary" icon="el-icon-edit" @click="open">添加</el-button>
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
        <el-dialog :visible.sync="dialogVisible" :title="dialogTitle">
            <el-form ref="form" :rules="rules" :model="form">
                <el-form-item :label-width="formLabelWidth" label="公司名称:" prop="company">
                    <el-input :disabled="editStatus" class="contact-item"  v-model="form.company" placeholder="请输入公司名称"/>
                </el-form-item>
                 <el-form-item :label-width="formLabelWidth" label="开发者平台app_id:" prop="app_id">
                    <el-input :disabled="editStatus" class="contact-item"  v-model="form.app_id" placeholder="请输入app_id"/>
                </el-form-item>
                  <el-form-item :label-width="formLabelWidth" label="开发者平台secret:" prop="secret">
                    <el-input :disabled="editStatus" class="contact-item"  v-model="form.secret" placeholder="请输入secret"/>
                </el-form-item>
                <el-form-item :label-width="formLabelWidth" label="项目:" prop="app_code_list">
                    <el-select
                        :disabled="editStatus"
                        v-model="form.app_code_list"
                        clearable
                        filterable
                        placeholder="请选择项目"
                        @change="dialogProjecSelect"
                    >
                       <el-option label="全部" value=""/>
                 <el-option v-for="(item) in projectsList" :key="item.id" :label="item.app_name" :value="item.app_name"/>
                    </el-select>
                </el-form-item>
                 <el-form-item :label-width="formLabelWidth" label="媒体:" prop="media">
                    <el-select
                        v-model="form.media"
                        :disabled="editStatus"
                        clearable
                        filterable
                        placeholder="请选择媒体"
                    >
                        <el-option label="全部" value=""/>
                        <el-option v-for="(item) in mediaList" :key="item.id" :label="item.name_cn" :value="item.name_cn"/>
                    </el-select>
                </el-form-item>
                 <el-form-item :label-width="formLabelWidth" label="token授权链接:" prop="auth_url">
                    <el-input class="contact-item"  v-model="form.auth_url" placeholder="请输入授权链接"/>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" @click="addClick">生成有效授权链接</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import TableColumns from '@/components/Eltable/index'
import {getMediaList, getProjectList} from '@/api/dynamic/public'
import {getAuthList, addAuth, editAuth} from '@/api/dynamic/authlink'
export default {
    name: 'authlink',
    components: { TableColumns },
    data() {
        return {
            listQuery: {
                app_code: '',
                media: '',
            },
            projectsList: [],
            mediaList: [],
            list: [],
            total: 0,
            dialogTitle: '',
            listLoading: true,
            dialogVisible: false,
            editStatus: false,
            formLabelWidth: '150px',
            form: {
                app_code_list: '',
                media: '',
                auth_url: '',
                company: '',
                app_id: '',
                secret: '',
                app_name_list: ''
            },
            columns: [
                {
                    prop: 'app_code_list',
                    label: '项目',
                    align: 'center'
                },
                {
                    prop: 'media',
                    label: '媒体',
                    align: 'center'
                },
                {
                    prop: 'auth_url',
                    label: 'token授权链接',
                    align: 'center',
                    render: (h, params) => {
                        return (
                           <el-tooltip placement="top" >
                            <div slot="content" style="width:300px;">{params.row.auth_url}</div>
                            <div style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">{params.row.auth_url}</div>
                        </el-tooltip> 
                        )
                    }
                },
                 {
                    prop: 'updated',
                    label: '操作时间',
                    align: 'center'
                },
                {
                    prop: 'operator',
                    label: '操作人',
                    align: 'center',
                    
                },
                 {
                    prop: '',
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
                            this.editType(params.row)
                            }
                        }
                        }, '编辑')
                        return h('div', [editButton])
                    }
                },
            ],
            rules: {
                app_code_list: [
                    { required: true, message: '请选择项目', trigger: 'blur' },
                ],
                media: [
                    { required: true, message: '请选择媒体', trigger: 'blur' },
                ],
                auth_url: [
                    { required: true, message: '请输入授权链接', trigger: 'blur' },
                ],
                company: [
                    { required: true, message: '请输入公司名称', trigger: 'blur' },
                ],
                app_id: [
                    { required: true, message: '请输入app_id', trigger: 'blur' },
                ],
                secret: [
                    { required: true, message: '请输入secret', trigger: 'blur' },
                ]
            },
            pagination: {
                page: 1,
                pageSize: 10
            },
        }
    },
    created() {
        this.getProjectList()
        this.getMediaList()
        this.getList()
    },
    methods: {
        handleFilter () {
            const { pagination } = this
            pagination.page = 1
            this.getList()
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
        getMediaList() {
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
        getList() {
            const { pagination, listQuery } = this
            const params = {
                ...pagination,
                ...listQuery
            }
            this.listLoading = true
            getAuthList(params).then((data) => {
                if(data.error_code === 0) {
                    this.list = data.data
                    this.total = data.meta.total
                    this.listLoading = false
                }
            })
        },
        dialogProjecSelect(v) {
            this.projectsList.map(item => {
                if(item.app_name == v) {
                    this.form.app_name_list = item.app_name_cn
                }
            })
        },
        editType(params) {
            this.dialogTitle = '编辑'
            this.editStatus = true
            this.dialogVisible = true
            const {app_code_list, media, auth_url, company, app_id, secret, app_name_list, id} = params
             this.form =  {
                app_code_list,
                media,
                auth_url,
                company,
                app_id,
                secret,
                app_name_list,
                id
            }
        },
        open() {
            this.dialogTitle = '新增'
            this.dialogVisible = true
            this.editStatus = false
            this.form = {
                app_code_list: '',
                media: '',
                auth_url: '',
                company: '',
                app_id: '',
                secret: '',
                app_name_list: ''
            }
            this.$refs.form.resetFields()    
        },
        addClick() {
            this.$refs.form.validate((valid) => {
                if(valid) {
                    if(this.dialogTitle == '新增') {
                        addAuth(this.form).then(data => {
                            if(data.error_code === 0) {
                                this.dialogVisible = false
                                this.getList()
                            }
                        }).catch(() => {
                            this.$message({
                                message: "添加失败",
                                type: 'error'
                            })
                        })
                    } else {
                        editAuth(this.form).then(data => {
                            if(data.error_code === 0) {
                                this.dialogVisible = false
                                this.getList()
                            }
                        }).catch(() => {
                            this.$message({
                                message: "添加失败",
                                type: 'error'
                            })
                        })
                    }
                }
            })
        },
        // 分页- pageSize
        handleSizeChange (val) {
            const { pagination } = this
            pagination.pageSize = val
            pagination.page = 1
            this.getList()
        },
        // 分页- page
        handleCurrentChange (val) {
            this.pagination.page = val
            this.getList()
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