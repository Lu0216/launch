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
      <el-button
        class="add_income"
        type="primary"
        icon="el-icon-edit"
        @click="handleAdd"
        >新增</el-button
      >

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
          prop="project"
          label="项目"
          align="center"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          prop="media"
          label="媒体"
          align="center"
          min-width="120px"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="expr"
          label="筛包规则"
          align="center"
          min-width="120px"
          show-overflow-tooltip
        >
        </el-table-column>
        
        <el-table-column
          prop="enable"
          label="状态"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.enable == '1'" type="danger"
              >启用</el-tag
            >
            <el-tag v-if="scope.row.enable == '2'" type="success"
              >停用</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="operator"
          label="操作人"
          align="center"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          prop="updated_at"
          label="操作时间"
          align="center"
          min-width="120px"
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
    <Add
      v-if="addvisible"
      :title="title"
      :projectList="projectList"
      :addloading="addloading"
      @close="handlecancel"
      @ok="saveAdd"
    />
    
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { getList ,getAdd} from "@/api/sievebag";
import {
  getProjectList,
} from "@/api/dynamic/public";
import { getToken } from "@/utils/auth"; // getToken from cookie
import Add from "./components/add.vue";
export default {
  name: "Adsdetail",
  components: {
    Pagination,
    Add
  },
  data() {
    return {
      dialogtitle: "编辑",
      dialogFormVisible: false,
      dialogFormVisible_add: false,
      dialogFormVisible_addMore: false,
      addvisible:false,
      addloading:false,
      total: 0,
      projectList: [],
      pagination: {
        page: 1,
        pageSize: 20,
      },
      listQuery: {
        proj_id: "",
      },
      token: getToken(),
      tableData: [],
      listLoading: true,
    };
  },
  created() {
    this.getProjectList();
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

    // 新增
    handleAdd() {
      this.title="新增";
      this.addloading = false;
      this.projectList = this.projectList
      this.addvisible = true;
    },
    // 关闭弹框
    handlecancel(value) {
      this.addvisible = value;
    },
    // 保存
    saveAdd(value) {
      getAdd(value)
        .then((res) => {
          if (res.error_code == 0) {
            this.addvisible = false;
            this.$message.success("新增成功");
            this.getList();
          }
        })
        .catch((res) => {
          this.$message.error(res.error_message);
          this.addvisible = false;
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
