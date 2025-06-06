<template>
  <div class="income_div">
    <div class="income_header">
      <div class="mr20">
        <span class="adname">项目：</span>
        <el-select
          v-model="listQuery.proj_id"
          clearable
          class="filter-item select-item"
          filterable
          placeholder="请选择项目"
          @change="handleFilter"
        >
          <el-option
            v-for="item in projectList"
            :key="item.id"
            :label="item.app_name"
            :value="item.id"
          />
        </el-select>
      </div>
      <div class="mr20">
        <span class="adname">媒体：</span>
        <el-select
          v-model="listQuery.media_id"
          clearable
          class="filter-item select-item"
          filterable
          placeholder="请选择媒体"
          @change="handleFilter">
          <el-option 
            v-for="(item) in mediaList" 
            :key="item.id" 
            :label="item.name_cn" 
            :value="item.id"/>
        </el-select>
      </div>
      <div class="mr20">
        <span  class="adname">主账号：</span>
        <el-select
          v-model="listQuery.media_account_id"
          clearable
          class="filter-item select-item"
          filterable
          placeholder="请选择账号"
          @change="handleFilter">
          <el-option v-for="(item) in accountList" :key="item.id" :label="item.account" :value="item.id"/>
        </el-select>
      </div>
      <div class="mr20">
        <span class="adname">子账号：</span>
        <el-input clearable v-model="listQuery.media_account_child_id" 
        class="filter-item select-item" placeholder="请填写子账号" @change="handleFilter"/>
      </div>
      <div class="mr20">
        <span class="adname">操作人：</span>
        <el-select
        v-model="listQuery.operator"
        clearable
        class="filter-item select-item"
        filterable
        placeholder="请选择操作人"
        @change="handleFilter"
      >
        <el-option
          v-for="item in operatorList"
          :key="item.operator"
          :label="item.operator"
          :value="item.operator"
        />
      </el-select>
      </div>
      <div class="mr20">
        <span class="adname">操作时间：</span>
        <el-date-picker
        v-model="listQuery.date"
        size="mini"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        style="margin: 10px 20px 0px 0px;"
        @blur="handleFilter"/>
      </div>
      <el-button
        class="add_income"
        type="primary"
        @click="handleAdd(1)"
        >新增</el-button
      >
      <el-button
        class="add_income"
        type="primary"
        @click="handleAdd(2)"
        >批量上传</el-button
      >

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
      v-if="addvisible"
      :dialogFormVisible="addvisible"
      :addloading="addloading"
      :mediaList="mediaList"
      :dialogType="dialogType"
      @close="handlecancel"
      @saveAdd="saveAdd"
    />
    
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import {
  getProjectList,
  getMediaList,
  getMediaMasterList
} from "@/api/dynamic/public";
import { getOperator } from "@/api/adsdimension"
import {getAdd ,getList, getImport, getDel} from '@/api/planclean'
import { getToken } from "@/utils/auth"; // getToken from cookie
import Add from "./components/add.vue";
import TableColumns from '@/components/Eltable/index'
export default {
  name: "Adsdetail",
  components: {
    Pagination,
    Add,
    TableColumns
  },
  data() {
    return {
      dialogFormVisible: false,
      addvisible:false,
      addloading:false,
      total: 0,
      projectList: [],
      mediaList: [],
      accountList:[],
      operatorList:[],
      pagination: {
        page: 1,
        pagesize: 10,
      },
      listQuery: {
        proj_id: "",
        media_id:'',
        media_account:'',
        media_account_child_id:'',
        operator:'',
        date: ''
      },
      dialogType: '',
      token: getToken(),
      tableData: [],
      listLoading: true,
      initData:{},
      columns:[
         {
          prop: 'id', 
          label: '序号', 
          align: 'center' ,
          width:'120', 
        },
        {
          prop: 'proj_name', 
          label: '项目', 
          align: 'center' ,
        },
        {
          prop: 'media_name', 
          label: '媒体', 
          align: 'center' ,
        },
        {
          prop: 'media_account', 
          label: '主账户', 
          align: 'center',
        },
        {
          prop: 'media_account_child_id', 
          label: '子账户', 
          align: 'center',
        },
        {
          prop: 'operator', 
          label: '操作人', 
          align: 'center' ,
        },
        {
          prop: 'updated_at', 
          label: '操作时间', 
          align: 'center' ,
        },
        {
          prop: 'operate', 
          label: '操作', 
          align: 'center' ,
          width:'150',
          render: (h, params) => {
            return (
                <div>
                    <el-button type="primary"  onClick={() => this.handleDelete(params.row)}>删除</el-button>
                </div>
            )
          }
        },
      ]
    };
  },
  created() {
    this.getProjectList();
    this.getMediaList()
    this.getMediaMasterList();
    this.getOperator();
    this.getList();
  },
  methods: {
    // 筛选
    handleFilter() {
      const { pagination } = this;
      pagination.page = 1;
      this.getList();
    },
    // 请求项目
    getProjectList() {
      getProjectList().then((data) => {
        if (data.error_code === 0) {
          this.projectList = data.data;
        }
      });
    },
    // 媒体
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
    // 主账号
    getMediaMasterList() {
      getMediaMasterList().then((data) => {
        if (data.error_code === 0) {
          this.accountList = data.data
        }
      })
    },
    // 操作人
    getOperator() {
      getOperator().then(res => {
        if(res.error_code ==0) {
          this.operatorList = res.data
        }
      })
    },
    // 请求列表页数据
    getList() {
      this.listLoading = true;
      
      const { pagination, listQuery } = this;
      const params = {
        ...pagination,
        ...listQuery,
        startTime: listQuery.date[0] ? listQuery.date[0] : '',
        endTime: listQuery.date[1] ? listQuery.date[1] : ''
      };
      getList(params)
        .then((data) => {
          if (data.error_code === 0) {
            this.tableData = data.data.data;
            this.total = data.meta.total;
            this.listLoading = false;
          }
        })
        .catch(() => {
          this.listLoading = false;
          this.$message({
            message: "加载失败",
            type: "error",
          });
        });
    },
    // 新增
    handleAdd(type) {
      this.title="新增";
      this.addvisible = true;
      // type==1新增，type==2批量上传
      this.dialogType = type
    },
    // 关闭弹框
    handlecancel(value) {
      this.addvisible = value;
      
    },
    // 保存
    saveAdd(value) {
      this.addloading = true;
      if(this.dialogType == 1) {
        this.getAdd(value)
      } else {
        this.getImport(value)
      }
    },
    // 删除按钮点击
    handleDelete(item){
       getDel({id:item.id}).then( (data) => {
        if(data.error_code === 0) {
            this.$message({
                type: 'success',
                message: data.error_message || '删除成功!'
            })
            this.getList()
        }
      })
    },
    getImport(value) {
      this.addloading = false;
      getImport(value)
        .then((res) => {
          if (res.error_code == 0) {
            this.addvisible = false;
            this.$message.success("新增成功");
            this.getList();
          }
        })
        .catch((res) => {
          this.addvisible = false;
        });
    },
    getAdd(value) {
      this.addloading = false;
      getAdd(value)
        .then((res) => {
          if (res.error_code == 0) {
            this.addvisible = false;
            this.$message.success("新增成功");
            this.getList();
          }
        })
        .catch((res) => {
          this.addvisible = false;
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
  },
};
</script>
<style scoped>
.el-dialog {
  width: 550px;
}
.income_div {
  padding: 10px 20px 20px 20px;
}
.income_header {
  margin-bottom: 20px;
}
.incometable {
  border: none;
  border-left: 1px solid #ebeef5;
  margin-top: 20px;
}
.incometable::before {
  height: 0px;
}
.incometable .el-table__header {
  border-top: 1px solid #ebeef5;
}
.incometable .el-table__body-wrapper {
  max-height: 600px;
  overflow-y: auto;
}
.income_div .el-dialog__header {
  border-bottom: 1px solid #ebeef5;
}
.income_select {
  width: 200px;
  margin-left: 10px;
}
.adname {
  font-size: 14px;
  margin-left: 10px;
}
.select-item {
  width: 180px;
  margin: 10px 20px 0px 0px;
}
.input-item {
  width: 150px;
}
.mr20 {
  display: inline-block;
  margin-right:10px;
}
</style>
