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
        placeholder="请填写子账号"
        @change="handleFilter"
      />
      <span class="adname">优化代理：</span>
      <el-select
        v-model="listQuery.agency_opti"
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
      <span class="adname">当前计划状态（内部）：</span>
      <el-select
        v-model="listQuery.status"
        :default-first-option="true"
        class="filter-item select-item"
        filterable
        placeholder="请选择计划状态"
        @change="handleFilter"
      >
        <el-option label="全部" value="" />
        <el-option label="投放中" :value="1" />
        <el-option label="停投" :value="2" />
      </el-select>
      <span class="adname">当前计划状态(外部)：</span>
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
      <span class="adname">计划名称：</span>
      <el-input
        clearable
        v-model="listQuery.unit_name"
        class="filter-item select-item"
        placeholder="请填写计划名称"
        @change="handleFilter"
      />
      <span class="adname">计划id：</span>
      <el-input
        clearable
        v-model="listQuery.unit_id"
        class="filter-item select-item"
        placeholder="请填写计划id"
        @change="handleFilter"
      />
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
      <!-- <el-button
        class="add_income"
        type="primary"
        icon="el-icon-edit"
        @click="changeBid"
        :disabled="this.multipleSelection.length <= 0"
        >批量修改出价</el-button
      > -->
      <el-button
        class="add_income"
        type="warning"
        icon="el-icon-edit"
        @click="changeStatus"
        >批量修改状态</el-button
      >
    </div>
    <el-card shadow="never">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        v-loading="listLoading"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column
          type="selection"
          align="center"
          width="55"
          :selectable="changeSelect"
        >
        </el-table-column> -->
        <el-table-column
          prop="app_name_cn"
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
          prop="agency_opti"
          label="优化代理"
          align="center"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          prop="account"
          label="主账号"
          align="center"
          min-width="180px"
        >
        </el-table-column>
        <el-table-column
          prop="campaign_name"
          label="广告组名称"
          align="center"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          prop="campaign_id"
          label="广告组id"
          align="center"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          prop="unit_name"
          label="计划名称"
          align="center"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          prop="unit_id"
          label="计划id"
          align="center"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          prop="active_ad"
          label="媒体激活数"
          align="center"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          prop="bid_amount"
          label="出价"
          align="center"
          min-width="120px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.bid_amount }}</span>
            <i
              v-if="scope.row.media_id == 1||(scope.row.media_id == 2&& scope.row.is_hosting !==1)||scope.row.media_id == 5"
              @click="changePrice(scope.row)"
              class="el-icon-edit"
              style="font-size: 20px; color: #409eff; cursor: pointer"
            ></i>
            <i
              v-if="scope.row.media_id == 1||(scope.row.media_id == 2&& scope.row.is_hosting !==1)||scope.row.media_id == 5"
              @click="showPrice(scope.row)"
              class="el-icon-time"
              style="font-size: 20px; color: #409eff; cursor: pointer"
            ></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="dep_bid_amount"
          label="深度转化出价"
          align="center"
          min-width="120px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.dep_bid_amount }}</span>
            <i
              v-if="(scope.row.media_id == 2&& scope.row.is_hosting !==1)||scope.row.media_id == 5 "
              @click="changeDeepPrice(scope.row)"
              class="el-icon-edit"
              style="font-size: 20px; color: #409eff; cursor: pointer"
            ></i>
            <i
              v-if="(scope.row.media_id == 2&& scope.row.is_hosting !==1)||scope.row.media_id == 5 "
              @click="showDeepPrice(scope.row)"
              class="el-icon-time"
              style="font-size: 20px; color: #409eff; cursor: pointer"
            ></i>
          </template>
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
          prop="updated_at"
          label="计划最后修改时间"
          align="center"
          min-width="180px"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="当前计划状态（内部）"
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
          label="当前计划状态（外部）"
          align="center"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="操作"
          fixed="right"
          align="center"
          min-width="180px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 1"
              type="danger"
              :loading="disabledbtn && scope.row.unit_id === selectedId"
              :disabled="scope.row.is_hosting == 1 && scope.row.media_id == 2"
              @click="statusChange(scope.row)"
              >停投
            </el-button>
            <el-button
              v-if="scope.row.status == 2"
              type="success"
              @click="statusChange(scope.row)"
              :loading="disabledbtn2 && scope.row.unit_id === selectedId2"
              :disabled="scope.row.is_hosting == 1 && scope.row.media_id == 2"
              >开启</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </el-card>
    <EditBid
      v-if="bidvisible"
      :title="title"
      :bidData="bidData"
      :bidbtnloading="bidbtnloading"
      @close="handlecancel"
      @ok="saveBid"
    />
    <BidTable
      v-if="bidtablevisible"
      :title="title"
      :bidtableData="bidtableData"
      :bidtablebtnloading="bidtablebtnloading"
      @close="handlecancel"
    />
    <EditDepthBid
      v-if="depthbidvisible"
      :title="title"
      :depthbidData="depthbidData"
      :depthbidbtnloading="depthbidbtnloading"
      @close="handlecancel"
      @ok="saveDeepbid"
    />
    <DepthbidTable
      v-if="deptablevisible"
      :title="title"
      :deptableData="deptableData"
      :deptablebtnloading="deptablebtnloading"
      @close="handlecancel"
    />
    <EditStatus
      v-if="statusvisible"
      :title="title"
      :statusbtnloading="statusbtnloading"
      :batData="batData"
      @close="handlecancel"
      @ok="saveStatus"
    />
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import {
  getList,
  getBudget,
  getStatus,
  getDetaile,
  getBatch,
  getStatuscd,
  getBidtable,
  getDeepbid,
  getDeepbidtable,
} from "@/api/plandimension";
import {
  getMediaList,
  getProjectList,
  getAgent,
  getMediaMasterList,
} from "@/api/dynamic/public";
import { getToken } from "@/utils/auth"; // getToken from cookie
import EditBid from "./components/editBid.vue";
import BidTable from "./components/bidTable.vue";
import EditDepthBid from "./components/editdepthbid.vue";
import DepthbidTable from "./components/depthbidTable.vue";
import EditStatus from "./components/editStatus.vue";
export default {
  name: "Plandimension",
  components: {
    Pagination,
    EditBid,
    BidTable,
    EditDepthBid,
    DepthbidTable,
    EditStatus,
  },
  data() {
    return {
      dialogtitle: "编辑",
      dialogFormVisible: false,
      dialogFormVisible_add: false,
      dialogFormVisible_addMore: false,
      disabledbtn: false,
      disabledbtn2: false,
      selectedId: "",
      selectedId2: "",
      total: 0,
      mediaList: [],
      statusList: [], //计划纬度 广告组外部
      projectList: [],
      accountList: [],
      pagination: {
        page: 1,
        limit: 10,
      },
      listQuery: {
        media_name: "",
        media_id: 5,
        campaign_id: "",
        proj_id: "", //项目
        src: "", //渠道号
        agency_opti: "", //优化代理
        status: "", //投放状态 0:全部 1.正常 2.停投 3.删除
        campaign_name: "", //广告组名称
        unit_name: "", //计划组名称
        unit_id: "",
        is_hosting: "", //投放类型
        status_cn: "",
      },
      token: getToken(),
      tableData: [],
      listLoading: true,
      list: [],
      multipleSelection: [],
      visibleStatus: false,
      agentList: [],
      bidvisible: false,
      bidbtnloading: false,
      bidData: {},
      bidtablevisible: false,
      bidtablebtnloading: false,
      bidtableData: {},
      depthbidbtnloading: false,
      depthbidvisible: false,
      depthbidData: {},
      deptablebtnloading: false,
      deptablevisible: false,
      deptableData: {},
      statusbtnloading: false,
      statusvisible: false,
      batData: {},
    };
  },
  created() {
    if (
      this.$route.query.media_id !== undefined &&
      this.$route.query.campaign_id !== undefined
    ) {
      this.listQuery.media_id = this.$route.query.media_id;
      this.listQuery.campaign_id = this.$route.query.campaign_id;
    }
    if (this.listQuery.media_id !== "") {
      this.getStatuscd(this.listQuery.media_id);
    }
    this.getAgent();
    this.getMediaList();
    this.getProjectList();
    this.getAccount();
    this.getList();
  },
  methods: {
    // 媒体发生改变时，请求 广告组状态外部 数据
    changeMedia(value) {
      this.getList();
      if (value !== "") {
        this.getStatuscd(value);
      }
    },
    // 筛选
    handleFilter() {
      const { pagination } = this;
      pagination.page = 1;
      this.getList();
    },
    // 多选项操作
    handleSelectionChange(val) {
      var ids = [];
      if (val.length > 0) {
        for (var key in val) {
          ids.push(val[key].unit_id);
        }
      }
      this.multipleSelection = ids;
    },
    // changeSelect(row) {
    //   if (row.media_id == 2 && row.is_hosting == 1) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // },
    // 批量修改出价
    changeBid() {
      console.log("批量修改出价");
    },
    // 批量修改状态
    changeStatus() {
      this.title = "批量修改状态";
      this.batData = this.projectList;
      this.statusbtnloading = false;
      this.statusvisible = true;
    },
    // 计划状态外部
    getStatuscd(value) {
      getStatuscd({ media_id: value }).then((data) => {
        if (data.error_code === 0) {
          this.statusList = data.data;
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
    // 请求账号
    getAccount() {
      getMediaMasterList().then((data) => {
        if (data.error_code === 0) {
          this.accountList = data.data;
        }
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
    // 修改出价
    changePrice(row) {
      this.title = "修改出价";
      this.bidData = row;
      this.bidbtnloading = false;
      this.bidvisible = true;
    },
    // 保存出价
    saveBid(value) {
      let params = {
        ids: value.unit_id,
        price: value.price,
      };
      if(value.price == undefined) {
        this.bidbtnloading = false;
        return this.$message.error('价格不能为空，请重新修改')
      }
      if(value.price == this.bidData.bid_amount) {
        this.bidbtnloading = false;
        return this.$message.error('价格未发生改变，请重新修改')
      }
      getBudget(params).then((res) => {
        if (res.error_code == 0) {
          this.bidvisible = false;
          this.bidbtnloading = false;
          this.$message.success("出价修改成功");
          this.getList();
        }
      }).catch(res => {
        this.bidvisible = false;
        this.$message.error(res.error_message)
      });
    },
    
    // 修改出价-操作历史
    showPrice(row) {
      this.title = "操作历史";
      getBidtable({unit_id:row.unit_id}).then((res) => {
        if (res.error_code == 0) {
          this.bidtableData = res;
          this.bidtablebtnloading = false;
          this.bidtablevisible = true;
        }
      });
    },
    // 修改深度转化出价
    changeDeepPrice(row) {
      this.title = "修改深度转化出价";
      this.depthbidbtnloading = false;
      this.depthbidvisible = true;
      this.depthbidData = row;
    },
    // 深度转化出价-操作历史
    showDeepPrice(row) {
      this.title = "操作历史";
      getDeepbidtable({unit_id:row.unit_id}).then((res) => {
        if (res.error_code == 0) {
          this.deptableData = res;
          this.deptablebtnloading = false;
          this.deptablevisible = true;
        }
      });
    },
    // 保存深度转化出价
    saveDeepbid(value) {
      let params = {
        unit_id	: value.unit_id,
        price: value.price,
      };
      if(value.price == undefined) {
        this.depthbidbtnloading = false;
        return this.$message.error('价格不能为空，请重新修改')
      }
      if(value.price == this.depthbidData.dep_bid_amount) {
        this.depthbidbtnloading = false;
        return this.$message.error('价格未发生改变，请重新修改')
      }
      getDeepbid(params).then((res) => {
        if (res.error_code == 0) {
          this.depthbidbtnloading = false;
          this.depthbidvisible = false;
          this.depthbidData = res;
          this.$message.success("深度转化出价修改成功");
          this.getList();
        }
      }).catch(res => {
        this.depthbidvisible = false;
        this.$message.error(res.error_message)
      });
    },
    // 关闭弹窗
    handlecancel(value) {
      this.bidvisible = value;
      this.bidbtnloading = value;

      this.bidtablevisible = value;
      this.bidtablebtnloading = value;

      this.depthbidbtnloading = value;
      this.depthbidvisible = value;

      this.deptablebtnloading = value;
      this.deptablevisible = value;

      this.statusbtnloading = value;
      this.statusvisible = value;
    },
    getStatus(value) {
      getStatus(value)
        .then((res) => {
          if (res.error_code == 0) {
            this.$message.success("批量修改成功");
            this.getList();
            this.disabledbtn = false;
            this.disabledbtn2 = false;
            this.statusvisible = false;
          }
        })
        .catch((res) => {
          this.$message.error(res.error_message);
          this.disabledbtn = false;
          this.disabledbtn2 = false;
          this.statusvisible = false;
        });
    },
    // 单个修改状态
    statusChange(value) {
      let media_name = this.mediaList.filter(
        (item) => item.id == this.listQuery.media_id
      )[0].name_cn;
      let params = {
        // media_id: value.media_id,
        // media_name: media_name,
        proj_id: value.proj_id,
        ids: value.unit_id,
      };
      if (value.status == 1) {
        this.disabledbtn = true;
        this.selectedId = value.unit_id;
        params.status = 2;
      } else if (value.status == 2) {
        params.status = 1;
        this.disabledbtn2 = true;
        this.selectedId2 = value.unit_id;
      }
      this.getStatus(params);
    },
    // 批量修改状态
    saveStatus(value) {
      // let media_name = this.mediaList.filter(
      //   (item) => item.id == this.listQuery.media_id
      // )[0].name_cn;
      // let params = {
      //   status: value.status,
      //   media_id: this.listQuery.media_id,
      //   media_name: media_name,
      //   ids: this.multipleSelection.toString(),
      // };
      this.getStatus(value);
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
