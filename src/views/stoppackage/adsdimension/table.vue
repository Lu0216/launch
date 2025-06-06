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
      <span class="adname">媒体：</span>
      <el-select
        v-model="listQuery.media_id"
        clearable
        class="filter-item select-item"
        filterable
        placeholder="请选择媒体"
        @change="changeMedia"
      >
        <el-option
          v-for="item in mediaList"
          :key="item.id"
          :label="item.name_cn"
          :value="item.id"
        />
      </el-select>
      <span class="adname">渠道号：</span>
      <el-input
        clearable
        v-model="listQuery.src"
        class="filter-item select-item"
        placeholder="请填写渠道号"
        @change="handleFilter"
      />
      <span class="adname">当前广告组状态(内部)：</span>
      <el-select
        v-model="listQuery.campaign_status"
        :default-first-option="true"
        class="filter-item select-item"
        filterable
        placeholder="请选择广告组状态"
        @change="handleFilter"
      >
        <el-option label="全部" value="" />
        <el-option label="投放中" :value="1" />
        <el-option label="停投" :value="2" />
      </el-select>
      <span class="adname">当前广告组状态(外部)：</span>
      <el-select
        v-model="listQuery.status_cn"
        :default-first-option="true"
        class="filter-item select-item"
        filterable
        placeholder="请选择广告组状态"
        @change="handleFilter"
      >
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        />
      </el-select>
      <span class="adname">广告组名称：</span>
      <el-input
        clearable
        v-model="listQuery.campaign_name"
        class="filter-item select-item"
        placeholder="请填写广告组名称"
        @change="handleFilter"
      />
      <span class="adname">广告组id：</span>
      <el-input
        clearable
        v-model="listQuery.campaign_id"
        class="filter-item select-item"
        placeholder="请填写广告组id"
        @change="handleFilter"
      />
      <span class="adname">主账号：</span>
      <el-select
        v-model="listQuery.media_account_id"
        clearable
        class="filter-item select-item"
        filterable
        placeholder="请选择主账号"
        @change="handleFilter"
      >
        <el-option
          v-for="item in accountList"
          :key="item.id"
          :label="item.account"
          :value="item.id"
        />
      </el-select>
      <span class="adname">投放类型：</span>
      <el-select
        v-model="listQuery.is_hosting"
        :default-first-option="true"
        class="filter-item select-item"
        filterable
        placeholder="请选择投放类型"
        @change="handleFilter"
      >
        <el-option label="全部" value="" />
        <el-option label="智能托管" :value="1" />
        <el-option label="普通" :value="2" />
      </el-select>
      <el-button
        class="add_income"
        type="primary"
        icon="el-icon-edit"
        @click="openMore"
        >批量操作</el-button
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
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" align="center" width="55">
        </el-table-column> -->
        <el-table-column
          prop="proj"
          label="项目"
          align="center"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          prop="src"
          label="渠道号"
          align="center"
          min-width="120px"
          show-overflow-tooltip
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
          prop="media_account"
          label="主账号"
          align="center"
          min-width="180px"
        >
        </el-table-column>
        <el-table-column
          prop="media_account_child"
          label="子账号"
          align="center"
          min-width="180px"
        >
        </el-table-column>
        <el-table-column
          prop="opti"
          label="优化代理"
          align="center"
          min-width="100px"
        >
        </el-table-column>
        <el-table-column
          prop="campaign_name"
          label="广告组名称"
          align="center"
          min-width="180px"
        >
        </el-table-column>
        <el-table-column
          prop="campaign_id"
          label="广告组id"
          align="center"
          min-width="180px"
        >
        </el-table-column>
        <el-table-column
          prop="is_hosting"
          label="投放类型"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.is_hosting == '1'" type="danger"
              >智能托管</el-tag
            >
            <el-tag v-if="scope.row.is_hosting == '2'" type="success"
              >普通</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="budget"
          label="日预算（元/天）"
          align="center"
          min-width="180px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.budget }}</span>
            <i
              @click="changebudget(scope.row)"
              class="el-icon-edit"
              style="
                font-size: 20px;
                color: #409eff;
                cursor: pointer;
                padding-right: 5px;
              "
            ></i>
            <!-- <i
              @click="changetime(scope.row)"
              class="el-icon-time"
              style="
                font-size: 20px;
                color: #409eff;
                cursor: pointer;
                padding-right: 5px;
              "
            ></i> -->
            <i
              @click="changesettime(scope.row)"
              class="el-icon-refresh-left"
              style="font-size: 20px; color: #409eff; cursor: pointer"
            ></i>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="active_ad"
          label="媒体激活数"
          align="center"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          prop="active_cost_ad"
          label="媒体激活成本"
          align="center"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          prop="charge"
          label="消耗"
          align="center"
          min-width="120px"
        >
        </el-table-column> -->
        <el-table-column
          prop="updated_at"
          label="最后修改时间"
          align="center"
          min-width="180px"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="当前广告组状态（内部）"
          align="center"
          min-width="120px"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == '1'" type="success"
              >投放中</el-tag
            >
            <el-tag v-if="scope.row.status == '2'" type="danger">停投</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="status_cn"
          label="当前广告组状态（外部）"
          align="center"
          min-width="120px"
        >
          
        </el-table-column>
        <el-table-column
          prop="status"
          label="操作"
          fixed="right"
          align="center"
          min-width="200px"
        >
          <template slot-scope="scope">
            <el-button
              type="success"
              v-if="scope.row.status == '2'"
              :loading="
                disabledbtn2 &&
                scope.row.media_id === selectedId2 &&
                scope.row.campaign_id === selectedcam2
              "
              @click="endbledChange(scope.row)"
              >开启</el-button
            >
            <el-button
              type="danger"
              v-if="scope.row.status == '1'"
              :loading="
                disabledbtn &&
                scope.row.media_id === selectedId &&
                scope.row.campaign_id === selectedcam
              "
              @click="disabledChange(scope.row)"
              >停投</el-button
            >
            <el-button type="primary" @click="viewChange(scope.row)"
              >查看</el-button
            >
          </template>
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
    <EditBudget
      v-if="budgetvisible"
      :title="title"
      :editData="editData"
      :editbtnloading="editbtnloading"
      @close="handlecancel"
      @ok="saveBudget"
    />
    <!-- <SetTimeout
      v-if="timevisible"
      :title="title"
      :initdata="initdata"
      :timebtnloading="timebtnloading"
      @close="handlecancel"
    /> -->
    <Operationtable
      v-if="operavisible"
      :title="title"
      :opearData="opearData"
      :operabtnloading="operabtnloading"
      @close="handlecancel"
    />
    <BatchOperation
      v-if="batchvisible"
      :title="title"
      :batchData="batchData"
      :batchbtnloading="batchbtnloading"
      @close="handlecancel"
      @ok="saveBatch"
    />
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import {
  getList,
  getBudget,
  getEnabled,
  getDisabled,
  getDetaile,
  getBatch,
  getStatuscd
} from "@/api/adsdimension";
import {
  getMediaList,
  getProjectList,
  getAgent,
  getMediaMasterList,
} from "@/api/dynamic/public";
import { getToken } from "@/utils/auth"; // getToken from cookie
import EditBudget from "./components/editBudget.vue";
import Operationtable from "./components/operationTable.vue";
// import SetTimeout from "./components/setTimeout.vue";
import BatchOperation from "./components/batchOperation.vue";
export default {
  name: "Adsdimension",
  components: {
    Pagination,
    EditBudget,
    Operationtable,
    // SetTimeout,
    BatchOperation,
  },
  data() {
    return {
      dialogtitle: "编辑",
      dialogFormVisible: false,
      dialogFormVisible_add: false,
      dialogFormVisible_addMore: false,
      disabledbtn2: false,
      disabledbtn: false,
      selectedId2: "",
      selectedId: "",
      selectedcam: "",
      selectedcam2: "",
      total: 0,
      mediaList: [],
      statusList:[
        // {
        //   "name": "已暂停",
        //   value:'已暂停'
        // },
        // {
        //   "name": "超出预算",
        //   value:'10'
        // }
      ], //广告组状态外部
      projectList: [],
      accountList: [],
      pagination: {
        page: 1,
        pageSize: 20,
      },
      listQuery: {
        media_id: 5,
        proj_id: "",
        src: "",
        campaign_name: "",
        campaign_id:"",
        campaign_status: "",
        media_account_id: "",
        is_hosting: "",
        status_cn:'',
      },
      token: getToken(),
      tableData: [],
      listLoading: true,
      list: [],
      multipleSelection: [],
      visibleStatus: false,
      budgetvisible: false,
      editbtnloading: false,
      timevisible: false,
      timebtnloading: false,
      operavisible: false,
      operabtnloading: false,
      batchvisible: false,
      batchbtnloading: false,
      editData: {},
      opearData: {},
      batchData: {},
    };
  },
  created() {
    if(this.listQuery.media_id !=='') {
      this.getStatuscd(this.listQuery.media_id)
    }
    this.getMediaList();
    this.getProjectList();
    this.getAccount();
    this.getList();
  },
  methods: {
    // 媒体发生改变时，请求 广告组状态外部 数据
    changeMedia(value) {
      this.getList();
      if(value !== '') {
        this.getStatuscd(value)
      }
      
    },
    // 筛选
    handleFilter() {
      const { pagination } = this;
      pagination.page = 1;
      this.getList();
    },
    // 广告组状态外部
    getStatuscd(value) {
      getStatuscd({media_id:value}).then((data) => {
        if (data.error_code === 0) {
          this.statusList = data.data;
        }
      });
    },
    // 多选项操作
    handleSelectionChange(val) {
      var ids = [];
      if (val.length > 0) {
        this.start = false;
        this.stop = false;
        for (var key in val) {
          ids.push(val[key].id);
          if (val[key].status === 2) {
            // 暂停状态
            this.stop = true;
            continue;
          }
          if (val[key].status === 1) {
            this.start = true;
          }
        }
      } else {
        this.start = true;
        this.stop = true;
      }
      this.multipleSelection = ids;
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
    // 请求账号
    getAccount() {
      getMediaMasterList().then((data) => {
        if (data.error_code === 0) {
          this.accountList = data.data;
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
    // 修改预算
    changebudget(row) {
      this.budgetvisible = true;
      this.editData = row;
      this.title = "修改预算（实时数据）";
      this.editbtnloading = false;
    },
    // 关闭弹窗
    handlecancel(value) {
      this.budgetvisible = value;
      this.editbtnloading = value;
      this.timebtnloading = value;
      this.timevisible = value;
      this.operavisible = value;
      this.operabtnloading = value;
      this.batchvisible = value;
      this.batchbtnloading = value;
    },
    // 保存 修改预算
    saveBudget(value) {
      //   console.log(value, "---修改预算的保存数据");
      let params = {
        media_id: value.media_id,
        campaign_id: value.campaign_id,
        budget: value.budget,
      };
      getBudget(params).then((res) => {
        if (res.error_code == 0) {
          this.budgetvisible = false;
          this.$message.success("修改成功");
          this.getList();
        } else {
          this.$message(res.error_code);
        }
      });
    },
    // 定时任务
    // changetime(row) {
    //     console.log('定时任务');
    //     this.title="定时任务";
    //     this.timebtnloading = false;
    //     this.initdata=row;
    //     this.timevisible = true;
    // },
    // 点击查看操作历史记录
    changesettime(row) {
      let params = {
        media_id: row.media_id,
        campaign_id: row.campaign_id,
        operation_status: 3,
      };
      getDetaile(params).then((res) => {
        if (res.error_code == 0) {
          this.opearData = res;
          this.title = "操作历史";
          this.editbtnloading = false;
          this.operavisible = true;
        } else {
          this.$message(res.error_code);
        }
      });
    },
    // 批量操作
    openMore() {
      this.title = "批量操作";
      this.batchvisible = true;
      this.batchbtnloading = false;
      this.batchData = this.projectList;
    },
    // 查看 跳转到详情页
    viewChange(row) {
      this.$router.push({
        path: "/plandimension",
        query: { media_id: row.media_id ,campaign_id:row.campaign_id},
      });
    },
    // 停投
    disabledChange(row) {
      this.disabledbtn = true;
      this.selectedId = row.media_id;
      this.selectedcam = row.campaign_id;
      let parmas = {
        media_id: row.media_id,
        campaign_id: row.campaign_id,
      };
      getDisabled(parmas)
        .then((res) => {
          if (res.error_code == 0) {
            this.$message.success("停投成功");
            this.getList();
            this.disabledbtn = false;
          }
        })
        .catch((res) => {
          this.$message.error(res.error_message);
          this.disabledbtn = false;
        });
    },
    // 开启
    endbledChange(value) {
      this.disabledbtn2 = true;
      this.selectedId2 = value.media_id;
      this.selectedcam2 = value.campaign_id;
      getEnabled(value)
        .then((res) => {
          if (res.error_code == 0) {
            this.$message.success("开启成功");
            this.getList();
            this.disabledbtn2 = false;
          }
        })
        .catch((res) => {
          this.$message.error(res.error_message);
          this.disabledbtn2 = false;
        });
    },
    // 批量操作
    saveBatch(value) {
      getBatch(value)
        .then((res) => {
          if (res.error_code == 0) {
            this.batchvisible = false;
            this.$message.success("批量操作成功");
            this.getList();
          }
        })
        .catch((res) => {
          this.$message.error(res.error_message);
          this.batchvisible = false;
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
  margin: 10px 20px 10px 0px;
}
.input-item {
  width: 150px;
}
</style>
