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
        v-model="listQuery.act_type"
        :default-first-option="true"
        class="filter-item select-item"
        filterable
        placeholder="请选择操作类型"
        @change="handleFilter"
      >
        <el-option label="全部" value="" />
        <el-option label="开启" :value="1" />
        <!-- <el-option label="出价" :value="2" />
        <el-option label="深度出价" :value="3" /> -->
        <el-option label="停投" :value="4" />
      </el-select>
      <span class="adname">操作人：</span>
      <el-select
        v-model="listQuery.act_user"
        clearable
        class="filter-item select-item"
        filterable
        placeholder="请选择操作人"
        @change="handleFilter"
      >
        <el-option
          v-for="item in actuserlist"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <span class="adname">操作时间：</span>
      <el-date-picker
        v-model="operationTime"
        type="daterange"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="handleFilter">
      </el-date-picker>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="add_income"
        type="warning"
        icon="el-icon-download"
        @click="changeDown"
        >导出</el-button
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
          min-width="100px"
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
          prop="unit_name"
          label="计划名称"
          align="center"
          min-width="180px"
        >
        </el-table-column>
        <el-table-column
          prop="unit_id"
          label="计划id"
          align="center"
          min-width="180px"
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
        </el-table-column>
        <el-table-column
          prop="dep_bid_amount"
          label="深度转化出价"
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
          prop="act_type"
          label="操作类型"
          align="center"
          min-width="100px"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.act_type == '1'" type="success">开启</el-tag>
            <el-tag v-if="scope.row.act_type == '2'" type="warning">出价</el-tag>
            <el-tag v-if="scope.row.act_type == '3'" type="warning">深度出价</el-tag>
            <el-tag v-if="scope.row.act_type == '4'" type="danger">停投</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="操作时间"
          align="center"
          min-width="120px"
        >
        </el-table-column>
        <el-table-column
          prop="act_user"
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
import { getDetaile ,getActUser,getDown,getStatuscd} from "@/api/plandimension";
import {
  getMediaList,
  getProjectList,
  getAgent,
  getMediaMasterList,
} from "@/api/dynamic/public";
import { getToken } from "@/utils/auth"; // getToken from cookie
import { getDate } from '@/utils'
import waves from '@/directive/waves' // Waves directive
export default {
  name: "Adsdetail",
  directives: { waves },
  components: {
    Pagination,
  },
  data() {
    return {
      dialogtitle: "编辑",
      dialogFormVisible: false,
      dialogFormVisible_add: false,
      dialogFormVisible_addMore: false,
      downloadLoading:false,
      total: 0,
      mediaList: [],
      statusList:[],
      projectList: [],
      accountList: [],
      agentList: [],
      actuserlist:[], //操作人
      pagination: {
        page: 1,
        limit: 20,
      },
      listQuery: {
        media_name: "",
        media_id: 5,
        proj_id: "", //项目
        src: "", //渠道号
        agency_opti: "", //优化代理
        status: "", //投放状态内部 0:全部 1.正常 2.停投 3.删除
        status_cn:'', //状态外部
        campaign_name: "", // 广告组名称
        campaign_id: "",
        unit_name: "", //计划名称
        unit_id: "",
        is_hosting:'',  //投放类型
        act_type:'',  //操作类型
        act_user:'',  //操作人
        start_time:'',
        end_time:'',
      },
      operationTime:[getDate(6),getDate(0)],
      token: getToken(),
      tableData: [],
      listLoading: true,
      list: [],
      multipleSelection: [],
    };
  },
  created() {
    this.listQuery.start_time = this.operationTime[0]
    this.listQuery.end_time = this.operationTime[1]
    if(this.listQuery.media_id !=='') {
      this.getStatuscd(this.listQuery.media_id)
    }
    this.getAgent();
    this.getMediaList();
    this.getProjectList();
    this.getAccount();
    this.getActUser();
    this.getDetaile();
  },
  methods: {
    // 媒体发生改变时，请求 广告组状态外部 数据
    changeMedia(value) {
      this.getDetaile();
      if(value !== '') {
        this.getStatuscd(value)
      }
      
    },
    // 筛选
    handleFilter() {
      const { pagination ,listQuery,operationTime} = this;
      pagination.page = 1;
     listQuery.start_time = operationTime[0]
    listQuery.end_time = operationTime[1]
      this.getDetaile();
    },
    // 计划状态外部
    getStatuscd(value) {
      getStatuscd({media_id:value}).then((data) => {
        if (data.error_code === 0) {
          this.statusList = data.data;
        }
      });
    },
    getActUser(){
      getActUser({media_id:this.listQuery.media_id}).then(res => {
        if(res.error_code == 0) {
          this.actuserlist = res.data;
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
    // 请求代理
    getAgent() {
      getAgent().then((data) => {
        if (data.error_code === 0) {
          this.agentList = data.data;
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
    // 导出
    changeDown() {
      if (!this.tableData.length) {
        return this.$message.error('暂无数据，请查询出数据再下载')
      } 
      if (this.tableData.length >= 10000) {
        return this.$message.error('导出数据不能超过10000条')
      } 

      let url = process.env.BASE_API;
      let token = getToken();
      let downurl = `${url}/api/ad_units/downLoadScreenList?token=${token}&media_name=${this.listQuery.media_name}&media_id=${this.listQuery.media_id}&proj_id=${this.listQuery.proj_id}&src=${this.listQuery.src}&agency_opti=${this.listQuery.agency_opti}&status=${this.listQuery.status}&campaign_name=${this.listQuery.campaign_name}&unit_name=${this.listQuery.unit_name}&is_hosting=${this.listQuery.is_hosting}&act_type=${this.listQuery.act_type}&act_user=${this.listQuery.act_user}&start_time=${this.listQuery.start_time}&end_time=${this.listQuery.end_time}`
      window.open(downurl)

      
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
