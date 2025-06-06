<template>
  <div class="qacontainer">
    <!-- 第一行筛选项 -->
    <div class="filter-row">
      <span class="filter-label">项目代号：</span>
      <el-select
        v-model="filterParams.proj_id"
        clearable
        filterable
        placeholder="请选择项目"
        @change="handleProjChange"
      >
        <el-option
          v-for="item in projectOptions"
          :key="item.id"
          :label="item.app_name"
          :value="item.id"
        />
      </el-select>
    </div>

    <!-- 第二行筛选项 - 手机品牌 -->
    <div class="filter-row">
      <el-tabs v-model="filterParams.brand" @tab-click="handleBrandChange">
        <el-tab-pane label="小米" name="xiaomi"></el-tab-pane>
        <el-tab-pane label="荣耀" name="honor"></el-tab-pane>
        <el-tab-pane label="OPPO" name="oppo"></el-tab-pane>
        <el-tab-pane label="vivo" name="vivo"></el-tab-pane>
        <el-tab-pane label="华为" name="huawei"></el-tab-pane>
      </el-tabs>
    </div>

    <!-- 第三行筛选项 -->
    <div class="filter-row">
      <span>投放媒体</span>
      <el-select
        v-model="filterParams.media_id"
        clearable
        placeholder="投放媒体"
        class="filter-item"
        @change="handleMediaChange"
      >
        <el-option
          v-for="item in mediaOptions"
          :key="item.id"
          :label="item.media_name"
          :value="item.id"
        />
      </el-select>
      <span>渠道号</span>
      <el-select
        v-model="filterParams.qid"
        multiple
        clearable
        filterable
        placeholder="渠道号"
        class="filter-item"
      >
        <el-option
          v-for="item in channelOptions"
          :key="item.qid"
          :label="item.qid"
          :value="item.qid"
        />
      </el-select>

      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>

    <!-- 表格区域 -->
    <el-card shadow="never">
      <el-table
        style="width: 100%"
        stripe
        :border="true"
        :data="tableData"
        v-loading="listLoading"
      >
        <el-table-column
          prop="media_name"
          label="投放媒体"
          align="center"
          width="120"
        ></el-table-column>

        <el-table-column
          label="渠道号"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.qid }}</span>
            <span>{{ scope.row.qid_name }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="投放页面路径"
          align="center"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.page_name }}</span>
            <span style="margin-left: 4px">({{ scope.row.page_route }})</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="hap_link"
          label="hap链接"
          align="center"
        >
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.hap_link" placement="top">
              <div slot="content" style="max-width:300px;">{{ scope.row.hap_link }}</div>
              <div class="text-ellipsis">{{ scope.row.hap_link }}</div>
            </el-tooltip>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="h5_link"
          label="二跳h5链接"
          align="center"
        >
          <template slot-scope="scope">
            <el-tooltip v-if="scope.row.h5_link" placement="top">
              <div slot="content" style="max-width:300px;">{{ scope.row.h5_link }}</div>
              <div class="text-ellipsis">{{ scope.row.h5_link }}</div>
            </el-tooltip>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- <TableColumns
        :dataSource="tableData"
        :total="total"
        :columns="columns"
        :currentPage="pagination.page"
        :pageSize="pagination.pageSize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      /> -->
    </el-card>
  </div>
</template>

<script>
import TableColumns from '@/components/Eltable/index'
import { getProjects, getMedias, getChannels, getList } from '@/api/dynamic/qalaunch'

export default {
  components: { TableColumns },
  data() {
    return {
      filterParams: {
        proj_id: '',
        brand: '',
        media_id: '',
        qid: []
      },
      projectOptions: [],
      mediaOptions: [],
      channelOptions: [],
      tableData: [],
      // columns: [
      //   { 
      //     prop: 'media_name', 
      //     label: '投放媒体', 
      //     align: 'center',
      //     width: 120,
      //   },
      //   { 
      //     prop: 'qid', 
      //     label: '渠道号',
      //     width: 180,
      //     align: 'center',
      //     render: (h, params) => {
      //       return h('div', [
      //         h('span', {}, params.row.qid),
      //         h('span', {}, params.row.qid_name)
      //       ])
      //     }
      //   },
      //   { 
      //     prop: 'page_name', 
      //     label: '投放页面路径',
      //     width: 180,
      //     align: 'center',
      //     render: (h, params) => {
      //       return h('div', [
      //         h('span', {}, params.row.page_name),
      //         h('span', { style: 'margin-left: 4px' }, `(${params.row.page_route})`)
      //       ])
      //     }
      //   },
      //   { 
      //     prop: 'hap_link', 
      //     label: 'hap链接', 
      //     align: 'center' 
      //   },
      //   { 
      //     prop: 'h5_link', 
      //     label: '二跳h5链接', 
      //     align: 'center' 
      //   }
      // ],
      pagination: {
        page: 1,
        pageSize: 10
      },
      total: 0
    }
  },
  // watch: {
  //   // 监听筛选项变化自动获取渠道号
  //   filterParams: {
  //     deep: true,
  //     handler() {
  //       this.fetchMedias()
  //       this.fetchChannels()
  //     }
  //   }
  // },
  created() {
    this.fetchProjects()
    // this.fetchData()
  },
  methods: {
    handleMediaChange() {
      this.fetchChannels()
    },
    handleBrandChange() {
      this.tableData = []
      this.filterParams.media_id = ''
      this.filterParams.qid = ''
      this.mediaOptions = []
      this.channelOptions = []
      this.fetchMedias()
    },
    handleProjChange() {
      this.tableData = []
      this.filterParams.brand = ''
      this.filterParams.media_id = ''
      this.filterParams.qid = ''
      this.mediaOptions = []
      this.channelOptions = []
       
    },
    // 获取项目数据
    fetchProjects() {
      const params = {
        type: 'qa'
      }
      getProjects(params).then((data) => {
        if(data.error_code === 0) {
          this.projectOptions = data.data
        }
      })
    },
    // 获取媒体数据
    async fetchMedias() {
      const params = {
        proj_id: this.filterParams.proj_id,
        brand: this.filterParams.brand,
      }
      const res = await getMedias(params)
      this.mediaOptions = res.data
    },
    // 获取渠道号数据
    async fetchChannels() {
      const params = {
        proj_id: this.filterParams.proj_id,
        brand: this.filterParams.brand,
        media_id: this.filterParams.media_id
      }
      const res = await getChannels(params)
      this.channelOptions = res.data
    },

    // // 分页处理
    // handleSizeChange(val) {
    //   this.pagination.pageSize = val
    //   this.fetchData()
    // },
    // handleCurrentChange(val) {
    //   this.pagination.page = val
    //   this.fetchData()
    // },

    // 列表数据查询
    async fetchData() {
      const params = {
        ...this.pagination,
        ...this.filterParams,
        qid: this.filterParams.qid.join(',')
      }
      try {
        getList(params).then((data) => {
        if(data.error_code === 0) {
          this.tableData = data.data
        } else{
          this.tableData = []
        }
      })
      } catch (e) {
        this.tableData = []
        // this.total = 0
        // console.error('请求失败:', e)
      }
    },

    // 按钮事件
    handleSearch() {
      if( !this.filterParams.proj_id || !this.filterParams.brand || !this.filterParams.media_id || !this.filterParams.qid ) {
        this.$message({
          message: '请选择完整筛选条件',
          type: 'error'
        })
      }
      // this.pagination.page = 1
      this.fetchData()
    },
    handleReset() {
      this.filterParams = {
        proj_id: '',
        brand: '',
        media_id: '',
        qid: []
      }
      // this.pagination.page = 1
      this.tableData = []
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
}
.filter-row {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}
.filter-item {
  width: 200px;
}
::v-deep .el-tabs__header {
  margin: 0;
}
::v-deep .el-tabs__active-bar {
    height: 4px;
}
</style>