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
        <el-input clearable v-model="listQuery.media_account_child"
        class="filter-item select-item" placeholder="请填写子账号" @change="handleFilter"/>
      </div>
      <div class="mr20">
        <span class="adname">计划名称：</span>
        <el-input clearable v-model="listQuery.plan_name"
        class="filter-item select-item" placeholder="请填写计划名称" @change="handleFilter"/>
      </div>
       <div class="mr20">
        <span class="adname">计划id：</span>
        <el-input clearable v-model="listQuery.plan_id"
        class="filter-item select-item" placeholder="请填写计划id" @change="handleFilter"/>
      </div>
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
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import {
  getProjectList,
  getMediaList,
  getMediaMasterList
} from "@/api/dynamic/public";
import {getDetailList} from '@/api/planclean'
import TableColumns from '@/components/Eltable/index'
export default {
  name: "Adsdetail",
  components: {
    Pagination,
    TableColumns
  },
  data() {
    return {
      total: 0,
      projectList: [],
      mediaList: [],
      customList:[], //关键行为类型
      accountList:[],
      pagination: {
        page: 1,
        pagesize: 10,
      },
      listQuery: {
        proj_id: "",
        media_id:'',
        media_account:'',
        media_account_child:'',
        plan_name:'',
        plan_id: ''
      },
      tableData: [],
      listLoading: true,
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
          width:'120',
        },
        {
          prop: 'media_name',
          label: '媒体',
          align: 'center' ,
          width:'150',
        },
        {
          prop: 'media_account',
          label: '主账户',
          align: 'center',
          // width:'180',
        },
        {
          prop: 'media_account_child',
          label: '子账户',
          align: 'center',
          // width:'180',
        },
        {
          prop: 'plan_name',
          label: '计划名称',
          align: 'center' ,
          // width:'120',
        },
        {
          prop: 'plan_id',
          label: '计划id',
          align: 'center' ,
          // width:'120',
        },
        {
          prop: 'operator',
          label: '操作人',
          align: 'center',
          width:'120',
        },
        {
          prop: 'updated_at',
          label: '操作时间',
          align: 'center' ,
          width:'180',
        },
      ]
    };
  },
  created() {
    this.getProjectList();
    this.getMediaList()
    this.getMediaMasterList();
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
    // 请求列表页数据
    getList() {
      this.listLoading = true;
      const { pagination, listQuery } = this;
      const params = {
        ...pagination,
        ...listQuery,
      };
      getDetailList(params)
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
  margin:10px;
}
</style>
