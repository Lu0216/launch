<template>
  <div class="income_div">
    <div class="income_header">
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
    <el-card shadow="never">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        border
        stripe
        v-loading="listLoading"
      >
        <el-table-column
          prop="app_code"
          label="项目"
          align="center"
          min-width="80px"
        >
        </el-table-column>
        <el-table-column
          prop="qrcode_url"
          label="广告预览链接"
          align="center"
          min-width="340px"
        >
        </el-table-column>
        
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />
    </el-card>
    
  </div>
</template>
<script>
import Pagination from "@/components/Pagination"
import { getList } from "@/api/adPreview"
import {
  getProjectList,
} from "@/api/dynamic/public";
import { getToken } from "@/utils/auth"; // getToken from cookie
export default {
  name: "adPreview",
  components: {
    Pagination,
  },
  data() {
    return {
      listQuery: {
        proj_id: "",
      },
      total: 0,
      pagination: {
        page: 1,
        pageSize: 5,
      },
      projectList: [],
      pagination: {
        page: 1,
        pageSize: 20,
      },
      token: getToken(),
      tableData: [],
      listLoading: true,
    };
  },
  created() {
    this.getProjectList()
    this.getList()
  },
  methods: {
    // 筛选
    handleFilter() {
      const { pagination } = this;
      pagination.page = 1;
      this.getList()
    },
    // 请求项目
    getProjectList() {
      getProjectList().then((data) => {
        if (data.error_code === 0) {
          this.projectList = data.data
        }
      })
    },
    // 请求数据
    getList() {
      this.listLoading = true;
      const { pagination, listQuery } = this;
      const params = {
        ...pagination,
        ...listQuery,
      };
      getList(params)
        .then((data) => {
          console.log(data.data);
          if (data.error_code === 0) {
            this.tableData = data.data;
            this.total = data.meta.total;
            this.listLoading = false;
          }
        })
        .catch(() => {
          this.$message({
            message: "加载失败",
            type: "error",
          });
        });
    },
  },
};
</script>
<style>
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
  width: 150px;
  margin: 10px 20px 0px 0px;
}
.input-item {
  width: 150px;
}
</style>
