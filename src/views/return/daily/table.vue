<template>
  <div class="app-container">
    <div class="filter-container" size="mini">
      <el-select
        v-model="listQuery.channel_new"
        :default-first-option = "true"
        size="mini"
        style="width: 300px;margin: 10px 20px 0px 0px;"
        class="filter-item"
        filterable
        placeholder="请选择渠道(输入进行搜索)"
        @change="handleFilter">
        <el-option key="" label="请选择渠道(输入进行搜索)" value="" />
        <el-option v-for="(item) in channels" :key="item" :label="item" :value="item"/>
      </el-select>
      <el-date-picker
        v-model="listQuery.date"
        size="mini"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        style="margin: 10px 20px 0px 0px;"
        @change="handleFilter"/>
      <el-button type="success" size="mini" @click="fixThousandUvCost">固定千次成本</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        size="mini"
        icon="el-icon-download"
        style="margin: 10px 20px 0px 0px;"
        @click="handleDownload">下载</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="danger"
        size="mini"
        icon="el-icon-upload2"
        style="margin: 10px 20px 0px 0px;"
        @click="handleSync">同步返量数据</el-button>

    </div>
    <div style="margin: 10px 20px 0px 0px;">
      <el-tag>渠道收益 ：{{ sum.channel_profit }}</el-tag>
      <el-tag>渠道偏差 ：{{ sum.channel_profit_difference }}</el-tag>
      <el-tag>原始UV ：{{ sum.uv }}</el-tag>
      <el-tag>千次UV收益 ：{{ sum.thousand_uv_profit }}</el-tag>
      <el-tag>返量UV ：{{ sum.return_uv }}</el-tag>
      <el-tag>千次UV成本 ：{{ sum.thousand_uv_cost }}</el-tag>
      <el-tag>成本 ：{{ sum.cost }}</el-tag>
      <el-tag>毛利 ：{{ sum.gross_profit }}</el-tag>
    </div>
    <el-divider/>
    <el-table
      v-loading="listLoading"
      :data="lists"
      :show-summary="true"
      show-header
      border
      fit
      height="800"
      highlight-current-row
      style="width: 100%;">
      <el-table-column label="日期" sortable prop="date" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道名称" prop="channel_name" sortable width="130" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channel_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道经理" sortable width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channel_user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道号" prop="channel_new" sortable width="70" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.channel_new }}</span>
        </template>
      </el-table-column>
      <el-table-column :sort-method="sortChannelProfit" label="渠道收益" sortable> width="100" align="center">
        <template slot-scope="scope">
          <span>{{ getChannelProfit(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="渠道收益偏差" prop="channel_profit_difference" sortable width="130" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="openDialog(scope.row)">
            {{ scope.row.channel_profit_difference }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="原始UV" prop="uv" sortable width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.uv }}</span>
        </template>
      </el-table-column>
      <el-table-column label="千次UV收益" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ Number(getThousandUvProfit(scope.row)).toFixed(2) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收入" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ getIncome(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="返量UV" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ getReturnUv(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="千次UV系数" prop="thousand_uv_ratio" width="80" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="openDialog(scope.row)">
            {{ scope.row.thousand_uv_ratio }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="千次UV成本" width="160" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="openDialog(scope.row)">
            {{ getThousandUvCost(scope.row) }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="成本" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ getCost(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="毛利" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ getGrossProfit(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="UV返量比" prop="return_ratio" width="160" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="openDialog(scope.row)">
            {{ scope.row.return_ratio }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="千次UV返量比" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ getThousandUvReturnRate(scope.row) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实际返量比" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ getRealReturnRate(scope.row) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogFormVisible" title="编辑" width="30%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="130px" style="width: 300px; margin-left:60px;">
        <el-form-item label="渠道号">
          <span>{{ temp.channel_new }}</span>
        </el-form-item>
        <el-form-item label="渠道偏差值">
          <el-input v-model="temp.channel_profit_difference"/>
        </el-form-item>
        <el-form-item label="千次UV系数">
          <el-input v-model="temp.thousand_uv_ratio"/>
        </el-form-item>
        <el-form-item label="千次UV成本">
          <el-input v-model="temp.thousand_uv_cost"/>
        </el-form-item>
        <el-form-item label="UV返量比">
          <el-input v-model="temp.return_ratio"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="fixDialogFormVisible" :title="dialog_title" width="30%">
      <el-form ref="fixForm" label-position="left" label-width="50px" style="width: 100px; margin-left:60px;">
        <el-form-item label="日期" prop="dialog_date">
          <el-date-picker
            v-model="dialog_date"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="fixDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialog_status==='fix'?fixData():syncData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { dailyList, editDaily, fixData, syncData } from '@/api/return'
import { getDate } from '@/utils'
import waves from '@/directive/waves' // Waves directive

export default {
  name: 'ReturnDailyList',
  directives: { waves },
  data() {
    return {
      lists: [],
      listQuery: {
        date: [],
        channel_new: ''
      },
      channels: [],
      listLoading: false,

      dialogFormVisible: false,
      temp: {
        id: undefined,
        channel_new: undefined,
        channel_profit_difference: 0.00,
        thousand_uv_cost: 0,
        return_ratio: 0,
        thousand_uv_ratio: 0
      },
      sum: {
        channel_profit: 0,
        channel_profit_difference: 0,
        uv: 0,
        thousand_uv_profit: 0,
        return_uv: 0,
        thousand_uv_cost: 0,
        cost: 0,
        gross_profit: 0

      },
      // 固定日期
      dialog_date: '',
      dialog_title: '',
      fixDialogFormVisible: false,
      dialog_status: 'fix',
      downloadLoading: false
    }
  },
  created() {
    var date = getDate()
    this.listQuery.date = [
      date,
      date
    ]
    this.getChannels()
    this.getList()
  },
  methods: {
    // 渠道收益
    getChannelProfit(row) {
      return Number(((Number(row.channel_profit) * 100) + (Number(row.channel_profit_difference) * 100)) / 100).toFixed(2)
    },
    // 千次UV收益
    getThousandUvProfit(row) {
      if (Number(row.uv) === false) {
        return 0
      } else {
        // 千次UV收益   渠道收益/原始UV * 1000
        return ((Number(this.getChannelProfit(row)) / Number(row.uv)) * 1000).toFixed(13)
      }
    },
    // 收入
    getIncome(row) {
      return this.getChannelProfit(row)
    },
    // 返量UV
    getReturnUv(row) {
      // 返量UV   原始UV *  UV返量比
      return ((Number(row.uv) * Number(row.return_ratio) * 10000000000000) / 10000000000000).toFixed(0)
    },
    // 千次UV成本
    getThousandUvCost(row) {
      if (Number(row.thousand_uv_cost)) {
        return row.thousand_uv_cost
      } else {
        // 千次UV成本   千次UV收益*千次UV系数
        return Number((this.getThousandUvProfit(row) * 10000000000000 * (Number(row.thousand_uv_ratio) * 100)) / 1000000000000000).toFixed(13)
      }
    },
    // 成本
    getCost(row) {
      // 成本  千次UV成本*返量UV/1000
      return Number((Number(this.getThousandUvCost(row) * 10000000000000) * Number(this.getReturnUv(row) * 10000000000000) / 1000) / 10000000000000 / 10000000000000).toFixed(2)
    },
    getGrossProfit(row) {
      // 毛利 收入-成本
      return ((Number(this.getIncome(row) * 100) - Number(this.getCost(row) * 100)) / 100).toFixed(2)
    },
    // 千次UV返量比
    getThousandUvReturnRate(row) {
      // 千次UV返量比   千次UV成本/千次UV收益
      var thousand_uv_profit = Number(this.getThousandUvProfit(row))
      if (thousand_uv_profit) {
        return (Number(10000000000000 * this.getThousandUvCost(row)) / Number(10000000000000 * thousand_uv_profit)).toFixed(2)
      } else {
        return 0
      }
    },
    // 实际返量比
    getRealReturnRate(row) {
      // 实际返量比    成本/收入
      var income = this.getIncome(row)
      if (Number(income)) {
        return (Number(this.getCost(row) * 100 / income) / 100).toFixed(2)
      }
      return 0
    },
    // 渠道收益排序
    sortChannelProfit(a, b) {
      return this.getChannelProfit(a) - this.getChannelProfit(b)
    },
    // 获取列表
    getList() {
      this.listLoading = true
      dailyList(this.listQuery).then(response => {
        this.lists = response.data
        this.getSumList(this.lists)
        setTimeout(() => {
          this.listLoading = false
        }, 50)
      })
    },
    getSumList(data) {
      var uv = 0
      var return_uv = 0
      var channel_profit = 0
      var cost = 0
      var channel_profit_difference = 0
      for (const v of data) {
        uv += v.uv
        channel_profit_difference += Number(v.channel_profit_difference) * 100
        return_uv += Number(this.getReturnUv(v))
        channel_profit += Number(this.getChannelProfit(v)) * 100
        cost += Number(this.getCost(v)) * 100
      }
      this.sum.channel_profit_difference = Number(channel_profit_difference / 100).toFixed(2)
      this.sum.uv = uv
      this.sum.return_uv = return_uv
      this.sum.channel_profit = channel_profit / 100
      this.sum.cost = cost / 100
      this.sum.gross_profit = (channel_profit - cost) / 100
      this.sum.thousand_uv_profit = this.sum.uv ? Number(1000 * this.sum.channel_profit / this.sum.uv).toFixed(2) : 0
      this.sum.thousand_uv_cost = this.sum.return_uv ? Number((this.sum.cost * 1000) / this.sum.return_uv).toFixed(2) : 0
    },
    // 查询
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 获取渠道
    getChannels() {
      this.$store.dispatch('getChannels').then(() => {
        this.channels = this.$store.getters.channels
      })
    },
    // 打开弹窗
    openDialog(row) {
      this.temp = Object.assign({}, row)
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 更新数据
    updateData() {
      const tempData = Object.assign({}, this.temp)
      editDaily(tempData).then(() => {
        for (const v of this.lists) {
          if (v.id === this.temp.id) {
            const index = this.lists.indexOf(v)
            this.lists.splice(index, 1, this.temp)
            break
          }
        }
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    fixThousandUvCost() {
      this.dialog_title = '固定千次UV成本'
      this.dialog_date = getDate()
      this.dialog_status = 'fix'
      this.fixDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['fixForm'].clearValidate()
      })
    },
    fixData() {
      // 固定千次UV成本
      fixData({ date: this.dialog_date }).then(() => {
        this.fixDialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '固定成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    // 下载
    handleDownload() {
      if (!this.lists.length) {
        this.$notify({
          title: '错误',
          message: '暂无数据，请查询出日报再下载',
          type: 'info',
          duration: 2000
        })
      } else {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const data = this.lists.map(v => {
            return [
              v['date'], v['channel_name'], v['channel_user'], v['channel_new'],
              this.getChannelProfit(v),
              v['channel_profit_difference'],
              v['uv'],
              Number(this.getThousandUvProfit(v)).toFixed(2),
              this.getIncome(v),
              this.getReturnUv(v),
              v['thousand_uv_ratio'],
              this.getThousandUvCost(v),
              this.getCost(v),
              this.getGrossProfit(v),
              v['return_ratio'],
              this.getThousandUvReturnRate(v),
              this.getRealReturnRate(v)
            ]
          })
          console.log(data)
          excel.export_json_to_excel({
            header: ['日期', '渠道名称', '渠道经理', '渠道号', '渠道收益', '渠道收益偏差', '原始UV', '千次UV收益', '收入', '返量UV', '千次UV系数', '千次UV成本', '成本', '毛利', 'UV返量比', '千次UV返量比', '实际返量比'],
            data,
            filename: '日报'
          })
        })
      }
      this.downloadLoading = false
    },
    // 同步返量数据
    handleSync() {
      this.dialog_title = '同步返量数据日期'
      this.dialog_status = 'sync'
      this.dialog_date = getDate()
      this.fixDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['fixForm'].clearValidate()
      })
    },
    syncData() {
      // 同步返量数据
      syncData({ date: this.dialog_date }).then(() => {
        this.fixDialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '同步数据成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>
<style>
  .priority {
    max-height: 200px;
    overflow-y: auto;
  }
  .table .el-checkbox{
    width:auto !important;
  }
</style>
