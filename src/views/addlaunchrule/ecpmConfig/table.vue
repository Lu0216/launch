<template>
  <div class="offline_wrap">
    <div class="offline_cont">
      <span class="adname">项目：</span>
      <el-select
        v-model="listQuery.app_id"
        :default-first-option="true"
        class="filter-item select-item"
        filterable
        placeholder="请选择项目"
        @change="handleFilter"
      >
        <el-option label="全部" value="" />
        <el-option
          v-for="item in projectsList"
          :key="item.id"
          :label="item.app_name"
          :value="item.id"
        />
      </el-select>
      <el-button
        class="add_income"
        type="primary"
        icon="el-icon-add"
        @click="addDialog"
        >新增</el-button
      >
    </div>
    <el-card shadow="never">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        border="border"
        v-loading="listLoading"
        highlight-current-row
        @select="selectTableItem" @select-all="selectAllTableItem"
      >
      <el-table-column type="selection" width="55" prop="select" header-align="center"
          align="center">

      </el-table-column>
        <el-table-column
          v-for="column in columns"
          header-align="center"
          :fixed="column.fixed"
          :sortable="column.sortable"
          :key="column.key"
          :prop="column.prop"
          :label="column.label"
          :align="column.align"
          :width="column.width"
        >
        </el-table-column>
        <el-table-column
          prop="operate"
          label="操作"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="primary" @click="handleEdit(scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        align="center"
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.page_size"
        @pagination="getList"
      />
    </el-card>
    <Add
      :title="title_add"
      :initData="initData"
      :projectsList="projectsList"
      :dialogFormVisible="dialogFormVisible_add"
      :btnloading="btnloading"
      @updateAddvisible="updateAddvisible"
      @addCongig="addCongig"
      @editCongig="editCongig"
    />
  </div>
</template>

<script>
import { getList, addCongig } from "@/api/ecpmConfig";
import { getProjectList } from "@/api/dynamic/public";
import TableColumns from "@/components/Eltable/index";
import Pagination from "@/components/Pagination";
import Add from "./components/add.vue";
export default {
  name: "ecpmConfig",
  components: {
    TableColumns,
    Pagination,
    Add
  },
  data() {
    return {
      title_add: "",
      tableData: [],
      projectsList: [],
      initData: {},
      selectid: "",
      listLoading: false,
      btnloading: false,
      dialogFormVisible_add: false,
      total: 0,
      listQuery: {
        app_id: "",
        page: 1,
        pageSize: 50
      },
      columns: [
        {
          prop: "app_code",
          label: "项目",
          align: "center",
        },
        {
          prop: "max_ecpm",
          label: "MAX",
          align: "center",
        },
        {
          prop: "min_ecpm",
          label: "MIN",
          align: "center",
        },
        {
          prop: "operator",
          label: "操作人",
          align: "center"
        },
        {
          prop: "updated_at",
          label: "操作时间",
          align: "center"
        }
      ]
    };
  },
  created() {
    this.getList();
    this.getProjectList();
  },

  methods: {
    // 获取列表数据
    getList() {
      this.listLoading = true;
      let datasrc = this.listQuery;
      getList(datasrc)
        .then(data => {
          if (data.error_code === 0) {
            this.total = data.meta.total
            this.tableData = data.data
            this.listLoading = false
          }
        })
        .catch(() => {
          this.$message({
            message: "加载失败",
            type: "error"
          });
        });
    },
    // 选中列表
    selectTableItem(selection,row) {
      console.log('99',selection);
      console.log('row22',row);
      this.selectList = selection
    },
    // 全选
    selectAllTableItem(selection) {
      console.log('88',selection);
      this.selectList = selection
    },
    handleFilter() {
      const { listQuery } = this;
      listQuery.page = 1;
      this.getList();
    },
    // 项目
    getProjectList() {
      getProjectList()
        .then(data => {
          if (data.error_code === 0) {
            this.projectsList = data.data;
          }
        })
        .catch(() => {
          this.$message({
            message: "加载项目失败",
            type: "error"
          });
        });
    },
    //新增弹窗显示隐藏
    updateAddvisible(val) {
      this.dialogFormVisible_add = false;
    },
    addDialog() {
      this.dialogFormVisible_add = true;
      this.title_add = "新增";
      this.initData = {};
    },
    handleEdit(row) {
      this.title_add = "编辑";
      this.dialogFormVisible_add = true;
      this.initData = row;
      this.selectid = row.id;
    },
    addCongig(datasrc) {
      this.btnloading = true;
      addCongig(datasrc)
        .then(data => {
          if (data.error_code === 0) {
            this.$message({
              type: "success",
              message: data.error_message || "添加成功!"
            });
            this.btnloading = false;
            this.dialogFormVisible_add = false;
            this.getList();
          } else {
            this.btnloading = false;
            this.$message({
              type: "error",
              message: "添加失败!"
            });
          }
        })
        .catch(() => {
          this.btnloading = false;
          this.dialogFormVisible_add = false;
        });
    },
    editCongig(datasrc) {
      const params = {
        id: this.selectid,
        ...datasrc
      };
      addCongig(params)
        .then(data => {
          if (data.error_code === 0) {
            this.$message({
              type: "success",
              message: data.error_message || "修改成功!"
            });
            this.btnloading = false;
            this.dialogFormVisible_add = false;
            this.getList();
          } else {
            this.btnloading = false;
            this.$message({
              type: "error",
              message: "修改失败!"
            });
          }
        })
        .catch(() => {
          this.btnloading = false;
          this.dialogFormVisible_add = false;
        });
    },
    // 分页- pageSize
    handleSizeChange(val) {
      const { listQuery } = this;
      listQuery.pageSize = val;
      listQuery.page = 1;
      this.getList();
    },
    // 分页- page
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    }
  }
};
</script>

<style>
.offline_wrap {
  padding: 10px 20px 20px 20px;
}
.offline_cont {
  margin-bottom: 20px;
}
.select-item {
  width: 150px;
  margin: 10px 20px 0px 0px;
}
.deleteDialog .el-dialog__body {
  padding-top: 0;
  text-align: right;
}
.form_input {
  width: 200px;
}
</style>
