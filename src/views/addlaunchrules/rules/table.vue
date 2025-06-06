<template>
  <div class="income_div">
    <div class="income_header">
      <div class="mr20">
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
      </div>
      <div class="mr20">
        <span class="adname">渠道号：</span>
        <el-input clearable v-model="listQuery.channel" 
        class="filter-item select-item" placeholder="请填写渠道号" @change="handleFilter"/>
      </div>
      <div class="mr20">
        <span class="adname">媒体：</span>
        <el-select
          v-model="listQuery.media_id"
          clearable
          class="filter-item select-item"
          filterable
          placeholder="请选择媒体"
          @change="handleFilter">
          <el-option 
            v-for="(item) in mediaList" 
            :key="item.id" 
            :label="item.name_cn" 
            :value="item.id"/>
        </el-select>
      </div>
      <div class="mr20">
        <span  class="adname">主账号：</span>
        <el-select
          v-model="listQuery.media_account_id"
          clearable
          class="filter-item select-item"
          filterable
          placeholder="请选择账号"
          @change="handleFilter">
          <el-option v-for="(item) in accountList" :key="item.id" :label="item.account" :value="item.id"/>
        </el-select>
      </div>
      <div class="mr20">
        <span class="adname">子账号：</span>
        <el-input clearable v-model="listQuery.media_account_child" 
        class="filter-item select-item" placeholder="请填写子账号" @change="handleFilter"/>
      </div>
      <div class="mr20">
        <span class="adname">关键行为名称：</span>
        <el-input clearable v-model="listQuery.custom_name" 
        class="filter-item select-item" placeholder="请填写关键行为名称" @change="handleFilter"/>
      </div>
      <el-button
        class="add_income"
        type="primary"
        icon="el-icon-edit"
        @click="handleAdd"
        >新增</el-button
      >
      <el-button
        class="add_income"
        type="primary"
        icon="el-icon-edit"
         @click="handleEdit"
        :disabled="selectList.length == 0"
        >批量编辑</el-button
      >

    </div>
    <el-card shadow="never">
      <TableColumns
        :dataSource="tableData"
        :total="total"
        :listLoading="listLoading"
        :columns="columns"
        :currentPage="listQuery.page"
        :pageSize="listQuery.pagesize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
        :showSelectionColumn="true"
        @selectTableItem="selectTableItem"
        @selectAllTableItem="selectAllTableItem"

      >
      </TableColumns>
    </el-card>
    <Add
      v-if="addvisible"
      :dialogFormVisible="addvisible"
      :title="title"
      :projectList="projectList"
      :mediaList="mediaList"
      :customList="customList"
      :addloading="addloading"
      :initData="initData"
      @close="handlecancel"
      @saveAdd="saveAdd"
    />
    <BatchEdit
      v-if="batchEditvisible"
      :dialogFormVisible="batchEditvisible"
      :title="title"
      :customList="customList"
      :addloading="addloading"
      :initData="initData"
      @close="handlecancel"
      @batchEdit="batchEdit" 
    />
    
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
// import { getList } from "@/api/sievebag";
import {
  getProjectList,
  getMediaList,
  getMediaMasterList
} from "@/api/dynamic/public";
import { getRulesType,getEdit,getAdd ,getList,getBatchEdit} from '@/api/addlaunchrole'
import { getToken } from "@/utils/auth"; // getToken from cookie
import Add from "./components/add.vue";
import BatchEdit from "./components/batchEdit.vue"
import TableColumns from '@/components/Eltable/index'
export default {
  name: "Adsdetail",
  components: {
    Pagination,
    Add,
    TableColumns,
    BatchEdit,
  },
  data() {
    return {
      dialogtitle: "编辑",
      dialogFormVisible: false,
      dialogFormVisible_add: false,
      dialogFormVisible_addMore: false,
      addvisible:false,
      addloading:false,
      editvisible:false,
      batchEditvisible: false,
      total: 0,
      // 选择的数据
      selectList:[],
      projectList: [],
      mediaList: [],
      channelList: [], // 渠道号列表
      customList:[], //关键行为类型
      accountList:[],
      pagination: {
        page: 1,
        pagesize: 10,
      },
      listQuery: {
        proj_id: '',
        media_id:'',
        media_account:'',
        media_account_child:'',
        custom_name:'',
        channel: '',
      },
      token: getToken(),
      tableData: [],
      listLoading: true,
      initData:{},
      columns:[
        {
          prop: 'proj', 
          label: '项目', 
          align: 'center' ,
          width:'120', 
        },
        {
          prop: 'media_name', 
          label: '媒体', 
          align: 'center' ,
          width:'150', 
        },
        {
          prop: 'custom_name', 
          label: '关键行为名称', 
          align: 'center' ,
          width:'180', 
        },
        {
          prop: 'media_account', 
          label: '主账户', 
          align: 'center',
          width:'180',
        },
        {
          prop: 'media_account_child', 
          label: '子账户', 
          align: 'center',
          width:'180', 
        },
        {
          prop: 'channel', 
          label: '渠道号', 
          align: 'center',
          width:'180', 
        },
        {
          prop: 'custom_type_name', 
          label: '关键行为类型', 
          align: 'center' ,
          width:'120',
        },
        {
          prop: 'show_cnt', 
          label: 'show_cnt', 
          align: 'center',
          width:'120',
          render:(h,params) => {
             return (<span>{params.row.show_cnt == null ? 'null':params.row.show_cnt_symbol+params.row.show_cnt}</span>)
          } 
        },
        {
          prop: 'avg_ecpm', 
          label: '平均ecpm', 
          align: 'center',
          width:'120',
          render:(h,params) => {
             return (<span>{params.row.avg_ecpm == null ?'null':params.row.avg_ecpm_symbol+params.row.avg_ecpm}</span>)
          },
        },
        {
          prop: 'arpu', 
          label: 'arpu', 
          align: 'center',
          width:'120',
          render:(h,params) => {
             return (<span>{params.row.arpu == null ?'null':params.row.arpu_symbol+params.row.arpu}</span>)
          },
        },
        {
          prop: 'max_ecpm', 
          label: '最大ecpm', 
          align: 'center',
          width:'120',

          render:(h,params) => {
             return (<span>{params.row.max_ecpm == null ?'null':params.row.max_ecpm_symbol+params.row.max_ecpm}</span>)
          },
        },
        {
          prop: 'top_number', 
          label: 'N', 
          align: 'center',
          width:'120',
        },
        {
          prop: 'ecpm', 
          label: 'M', 
          align: 'center',
          width:'120',
          render:(h,params) => {
             return (<span>{params.row.ecpm == null ?'null':params.row.ecpm_symbol+params.row.ecpm}</span>)
          },
        },
         {
          prop: 'cash', 
          label: '累计提现金额', 
          align: 'center',
          width:'120',
          render:(h,params) => {
             return (<span>{params.row.cash == null ?'null':params.row.cash_symbol+params.row.cash}</span>)
          },
        },
        {
          prop: 'time_limit', 
          label: '时间限制', 
          align: 'center' ,
          width:'100',
        },
        {
          prop: 'gap_ratio', 
          label: 'gap', 
          align: 'center' ,
          width:'100', 
        },
        {
          prop: 'operator', 
          label: '操作人', 
          align: 'center' ,
          width:'120',
        },
        {
          prop: 'operator_at', 
          label: '操作时间', 
          align: 'center' ,
          width:'180',
        },
        {
          prop: 'operate', 
          label: '操作', 
          align: 'center' ,
          width:'150',
          render: (h, params) => {
            return (
                <div>
                    <el-button type="primary"  onClick={() => this.editDialog(params.row)}>编辑</el-button>
                </div>
            )
          }
        },
      ]
    };
  },
  created() {
    this.getProjectList();
    this.getMediaList()
    this.getRulesType();
    this.getMediaMasterList();
    this.getList();
  },
  methods: {
    // 选中列表
    selectTableItem(selection,row) {
      // console.log(selection);
      // console.log(row);
      this.selectList = selection
      console.log(this.selectList);
    },
    // 全选
    selectAllTableItem(selection) {
      // console.log(selection);
      this.selectList = selection
      console.log(this.selectList);
    },
    // 筛选
    handleFilter() {
      const { pagination } = this;
      pagination.page = 1;
      this.getList();
    },
    // 请求项目
    getProjectList() {
      getProjectList().then((data) => {
        if (data.error_code === 0) {
          this.projectList = data.data;
        }
      });
    },
    // 媒体
    getMediaList(){
      getMediaList().then((data) => {
        if (data.error_code === 0) {
          this.mediaList = data.data
        }
      }).catch(() => {
        this.$message({
          message: '加载媒体失败',
          type: 'error'
        })
      })
    },
    // 下拉框--关键行为类型
    getRulesType() {
      getRulesType().then(res => {
        if(res.error_code == 0) {
          this.customList = res.data
        }
      })
    },
    // 主账号
    getMediaMasterList() {
      getMediaMasterList().then((data) => {
        if (data.error_code === 0) {
          this.accountList = data.data
        }
      })
    },
    // 请求列表页数据
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
          this.listLoading = false;
          this.$message({
            message: "加载失败",
            type: "error",
          });
        });
    },

    // 新增
    handleAdd() {
      this.title="新增";
      this.addvisible = true;

    },
    // 批量编辑
    handleEdit() {
      this.title = "批量编辑"
      this.batchEditvisible = true;
    },
    // 关闭弹框
    handlecancel(value) {
      this.addvisible = value;
      this.editvisible = value;
      this.batchEditvisible = value;
    },
    // 保存
    saveAdd(value) {
      this.addloading = true;
      if(value.id =='') {
        this.getAdd(value)
      }else {
        this.getEdit(value)
      }
    },
    // 批量编辑保存
    batchEdit(datasrc) {
      const ids = this.selectList.map(item => item.id).join(',')
      console.log(ids);
      const params = {
        ...datasrc,
        ids
      }
      // console.log(params);
      getBatchEdit(params).then((data) => {
        if (data.error_code == 0) {
          this.batchEditvisible = false
          this.$message.success("批量编辑成功")
          this.getList()
        }
      }).catch(data => {
        this.$message.error(data.error_message)
        this.batchEditvisible = false
      })
    },
    // 编辑按钮点击
    editDialog(item){
      this.addvisible = true
      this.initData = item
      this.title = '编辑'
    },
    getAdd(value) {
      getAdd(value)
        .then((res) => {
          if (res.error_code == 0) {
            this.addvisible = false;
            this.$message.success("新增成功");
            this.getList();
          }
        })
        .catch((res) => {
          this.addvisible = false;
        });
        this.addloading = false;
      
    },
    getEdit(value) {
      getEdit(value).then(res => {
        if(res.error_code == 0) {
          this.addvisible = false;
          this.$message.success('编辑成功');
          this.getList()
        }
      }).catch((res) => {
          this.addvisible = false;
        });
      this.addloading = false;
    },
    // 分页- pagesize
    handleSizeChange (val) {
      const { listQuery } = this
      listQuery.pagesize = val
      listQuery.page = 1
      this.getList()
    },
    // 分页- page
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
  },
};
</script>
<style scoped>
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
.mr20 {
  display: inline-block;
  margin:10px;
}
</style>
