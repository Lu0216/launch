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
      <span class="adname">当前广告组状态（内部）：</span>
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
      <span class="adname">主账号：</span>
      <el-select
        v-model="listQuery.account"
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
      <span class="adname">操作类型：</span>
      <el-select
        v-model="listQuery.operation_status"
        :default-first-option="true"
        class="filter-item select-item"
        filterable
        placeholder="请选择操作类型"
        @change="handleFilter"
      >
        <el-option label="全部" value="" />
        <el-option label="开启" :value="1" />
        <el-option label="停投" :value="2" />
        <el-option label="修改预算" :value="3" />
      </el-select>
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
          prop="proj"
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
          prop="src"
          label="渠道号"
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
          prop="finish_at"
          label="最后修改时间"
          align="center"
          min-width="180px"
        >
        </el-table-column>
        <el-table-column
          prop="operation_status"
          label="操作类型"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.operation_status == '1'" type="success"
              >开启</el-tag
            >
            <el-tag v-if="scope.row.operation_status == '2'" type="danger"
              >停投</el-tag
            >
            <el-tag v-if="scope.row.operation_status == '3'" type="warning"
              >修改预算</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="operation_at"
          label="操作时间"
          align="center"
          min-width="120px"
        >
        </el-table-column>
        
        <el-table-column
          prop="operator"
          label="操作人"
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
        @pagination="getDetaile"
      />
    </el-card>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { getDetaile ,getOperator,getStatuscd} from "@/api/adsdimension";
import {
  getMediaList,
  getProjectList,
  getAgent,
  getMediaMasterList,
} from "@/api/dynamic/public";
import { getToken } from "@/utils/auth"; // getToken from cookie
export default {
  name: "Adsdetail",
  components: {
    Pagination,
  },
  data() {
    return {
      dialogtitle: "编辑",
      dialogFormVisible: false,
      dialogFormVisible_add: false,
      dialogFormVisible_addMore: false,
      total: 0,
      mediaList: [],
      statusList:[], //广告组状态外部
      projectList: [],
      accountList: [],
      operatorList:[],
      pagination: {
        page: 1,
        pageSize: 20,
      },
      listQuery: {
        media_id: "",
        proj_id: "",
        batch_id:'',
        src: "",
        campaign_name: "",
        campaign_id:'',
        is_hosting:'',
        act_type:'',
        act_user:'',
        status_cn:'',
        // campaign_status: "",
        // media_account_child: "",
        // account: "",
      },
      token: getToken(),
      tableData: [],
      listLoading: true,
      list: [],
      multipleSelection: [],
    };
  },
  created() {
    if(this.listQuery.media_id !=='') {
      this.getStatuscd(this.listQuery.media_id)
    }
    this.getMediaList();
    this.getProjectList();
    this.getAccount();
    this.getOperator()
    this.getDetaile();
  },
  methods: {
    // 筛选
    handleFilter() {
      const { pagination } = this;
      pagination.page = 1;
      this.getDetaile();
    },
    // 媒体发生改变时，请求 广告组状态外部 数据
    changeMedia(value) {
      this.getDetaile();
      if(value !== '') {
        this.getStatuscd(value)
      }
      
    },
    // 请求 广告组状态 外部
    getStatuscd(value) {
      getStatuscd({media_id:value}).then((data) => {
        if (data.error_code === 0) {
          this.statusList = data.data;
        }
      });
    },
    
    // 操作人
    getOperator() {
      getOperator().then(res => {
        if(res.error_code ==0) {
          this.operatorList = res.data
        }
      })
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
    getDetaile() {
      this.listLoading = true;
      const { pagination, listQuery } = this;
      const params = {
        ...pagination,
        ...listQuery,
      };
      getDetaile(params)
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
