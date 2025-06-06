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
      <span class="adname">媒体：</span>
      <el-select
        v-model="listQuery.media_id"
        multiple
        clearable
        class="filter-item select-item"
        filterable
        placeholder="-"
        @change="handleFilter"
      >
        <el-option
          v-for="item in mediaList"
          :key="item.id"
          :label="item.name_cn"
          :value="item.id"
        />
      </el-select>
      <span class="adname">机型：</span>
      <el-select
        v-model="listQuery.brand"
        multiple
        clearable
        class="filter-item select-item"
        filterable
        placeholder="-"
        @change="handleFilter"
      >
        <el-option
          v-for="(item,index) in modelList"
          :key="index"
          :label="item"
          :value="item"
        />
      </el-select>
      <span class="adname">安卓版本：</span>
      <el-select
        v-model="listQuery.android_version"
        multiple
        clearable
        class="filter-item select-item"
        filterable
        placeholder="-"
        @change="handleFilter"
      >
        <el-option
          v-for="(item,i) in androidList"
          :key="i"
          :label="item"
          :value="item"
        />
      </el-select>
      <span class="adname">渠道</span>
      <el-select
        v-model="listQuery.qid"
        multiple
        clearable
        class="filter-item select-item"
        filterable
        placeholder="-"
        @change="handleFilter"
      >
        <el-option
          v-for="item in qidList"
          :key="item.id"
          :value="item.id"
        />
      </el-select>
      
      <el-button class="add_income" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button class="add_income" type="primary" icon="el-icon-search" @click="openCurrentUrl">在新页面中打开</el-button>
      <span style="margin-left: 15px;color: red;font-size: 15px;">数据截止：{{ formattedLatestUpdatedAt }}</span>
    </div>
    <el-card shadow="never">
      <el-table
        ref="multipleTable"
        :data="tableData"
        show-summary
        :summary-method="getSummaries"
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
import { getLists } from "@/api/launchReport";
import {
  getMediaList,
  getProjectList
} from "@/api/dynamic/public";
import { getToken } from "@/utils/auth"; // getToken from cookie
import { getDate } from '@/utils'

export default {
  name: "launchReport",
  data() {
    return {
      downloadLoading:false,
      total: 0,
      lastQid: null,
      latestUpdatedAt: '', // 用于存储最新的 updated_at
      isShow: true,
      mediaList: [],
      projectList: [],
      qidList: [],
      modelList:['OPPO','HUAWEI','HONOR','VIVO','XIAOMI','其他'],
      androidList:['9','10','11','12','13','14'],
      listQuery: {
        media_id: [], // 媒体
        proj_id: [], //项目
        qid: [],  // 渠道号
        brand: [],  // 机型
        android_version: [], // 安卓版本
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
          prop: "proj_name",
          label: "项目",
          align: "center",
        },
        {
          prop: "media_name",
          label: "媒体",
          align: "center",
        },
        {
          prop: "brand",
          label: "机型",
          align: "center",
        },
        {
          prop: "android_version",
          label: "安卓版本",
          align: "center",
        },
        {
          prop: "qid",
          label: "渠道",
          align: "center",
        },
        {
          prop: "device_cnt",
          label: "新增设备数",
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
          prop: "income",
          label: "收入",
          align: "center",
        },
        {
          prop: "cpa",
          label: "cpa",
          align: "center",
        },
        
        {
          prop: "roi",
          label: "roi",
          align: "center",
        },
        {
          prop: "avg_show_cnt",
          label: "人均广告展现",
          align: "center",
        },
        {
          prop: "avg_ecpm",
          label: "均值ecpm",
          align: "center",
        },
        {
          prop: "device_show_cnt",
          label: "展示设备数",
          align: "center",
        },
        {
          prop: "rate_device_show_cnt",
          label: "展示率",
          align: "center",
        },
      ],
      listLoading: false
    };
  },
  created() {
    // this.processData(this.data)
    this.getLists()
    this.getMediaList()
    this.getProjectList()
  },
  computed: {
    formattedLatestUpdatedAt() {
      if (!this.latestUpdatedAt) return '数据更新时间未知'
      const updatedDate = new Date(this.latestUpdatedAt)
      return `${updatedDate.getFullYear()}年${updatedDate.getMonth() + 1}月${updatedDate.getDate()}日${updatedDate.getHours()}时`
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
      this.getLists()
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
    getLists() {
      // this.listLoading = true;
      this.listQuery.start = this.operationTime[0]
      this.listQuery.end = this.operationTime[1]
      const { listQuery } = this

      // 创建请求参数对象，排除空值
      const params = Object.keys(this.listQuery).reduce((acc, key) => {
        if (this.listQuery[key]) {
          // 如果是 proj_id，将数组转换为逗号分隔的字符串
          acc[key] = Array.isArray(this.listQuery[key]) ? this.listQuery[key].join(',') : this.listQuery[key];
        }
        return acc;
      }, {});

      console.log(params)
      getLists(params)
        .then((data) => {
          if (data.error_code === 0) {
              console.log('data',data.data);
              
            // 找到最新的 updated_at
            let latestUpdatedAt = ''
              if (data.data.length > 0) {
                latestUpdatedAt = data.data.reduce((latest, current) => {
                  return new Date(latest.updated_at) > new Date(current.updated_at) ? latest : current
                }).updated_at
              }

            // 更新 Vue 组件中的 latestUpdatedAt
            this.latestUpdatedAt = latestUpdatedAt;

            // 检查是否存在项目、媒体和渠道的筛选项
            const hasProject = !!params.proj_id
            const hasMedia = !!params.media_id
            const hasChannel = !!params.qid
            // 如果没有项目、媒体和渠道的筛选项，则从 data.data 中提取所有项目的ID
            if (!hasProject && !hasMedia && !hasChannel) {
              this.isShow = true
              const allProjectIds = data.data.map(item => item.proj_id).filter((value, index, self) => self.indexOf(value) === index).join(',');
              params.proj_id = allProjectIds
              this.tableData = this.processData(data.data,params,this.isShow)
              } // 将所有项目 ID 添加到查询参数中
            else if (hasChannel) {
                
                this.tableData = data.data;

            }
            else{
            this.isShow = false
            // 更新qidList
            
              this.updateQidList(data.data, params.proj_id, params.media_id)
              
              
            
            console.log('11',data.data)
            this.tableData = this.processData(data.data,params,this.isShow)
            console.log(this.tableData);
            
            }

            
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
    updateQidList(data, proj_ids, media_ids) {
      // 将 proj_id 和 media_id 字符串转换为数组
      const projIdArray = proj_ids.split(',');
      const mediaIdArray = media_ids.split(',');

      console.log('data', data);
      
      // 根据 proj_id 和 media_id 筛选出符合条件的 qid  
      const filteredQids = data.filter(item => 
        projIdArray.includes(item.proj_id.toString()) && 
        mediaIdArray.includes(item.media_id.toString())
      );

      // 去重并提取 qid
      const uniqueQids = Array.from(new Set(filteredQids.map(item => item.qid)))
      
      // 更新 qidList
      this.qidList = uniqueQids.map(id => ({
        id: id,
        // name: filteredQids.find(item => item.qid === id).qid_name // 如果需要 name
      }))
    },
    addWithPrecision(a, b) {
        return (parseFloat(a) + parseFloat(b)).toFixed(2);
    },
    processData(data,params,isShow) {
      // 创建一个对象用于存储分类后的数据
    let classifiedData = {}

    // 将 params 中的 media_id 和 proj_id 转换成数组
    let mediaIds = params.media_id ? params.media_id.split(',') : [];
    let projIds = params.proj_id ? params.proj_id.split(',') : [];
    let brands = params.brand ? params.brand.split(',') : [];
    let androidVersions = params.android_version ? params.android_version.split(',') : [];

    // 遍历数据并按日期、项目和媒体分类
    data.forEach(item => {
        let day = item.day;
        let projName = projIds.includes(item.proj_id.toString()) ? item.proj_name || "-" : "-";
        let mediaName = mediaIds.includes(item.media_id.toString()) ? item.media_name || "-" : "-";
        let brand = brands.includes(item.brand.toString()) ? item.brand || "-" : "-";
        let androidVersion = androidVersions.includes(item.android_version.toString()) ? item.android_version || "-" : "-";
        let qid = params.qid ? item.qid || "-" : "-";
        
        let key = `${day}_${projName}_${mediaName}_${brand}_${androidVersion}_${qid}`;

        // 创建分类键
        // let key = `${day}_${projName}_${mediaName}_${qid}`;

        // 如果分类键还没有在 classifiedData 中出现，就创建一个新对象
        if (!classifiedData[key]) {
            classifiedData[key] = {
                day: day,
                proj_name: projName,
                media_name: mediaName,
                brand: brand,
                android_version: androidVersion,
                qid: qid,
                device_cnt: 0,
                cost_total: 0,
                cost_cash: 0,
                income: 0,
                cpa: 0,
                roi: 0,
                day_pr: 0,
                day_cnt: 0,
                avg_show_cnt: 0,
                avg_ecpm: 0,
                device_show_cnt: 0,
                rate_device_show_cnt: 0,
                items: []
            };
        }

         // 累加各项数据，并保留小数点后两位
        classifiedData[key].device_cnt = parseFloat(this.addWithPrecision(classifiedData[key].device_cnt, item.device_cnt));
        classifiedData[key].cost_total = parseFloat(this.addWithPrecision(classifiedData[key].cost_total, item.cost_total));
        classifiedData[key].cost_cash = parseFloat(this.addWithPrecision(classifiedData[key].cost_cash, item.cost_cash));
        classifiedData[key].income = parseFloat(this.addWithPrecision(classifiedData[key].income, item.income));
        classifiedData[key].day_pr = parseFloat(this.addWithPrecision(classifiedData[key].day_pr, item.day_pr));
        classifiedData[key].day_cnt = parseFloat(this.addWithPrecision(classifiedData[key].day_cnt, item.day_cnt));
        classifiedData[key].device_show_cnt = parseFloat(this.addWithPrecision(classifiedData[key].device_show_cnt, item.device_show_cnt));

        // 将当前数据项添加到相应分类的数组中
        classifiedData[key].items.push(item);
    });

    // 计算 cpa 和 roi
    Object.keys(classifiedData).forEach(key => {
        let dataForDay = classifiedData[key];

        if (dataForDay.device_cnt > 0) {
            dataForDay.cpa = (dataForDay.cost_cash / dataForDay.device_cnt).toFixed(2);
        } else {
            dataForDay.cpa = 0; // 防止除以零
        }

        if (dataForDay.cost_cash > 0) {
            dataForDay.roi = (dataForDay.income / dataForDay.cost_cash).toFixed(2);
        } else {
            dataForDay.roi = 0; // 防止除以零
        }

        // 计算人均广告展现
        if (dataForDay.device_cnt > 0) {
            dataForDay.avg_show_cnt = (dataForDay.day_cnt / dataForDay.device_cnt).toFixed(2);
        } else {
            dataForDay.avg_show_cnt = 0;
        }

        // 计算展示率
        if (dataForDay.device_show_cnt > 0 && dataForDay.device_cnt > 0) {
            dataForDay.rate_device_show_cnt = ((dataForDay.device_show_cnt / dataForDay.device_cnt) * 100).toFixed(2) + '%'
        } else {
            dataForDay.rate_device_show_cnt = '0%';
        }

        // 计算均值 eCPM
        if (dataForDay.day_pr > 0 && dataForDay.day_cnt > 0) {
            dataForDay.avg_ecpm = ((dataForDay.day_pr / 100) / dataForDay.day_cnt).toFixed(2);
        } else {
            dataForDay.avg_ecpm = 0;
        }
    });

    // 将 classifiedData 对象转换为数组并返回
    let resultArray = Object.values(classifiedData);

    // 过滤 device_cnt 小于等于 100 的数据项
    if ( isShow) {
      resultArray = resultArray.filter(item => item.device_cnt > 100);
    }
    
    

    // 打印结果数组
    console.log('aa', resultArray);

    return resultArray;
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []

      columns.forEach((column, index) => {
        
        if ([12, 13, 14, 15].includes(index)) {
          sums[index] = 'N/A'
          return;
        }

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
          }, 0)

          // 保留小数点后两位
          sums[index] = sums[index].toFixed(2)
        } else {
          sums[index] = 'N/A'
        }
      })

      // 计算 cpa
      if (!isNaN(sums[8]) && !isNaN(sums[6]) && sums[6] !== 0) {
        sums[10] = (sums[8] / sums[6]).toFixed(2)
      } else {
        sums[10] = 'N/A'
      }

      // 计算 roi
      if (!isNaN(sums[9]) && !isNaN(sums[8]) && sums[8] !== 0) {
        sums[11] = (sums[9] / sums[8]).toFixed(2)
      } else {
        sums[11] = 'N/A'
      }

      return sums
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
