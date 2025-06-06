<template>
  <div class="income_div">
    <div class="income_header">
      <span class="adname">代理：</span>
      <el-select
        v-model="listQuery.name"
        clearable
        class="filter-item select-item"
        filterable
        placeholder="请选择代理"
        @change="handleFilter"
      >
        <el-option
          v-for="item in agentList"
          :key="item.id"
          :label="item.short_name"
          :value="item.id"
        />
      </el-select>
      <span class="adname">媒体：</span>
      <el-select
        v-model="listQuery.media_id"
        clearable
        class="filter-item select-item"
        filterable
        placeholder="请选择媒体"
        @change="handleFilter"
      >
        <el-option
          v-for="item in mediaList"
          :key="item.id"
          :label="item.name_cn"
          :value="item.id"
        />
      </el-select>
      <span class="adname">主账号：</span>
      <el-select
        v-model="listQuery.media_account_id"
        clearable
        class="filter-item select-item"
        filterable
        placeholder="请选择账号"
        @change="handleFilter"
      >
        <el-option
          v-for="item in accountList"
          :key="item.id"
          :label="item.account"
          :value="item.id"
        />
      </el-select>
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
      <span class="adname">子账号：</span>
      <el-input
        clearable
        v-model="listQuery.media_account_child"
        class="filter-item select-item"
        placeholder="请填写子账号"
        @change="handleFilter"
      />
      <el-button
        class="add_income"
        type="primary"
        icon="el-icon-edit"
        @click="addDialog"
        >添加</el-button
      >
    </div>
    <el-card shadow="never">
      <el-table
        ref="multipleTable"
        v-loading="listLoading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="id" label="序号"> </el-table-column>
        <el-table-column prop="media_account" label="主账号"> </el-table-column>
        <el-table-column
          prop="media_account_child"
          label="子账号id"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="operator" label="创建者"> </el-table-column>
        <el-table-column prop="created_at" label="创建时间"> </el-table-column>
        <!-- <el-table-column
          label="操作"
          align="center"
          min-width="100px"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="deleteValue(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column> -->
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pagesize"
        @pagination="getList"
      />
    </el-card>
    <Add
      :projectList="projectList"
      :accountList="accountList"
      :dialogFormVisible="dialogFormVisible_add"
      @updateAddvisible="updateAddvisible"
      @addSub="addSub"
    />
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import Add from "./components/Add";
import {
  getSubList,
  addSub,
  deleteSub,
  subDownload,
  addSubMore,
  statusSub,
} from "@/api/dynamic/specialsub";
import {
  getMediaList,
  getProjectList,
  getAgent,
  getMediaMasterList,
  getMediaChildList,
} from "@/api/dynamic/public";
import { getToken } from "@/utils/auth"; // getToken from cookie
export default {
  name: "specialsub",
  components: { Pagination, Add },
  data() {
    const validatePass = (rule, value, callback) => {
      let reg = /^[0-9a-zA-Z_]{1,}$/;
      if (!reg.test(value)) {
        callback(new Error("子账号id只支持字母数字下划线"));
      } else {
        callback();
      }
    };
    return {
      dialogtitle: "用户编辑",
      dialogFormVisible: false,
      dialogFormVisible_add: false,
      dialogFormVisible_addMore: false,
      add_form: {
        proj_id: "",
        media_account_child: "",
        media_account_id: "",
      },
      formLabelWidth: "120px",
      name: "",
      total: 0,
      mediaList: [],
      mediaChild: [], //关联子账户
      agentList: [],
      projectList: [], //选择项目
      accountList: [],
      pagination: {
        page: 1,
        pagesize: 20,
      },
      listQuery: {
        name: "",
        media_account_id: "",
        media_id: "",
        proj_id: "",
        media_account_child: "",
      },
      token: getToken(),
      tableData: [],
      listLoading: false,
      rule: {
        proj_id: [{ required: true, message: "请选择项目", trigger: "change" }],
        media_account_child: [
          { required: true, message: "请输入子账号", trigger: "blur" },
          { required: true, validator: validatePass, trigger: "blur" },
        ],
        media_account_id: [
          { required: true, message: "请选择主账号", trigger: "blur" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
      list: [],
      start: true,
      stop: true,
      multipleSelection: [],
      visibleStatus: false,
      media_id: "",
    };
  },
  created() {
    // this.rule = this.rules
    this.getAgent();
    this.getMediaList();
    this.getProjectList();
    this.getAccount();
    this.getList();
  },
  methods: {
    // 筛选
    handleFilter(value) {
      const { pagination } = this;
      pagination.page = 1;
      this.getList();
    },
    // 新增按钮点击
    addDialog() {
      this.dialogFormVisible_add = true;
    },
    //新增弹窗显示隐藏
    updateAddvisible(val) {
      this.dialogFormVisible_add = val;
    },
    // 确认添加
    addSub(value) {
      addSub(value)
        .then((data) => {
          if (data.error_code === 0) {
            this.getList();
          }
          this.dialogFormVisible_add = false
        })
        .catch((error) => {
          this.$message.error(error.error_message);
          this.dialogFormVisible_add = false
        });
    },
    // 删除
    deleteValue(value) {
      deleteSub({ media_account_child: value.media_account_child })
        .then((data) => {
          if (data.error_code === 0) {
            this.getList();
          }
        })
        .catch((error) => {
          this.$message.error(error.error_message);
        });
    },
    // 请求代理
    getAgent() {
      getAgent().then((data) => {
        if (data.error_code === 0) {
          this.agentList = data.data;
        }
      });
    },
    // 请求媒体
    getMediaList() {
      getMediaList().then((data) => {
        if (data.error_code === 0) {
          this.mediaList = data.data;
        }
      });
    },
    // 请求项目
    getProjectList() {
      getProjectList().then((data) => {
        if (data.error_code === 0) {
          this.projectList = data.data;
        }
      });
    },
    // 请求主账号
    getAccount() {
      getMediaMasterList().then((data) => {
        if (data.error_code === 0) {
          this.accountList = data.data;
        }
      });
    },
    // 请求数据
    getList() {
      const { pagination, listQuery } = this;
      const params = {
        ...pagination,
        ...listQuery,
      };
      getSubList(params)
        .then((data) => {
          this.listLoading = true;
          if (data.error_code === 0) {
            this.listLoading = false;
            this.tableData = data.data;
            this.total = data.meta.total;
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
