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
             <el-button class="add_income" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        </div>
        <el-card shadow="never">
            <el-table
                style="width: 100%"
                stripe
                :border="true"
                :data="list"
                v-loading="listLoading"
            >
                <el-table-column
                    prop="channel"
                    label="媒体"
                    align= 'center'>
                </el-table-column>
                <el-table-column
                    prop="qid"
                    label="渠道号"
                    align= 'center'>
                </el-table-column>
                <el-table-column
                    prop="call_back_url"
                    label="媒体检测链接"
                    align= 'center'>
                    <template slot-scope="scope">
                        <el-tooltip placement="top" >
                            <div slot="content" style="width:300px;">{{scope.row.call_back_url}}</div>
                            <div style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">{{scope.row.call_back_url}}</div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align= 'center'>
                    <template slot-scope="scope">
                        <el-button type="primary" @click="handleBack(scope.row,'Activate')">激活回传</el-button>
                        <el-button type="warning" @click="handleBack(scope.row,'Advertis')">关键行为回传</el-button>
                        <el-button @click="goLog(scope.row._id)">查看操作日志</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
// import TableColumns from '@/components/Eltable/index'
import { getProjectList} from '@/api/dynamic/public'
import { getDetectionList, doDetection } from '@/api/dynamic/launchtest'
export default {
    name: 'authlink',
    components: { },
    data() {
        return {
            listQuery: {
                app_code: '',
                qid: ''
            },
            searchQuery: {
                zm_app_name: '',
                qid: ''
            },
            projectsList: [],
            list: [],
            listLoading: false,
            form: {
                project: '',
                link: ''
            },
        }
    },
    created() {
        this.getProjectList()
        this.$message({
            message: '请选择项目和输入渠道号查询',
            type: 'warning'
        })
    },
    methods: {
        handleFilter () {
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
        appnameSelect(v) {
            this.projectsList.map(item => {
                if(item.app_name == v) {
                    this.searchQuery.zm_app_name = item.zm_app_name
                }
            })
        },
        getList() {
            this.listLoading = true
            this.searchQuery.qid = this.listQuery.qid
            getDetectionList(this.searchQuery).then((data) => {
                if(data.error_code === 0) {
                    this.list = data.data
                    this.listLoading = false
                }
            }).catch(() => {
                this.$message({
                message: '加载失败',
                type: 'error'
                })
            })
        },
        goLog(id) {
            this.$router.push({ path: '/operatelog', query:{id:id} })
        },
        //激活回传
        handleBack(params,type) {
            const backParams = {
                zm_app_name : this.searchQuery.zm_app_name,
                _id : params._id,
                type : type
            }
            doDetection(backParams).then((data) => {
                if(data.error_code === 0) {
                    if(type == 'Activate') {
                        this.$message({
                            message: '激活回传成功',
                            type: 'success'
                        })
                    } else if(type == 'Advertis') {
                        this.$message({
                            message: '关键行为回传成功',
                            type: 'success'
                        })
                    }
                }
            })
        },
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