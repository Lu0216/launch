<template>
  <div class="income_div">
    <div class="income_header">
      <span class="adname">日期区间：</span>
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
      <span class="adname">项目：</span>
      <el-select
      style="width: 8%;"
        v-model="listQuery.proj_id"
        :default-first-option="true"
        class="filter-item select-item"
        filterable
        placeholder="请选择项目"
        @change="handleFilter"
      >
        <el-option label="全部" value="" />
        <el-option
          v-for="item in projectList"
          :key="item.id"
          :label="item.app_name"
          :value="item.id"
        />
      </el-select>
      <span class="adname">子账号：</span>
      <el-input
      style="width: 12%;"
        @change="handleFilter"
        class="filter-item select-item"
        v-model="listQuery.media_account_child_id"
        clearable
        placeholder="请输入子账号"
      />
      <span class="adname">渠道号：</span>
      <el-input clearable v-model="listQuery.channel" 
          class="filter-item select-item" 
          placeholder="请填写渠道号" 
          @change="handleFilter"/>
      <span class="adname">机型：</span>
      <el-select
      style="width: 12%;"
        v-model="listQuery.brand"
        :default-first-option="true"
        class="filter-item select-item"
        filterable
        placeholder="请选择机型"
        @change="handleFilter"
      >
        <el-option label="全部" value="" />
        <el-option
          v-for="(item,index) in modelList"
          :key="index"
          :label="item"
          :value="item"
        />
      </el-select>
      <span class="adname">安卓版本：</span>
      <el-select
        style="width: 9%;"
        v-model="listQuery.os_version"
        :default-first-option="true"
        class="filter-item select-item"
        filterable
        placeholder="请选择安卓版本"
        @change="handleFilter"
      >
        <el-option label="全部" value="" />
        <el-option
          v-for="(item,i) in androidList"
          :key="i"
          :label="item"
          :value="item"
        />
      </el-select>
      <span class="adname">关键行为md5:</span>
      <el-input clearable v-model="listQuery.tag_md5" 
          class="filter-item select-item" 
          placeholder="请输入关键行为md5" 
          @change="handleFilter"/>
    </div>
    <el-card shadow="never">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        border="border"
        v-loading="listLoading"
      >
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
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { getBehaviorList } from "@/api/configStrategy";
import {
  getProjectList
} from "@/api/dynamic/public";
import { getToken } from "@/utils/auth"; // getToken from cookie
import { getDate } from '@/utils'

export default {
  name: "launchReport",
  components: { Pagination },
  data() {
    return {
      downloadLoading:false,
      total: 0,
      projectList: [],
      modelList:['OPPO','HUAWEI','HONOR','VIVO','XIAOMI','其他','空'],
      androidList:['9','10','11','12','13','14','空'],
      listQuery: {
        proj_id: "",
        channel: '',
        brand:'',
        os_version:'',
        tag_md5:'',
        media_account_child_id: "",
        start_time: '',
        end_time: '',
        page: 1,
        page_size: 20,
      },
      operationTime:[getDate(30),getDate(0)],
      token: getToken(),
      tableData: [],
      columns: [
        {
          prop: "created_at",
          label: "日期",
          align: "center",
        },
        {
          prop: "proj",
          label: "项目",
          align: "center",
        },
        {
          prop: "media_name",
          label: "媒体",
          align: "center",
        },
        {
          prop: "media_account_child",
          label: "子账号",
          align: "center",
        },
        {
          prop: 'channel', 
          label: '渠道号', 
          align: 'center',
          width:'180', 
          },
        {
          prop: "brand",
          label: "机型",
          align: "center",
        },
        {
          prop: "os_version",
          label: "安卓版本",
          align: "center",
        },
        {
          prop: "show_cnt",
          label: "show_cnt",
          align: "center",
        },
        {
          prop: "arpu",
          label: "arpu",
          align: "center",
        },
        {
          prop: "tag_md5",
          label: "关键行为md5",
          align: "center",
        },
        {
          prop: "gap_ratio",
          label: "gap",
          align: "center",
        },
        {
          prop: "operation_type",
          label: "操作项",
          align: "center",
        },
        {
          prop: "operator_at",
          label: "操作时间",
          align: "center",
        },
        {
          prop: "operator",
          label: "操作人",
          align: "center",
        },
      ],
      listLoading: false
    };
  },
  created() {
    this.getList()
    this.getProjectList()
  },
  methods: {
     openCurrentUrl() {
      // 获取当前 URL
      const currentUrl = window.location.href;
      // 在新标签页中打开当前 URL
      window.open(currentUrl, '_blank');
    },
    // 筛选
    handleFilter() {
      const { listQuery,operationTime } = this
      listQuery.start_time = operationTime[0]
      listQuery.end_time = operationTime[1]
      listQuery.page = 1
      this.getList()
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
      // this.listLoading = true;
      this.listQuery.start_time = this.operationTime[0]
      this.listQuery.end_time = this.operationTime[1]
      // // 将 os_version 数组转换为字符串
      // if (Array.isArray(this.listQuery.os_version)) {
      //   this.listQuery.os_version = this.listQuery.os_version.join(',');
      // }
      let datasrc = this.listQuery
      console.log('datasrc',datasrc)
      
      getBehaviorList(datasrc)
        .then((data) => {
          if (data.error_code === 0) {
            this.total = data.meta.total
            this.tableData = data.data
          }
        })
        .catch(() => {
          this.$message({
            message: "加载失败",
            type: "error",
          });
          this.listLoading = false
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
  width: 180px;
  margin: 10px 20px 0px 0px;
}
.input-item {
  width: 150px;
}
</style>
