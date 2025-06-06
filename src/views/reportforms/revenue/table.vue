<template>
  <div class="income_div">
    <div class="income_header">
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
      <span class="adname">项目：</span>
      <el-select
        v-model="listQuery.proj_id"
        multiple
        clearable
        class="filter-item select-item"
        filterable
        placeholder="全部"
        @change="handleFilter"
      >
        <el-option
          v-for="item in projectList"
          :key="item.id"
          :label="item.app_name"
          :value="item.id"
        />
      </el-select>
      <el-button class="add_income" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button class="add_income" type="primary" icon="el-icon-search" @click="openCurrentUrl">在新页面中打开</el-button>
      <span style="margin-left: 600px;color: red;font-size: 15px;">数据截止：{{ formattedLatestUpdatedAt }}</span>
    </div>
    <el-card shadow="never">
      <el-table
        row-key="id"
        show-summary
        :summary-method="getSummaries"
        :tree-props="{children: 'children'}"
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
      
    </el-card>
  </div>
</template>
<script>
import { getList } from "@/api/revenueReport";
import {
  getProjectList
} from "@/api/dynamic/public";
import { getToken } from "@/utils/auth"; // getToken from cookie
import { getDate } from '@/utils'

export default {
  name: "revenueReport",
  data() {
    return {
      downloadLoading:false,
      projectList: [],
      currentId: 10000,
      latestUpdatedAt: '',
      listQuery: {
        proj_id: [], //项目
        start: '',
        end: '',
      },
      operationTime:[getDate(2),getDate(0)],
      token: getToken(),
      tableData: [],
      columns: [
        {
          prop: "day",
          label: "日期",
          align: "center",
        },
        {
          prop: "proj_code",
          label: "项目",
          align: "center",
        },
        {
          prop: "revenue",
          label: "收入",
          align: "center",
        },
        {
          prop: "gross_profit",
          label: "毛利",
          align: "center",
        },
        {
          prop: "cost_total",
          label: "账面消耗",
          align: "center",
        },
        {
          prop: "cost_cash",
          label: "现金消耗",
          align: "center",
        },
        {
          prop: "cost_finance",
          label: "财务成本",
          align: "center",
        },
        {
          prop: "cost_compensation",
          label: "赔付金额",
          align: "center",
        },
        
        {
          prop: "cost_gift",
          label: "广点通赠送金",
          align: "center",
        },
        {
          prop: "cost_rebate",
          label: "快手框返花费",
          align: "center",
        },
        {
          prop: "cost_reward",
          label: "头条赠款支出",
          align: "center",
        },
        {
          prop: "device_cnt",
          label: "新增设备数",
          align: "center",
        },
        {
          prop: "dau",
          label: "dau",
          align: "center",
        },
        {
          prop: "arpu_dau",
          label: "arpu(保活)",
          align: "center",
        },
        {
          prop: "cpa",
          label: "cpa(财务)",
          align: "center",
        },
      ],
      listLoading: false,
    };
  },
  created() {
    this.getList()
    this.getProjectList()
  },
  computed: {
    formattedLatestUpdatedAt() {
      if (!this.latestUpdatedAt) return '数据更新时间未知';
      const updatedDate = new Date(this.latestUpdatedAt);
      return `${updatedDate.getFullYear()}年${updatedDate.getMonth() + 1}月${updatedDate.getDate()}日${updatedDate.getHours()}时`;
    }
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
      listQuery.start = operationTime[0]
      listQuery.end = operationTime[1]
      this.getList()
    },
    // 请求项目
    getProjectList() {
      getProjectList().then((data) => {
        if (data.error_code === 0) {
          this.projectList = data.data
        }
      });
    },
    // 请求数据
    getList() {
      this.listLoading = true
      this.listQuery.start = this.operationTime[0]
      this.listQuery.end = this.operationTime[1]

      // 创建请求参数对象，排除空值
      const params = Object.keys(this.listQuery).reduce((acc, key) => {
        if (this.listQuery[key]) {
          // 如果是 proj_id，将数组转换为逗号分隔的字符串
          acc[key] = Array.isArray(this.listQuery[key]) ? this.listQuery[key].join(',') : this.listQuery[key];
        }
        return acc;
      }, {});

      console.log(params)
      getList(params)
        .then((data) => {
          if (data.error_code === 0) {
            // 找到最新的 updated_at
            let latestUpdatedAt = ''
              if (data.data.length > 0) {
                latestUpdatedAt = data.data.reduce((latest, current) => {
                  return new Date(latest.updated_at) > new Date(current.updated_at) ? latest : current
                }).updated_at
              }

            // 更新 Vue 组件中的 latestUpdatedAt
            this.latestUpdatedAt = latestUpdatedAt

            const hasProject = !!params.proj_id

            if (hasProject) {
              this.tableData = data.data
              this.listLoading = false
              console.log(this.tableData)
            } else {
              this.tableData = this.processData(data.data)
              this.listLoading = false
              console.log(this.tableData)
            }
            
          }
        })
        .catch(() => {
          this.$message({
            message: "加载失败",
            type: "error",
          })
        })
    },
    addWithPrecision(a, b) {
        return (parseFloat(a) + parseFloat(b)).toFixed(2);
    },
    processData(data) {
        // 第一步：按日期分类数据
        let classifiedData = {};

        data.forEach(item => {
            let date = item.day;

            if (!classifiedData[date]) {
                classifiedData[date] = {
                    id: this.currentId++,
                    day: date, 
                    proj_code: '-',
                    revenue: 0,
                    gross_profit: 0,
                    cost_total: 0,
                    cost_cash: 0,
                    cost_finance: 0,
                    cost_compensation: 0,
                    cost_gift: 0,
                    cost_rebate: 0,
                    cost_reward: 0,
                    device_cnt: 0,
                    dau: 0,
                    arpu_dau: 0,
                    cpa: 0,
                    children: []
                };
            }

            // 累加各项数据，并保留小数点后两位
            classifiedData[date].revenue = parseFloat(this.addWithPrecision(classifiedData[date].revenue, item.revenue));
            classifiedData[date].gross_profit = parseFloat(this.addWithPrecision(classifiedData[date].gross_profit, item.gross_profit));
            classifiedData[date].cost_total = parseFloat(this.addWithPrecision(classifiedData[date].cost_total, item.cost_total));
            classifiedData[date].cost_cash = parseFloat(this.addWithPrecision(classifiedData[date].cost_cash, item.cost_cash));
            classifiedData[date].cost_finance = parseFloat(this.addWithPrecision(classifiedData[date].cost_finance, item.cost_finance));
            classifiedData[date].cost_compensation = parseFloat(this.addWithPrecision(classifiedData[date].cost_compensation, item.cost_compensation));
            classifiedData[date].cost_gift = parseFloat(this.addWithPrecision(classifiedData[date].cost_gift, item.cost_gift));
            classifiedData[date].cost_rebate = parseFloat(this.addWithPrecision(classifiedData[date].cost_rebate, item.cost_rebate));
            classifiedData[date].cost_reward = parseFloat(this.addWithPrecision(classifiedData[date].cost_reward, item.cost_reward));
            classifiedData[date].device_cnt = parseFloat(this.addWithPrecision(classifiedData[date].device_cnt, item.device_cnt));
            classifiedData[date].dau = parseFloat(this.addWithPrecision(classifiedData[date].dau, item.dau));

            classifiedData[date].children.push(item);
        });

        // 计算 cpa 和 arpu
        Object.keys(classifiedData).forEach(key => {
            let dataForDay = classifiedData[key]; // 此处应该使用 key 而不是 date

            if (dataForDay.device_cnt > 0 && dataForDay.cost_finance > 0) {
                dataForDay.cpa = (dataForDay.cost_finance / dataForDay.device_cnt).toFixed(2);
            } else {
                dataForDay.cpa = 0; // 防止除以零
            }

            if (dataForDay.revenue > 0 && dataForDay.dau > 0) {
                dataForDay.arpu_dau = (dataForDay.revenue / dataForDay.dau).toFixed(2);
            } else {
                dataForDay.arpu_dau = 0; // 防止除以零
            }

            // 去除 children 数组中每个元素的 date 属性
            dataForDay.children.forEach(child => delete child.day);
        });

        // 将 classifiedData 对象转换为数组并返回
        let resultArray = Object.values(classifiedData);

        // 打印结果数组
        // console.log('aa', resultArray);

        return resultArray;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = []

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }

        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + value  // 直接累加值，不再字符串拼接
            } else {
              return prev
            }
          }, 0);

          // 保留小数点后两位
          sums[index] = sums[index].toFixed(2)
        } else {
          sums[index] = 'N/A'
        }
      });

      // 计算 cpa
      if (!isNaN(sums[6]) && !isNaN(sums[11]) && sums[11] !== 0) {
        sums[14] = (sums[6] / sums[11]).toFixed(2)
      } else {
        sums[14] = 'N/A'
      }

      // 计算 arpu
      if (!isNaN(sums[2]) && !isNaN(sums[12]) && sums[12] !== 0) {
        sums[13] = (sums[2] / sums[12]).toFixed(2)
      } else {
        sums[13] = 'N/A'
      }

      return sums
    },
  },
}
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
