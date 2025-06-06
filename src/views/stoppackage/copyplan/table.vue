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
      <span class="adname">复制计划id（二级）：</span>
      <el-input
        clearable
        v-model="listQuery.new_unit_id"
        class="filter-item select-item"
        placeholder="请填写复制计划id（二级）"
        @change="handleFilter"
      />
      <span class="adname">复制计划id-当前计划状态(外部)：</span>
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
      <span class="adname">被复制计划id（二级）：</span>
      <el-input
        clearable
        v-model="listQuery.from_unit_id"
        class="filter-item select-item"
        placeholder="请填写被复制计划id（二级）"
        @change="handleFilter"
      />
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
          prop="app_name"
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
          prop="account"
          label="主账号"
          align="center"
          min-width="180px"
        >
        </el-table-column>
        <el-table-column
          prop="media_account_child_id"
          label="子账号"
          align="center"
          min-width="180px"
        >
        </el-table-column>
        <el-table-column
          prop="campaign_id"
          label="复制广告组id（一级）"
          align="center"
          min-width="180px"
        >
        </el-table-column>
        <el-table-column
          prop="new_unit_id"
          label="复制计划id（二级）"
          align="center"
          min-width="180px"
        >
        </el-table-column>
        <el-table-column
          prop="status_cn"
          label="复制计划id-当前状态(外部)"
          align="center"
          min-width="180px"
        >
        </el-table-column>
        <el-table-column
          prop="from_unit_id"
          label="被复制计划id（二级）"
          align="center"
          min-width="180px"
        >
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="复制计划时间"
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
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { getList } from "@/api/copyplan"
import { getStatuscd} from "@/api/plandimension";
import {
  getMediaList,
  getProjectList
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
      downloadLoading:false,
      total: 0,
      mediaList: [],
      statusList:[],
      projectList: [],
      pagination: {
        page: 1,
        limit: 20,
      },
      listQuery: {
        media_id: 5,
        proj_id: "", //项目
        new_unit_id: "", 
        from_unit_id: "",
        status_cn:'', //状态外部
        start_time:'',
        end_time:'',
      },
      operationTime:[getDate(6),getDate(0)],
      token: getToken(),
      tableData: [],
      listLoading: true
    };
  },
  created() {
    this.listQuery.start_time = this.operationTime[0]
    this.listQuery.end_time = this.operationTime[1]
    if(this.listQuery.media_id !=='') {
      this.getStatuscd(this.listQuery.media_id)
    }
    this.getMediaList();
    this.getProjectList();
    this.getList();
  },
  methods: {
    // 媒体发生改变时，请求 广告组状态外部 数据
    changeMedia(value) {
      this.listQuery.status_cn = ''
      this.statusList = []
      this.handleFilter();
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
      this.getList();
    },
    // 计划状态外部
    getStatuscd(value) {
      getStatuscd({media_id:value}).then((data) => {
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
    // 导出
    changeDown() {
      let url = process.env.BASE_API;
      let token = getToken();
      let downurl = `${url}/api/copy_unit/export?token=${token}&media_id=${this.listQuery.media_id}&proj_id=${this.listQuery.proj_id}&from_unit_id=${this.listQuery.from_unit_id}&new_unit_id=${this.listQuery.new_unit_id}&status_cn=${this.listQuery.status_cn}&start_time=${this.listQuery.start_time}&end_time=${this.listQuery.end_time}`
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
