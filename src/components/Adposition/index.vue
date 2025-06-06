<template>
  <div class="adred">
    <div class="adposition_header">
      <span>
        {{ title }}
      </span>
      <span class="adposition_number">
        {{ `${multipleSelection.length} / ${noselectedData.length}` }}
      </span>
    </div>
    <div class="adposition_search">
      <div style="width:180px;display:inline-block;">
        <div style="margin: 15px 8px 15px 7px;" class="el-transfer-panel__filter el-input el-input--small el-input--prefix">
          <input
            v-model="input3"
            type="text"
            autocomplete="off"
            placeholder="请输入广告位"
            class="el-input__inner"
          >
          <span class="el-input__prefix" style="left: 0px;">
            <i class="el-input__icon el-icon-search"/>
          </span>
        </div>
      </div>
      <div style="width:180px;display:inline-block;">
        <div style="margin: 15px 0px 15px 0px;" class="el-transfer-panel__filter el-input el-input--small el-input--prefix">
          <input
            v-model="input4"
            type="text"
            autocomplete="off"
            placeholder="请输入渠道号"
            class="el-input__inner"
          >
          <span class="el-input__prefix" style="left: 0px;">
            <i class="el-input__icon el-icon-search"/>
          </span>
        </div>
      </div>
      <el-button class="adposition_button" type="primary" icon="el-icon-search">搜索</el-button>
    </div>
    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="noselectedData"
      tooltip-effect="dark"
      class="adposition_table"
      style="width: 460px;"
      highlight-current-row
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="42"/>
      <el-table-column
        prop="id"
        label="id"
        show-overflow-tooltip/>
      <el-table-column
        prop="name"
        label="广告位"
        show-overflow-tooltip/>
      <el-table-column
        prop="source"
        label="渠道"
        show-overflow-tooltip/>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList_page" />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
export default {
  name: 'Adposition',
  components: { Pagination },
  props: {
    // boxTitle: {
    //   type: Array,
    //   default: () => ['待选区', '已选中']
    // },
    // pageSize: {
    //   type: Number,
    //   default: 160
    // },
    title: {
      type: String,
      default: () => ''
    },
    // 待选区的广告位
    noselectedData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      input3: '',
      input4: '',
      multipleSelection: [],
      loading: false,
      total: this.noselectedData.length,
      listQuery: {
        page: 1,
        limit: 5
      }
    }
  },
  mounted() {
    console.log(this.noselectedData, this.selectedData)
  },
  methods: {
    getList() {
      this.loading = false
      this.noselectedData = this.noselectedData
      console.log(this.multipleSelection)
    },
    // 点击分页
    getList_page(val) {
      this.loading = true
      this.listQuery.limit = val.limit
      this.listQuery.page = val.page
      this.getList()
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
      this.$emit('multipleSelection', val)
    }
  }
}
</script>
<style scoped>
.adred{
  color: red;
}
.adposition_header{
  width: 460px;
  height: 40px;
  line-height: 40px;
  background: #F5F7FA;
  margin: 0;
  padding-left: 15px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #000;
  position: relative;
  border: 1px solid #EBEEF5;
}
.adposition_search{
  border-left: 1px solid #EBEEF5;
  border-right: 1px solid #EBEEF5;
  width: 460px;
}
.adposition_table{
  border: 1px solid #EBEEF5;
}
.adposition_button{
  padding: 8px 20px;
}
.adposition_number{
  position: absolute;
  right: 15px;
  top: 0;
  color: #909399;
  font-size: 12px;
  font-weight: 400;
}
</style>

