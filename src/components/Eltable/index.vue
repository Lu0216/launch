<template>
  <!-- 列表 -->
  <div class="eltable">
    <el-table
      stripe
      :border="border"
      :data="dataSource"
      v-loading="listLoading"
      highlight-current-row
      style="width: 100%"
      @select="selectTableItem" 
      @select-all="selectAllTableItem"
    >
    <!-- 添加全选列 -->
      <el-table-column
        v-if="showSelectionColumn"
        type="selection"
        width="55"
      ></el-table-column>
      <!--数据源-->
      <el-table-column
        v-for="(column) in columns"
        header-align="center"
        :fixed="column.fixed"
        :sortable="column.sortable"
        :key="column.key"
        :prop="column.prop"
        :label="column.label"
        :align="column.align"
        :width="column.width"
      >
        <template slot-scope="scope">
          <operateSlot v-if="column.render" :render="column.render" :row="scope.row" :index="scope.$index" :column="column"></operateSlot>
          <span v-else>
            {{ scope.row[column.prop] }}
          </span>
        </template>
      </el-table-column >
    </el-table>
    <el-pagination
      class="page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="pageArr"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>

</template>
<script>
import Vue from 'vue'
// 自定义内容的组件
Vue.component('operateSlot', {
  functional: true,
  props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
      type: Object,
      default: null
    }
  },
  render: (h, data) => {
    const params = {
      row: data.props.row,
      index: data.props.index
    }

    if (data.props.column) params.column = data.props.column
    return data.props.render(h, params)
  }
})

export default {
  props: {
    dataSource: {// 表格数据源 默认为空数组
      type: Array,
      default: () => []
    },
     showSelectionColumn: { // 是否显示全选列，默认为 false
      type: Boolean,
      default: false
    },
    columns: {// 表格的字段展示 默认为空数组
      type: Array,
      default: () => []
    },
    listLoading: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    },
    total: {
      type: Number,
      default: 100
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageArr: {
      type: Array,
      default: () => [10, 20, 50, 100]
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  components: {
    //
  },
  watch: {
    //
  },
  mounted () {
    //
  },
  methods: {
    handleSizeChange (pageSize) {
      console.log('pageSize,pageSize', pageSize)
      this.$emit('handleSizeChange', pageSize)
    },
    handleCurrentChange (current) {
      console.log('current,current', current)
      this.$emit('handleCurrentChange', current)
    },
    selectTableItem(selection) {
      console.log('selection', selection)
      this.$emit('selectTableItem', selection)
    },
    selectAllTableItem(selection) {
      console.log('selection', selection)
      this.$emit('selectAllTableItem', selection)
    }
  }
}
</script>
<style scoped>
.eltable{
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  background: #fff;
  padding: 10px;
  
}
.eltable .page{
    margin-top: 20px;
  }
</style>
