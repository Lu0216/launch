<template>
  <div class="income_div">
    <div class="income_header">
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
        <el-option
          v-for="item in projectsList"
          :key="item.id"
          :label="item.app_name"
          :value="item.id"
        />
      </el-select>
      <span class="adname">媒体：</span>
      <el-select
      style="width: 6%;"
        v-model="listQuery.media_id"
        :default-first-option="true"
        class="filter-item select-item"
        filterable
        placeholder="请选择媒体"
        @change="handleFilter"
      >
        <el-option
          v-for="item in mediaList"
          :key="item.id"
          :label="item.name_cn"
          :value="item.id"
        />
      </el-select>
      <span class="adname">主账号：</span>
      <el-select
      style="width: 8%;"
        v-model="listQuery.media_account_id"
        :default-first-option="true"
        class="filter-item select-item"
        filterable
        placeholder="请选择账号"
        @change="handleFilter"
      >
        <el-option
          v-for="item in masterList"
          :key="item.id"
          :label="item.account"
          :value="item.id"
        />
      </el-select>
      <span class="adname">子账号：</span>
      <el-input
      style="width: 8%;"
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
      style="width: 6%;"
        v-model="listQuery.brand"
        :default-first-option="true"
        class="filter-item select-item"
        filterable
        placeholder="请选择机型"
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
      style="width: 6%;"
        v-model="listQuery.os_version"
        :default-first-option="true"
        class="filter-item select-item"
        filterable
        placeholder="请选择安卓版本"
        @change="handleFilter"
      >
        <el-option
          v-for="(item,i) in androidList"
          :key="i"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-button
        class="add_income"
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="addDialog"
        >添加</el-button
      >
      <el-button
      size="small"
        class="add_income"
        type="primary"
        icon="el-icon-plus"
        @click="editDialog"
        :disabled="selectList.length == 0||listQuery.proj_id==''"
        >批量编辑</el-button
      >
    </div>
    <el-card shadow="never">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        border="border"
        v-loading="listLoading"
        highlight-current-row
        @select="selectTableItem" @select-all="selectAllTableItem"
      >
      <el-table-column type="selection" width="55" prop="select" header-align="center"
          align="center">

      </el-table-column>
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
        <template slot-scope="{ row }">
          <!-- 判断 show_cnt 列 -->
          <span v-if="column.prop === 'show_cnt'">
            {{ row.show_cnt == null ? 'null' : row.show_cnt_symbol + row.show_cnt }}
          </span>
          <span v-else-if="column.prop === 'click_cnt'">
            {{ row.click_cnt == null ? 'null' : row.click_cnt_symbol + row.click_cnt }}
          </span>
          <!-- 判断 other 列 -->
          <span v-else-if="column.prop === 'other'">
            {{ row.other === 0 ? '' : (row.other === 1 ? '注册设备' : '') }}
          </span>
          <!-- 判断 widget 列 -->
          <span v-else-if="column.prop === 'widget'">
            <template v-if="row.widget === 1">
              <!-- 弹窗展示 -->
              显示弹窗
            </template>
            <template v-else-if="row.widget === 2">
              <!-- 点击添加 -->
              点击添加
            </template>
            <template v-else-if="row.widget === 3">
              <!-- 添加成功 -->
              添加成功
            </template>
          </span>
          <!-- 默认渲染 -->
          <span v-else>{{ row[column.prop] }}</span>
        </template>
        </el-table-column>
        <el-table-column
          prop="operate"
          label="操作"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="primary" @click="editChange(scope.row)"
              >编辑</el-button
            >
          </template>
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
    <Add

      v-if="dialogFormVisible_add"
      :projectsList="projectsList"
      :masterList="masterList"
      :mediaList="mediaList"
      :initData="initData"
      :title="title"
      @updateAddvisible="updateAddvisible"
      @saveActivate="saveActivate"
    />
    <Edit
      v-if="dialogFormVisible_edits"
      :projectsList="projectsList"
      :masterList="masterList"
      :mediaList="mediaList"
      :initData="initData"
      :title="title"
      @updateAddvisible="updateAddvisible"
      @oneEditActivate="oneEditActivate"
    />
    <BulkEdit
      v-if="dialogFormVisible_edit"
      :title="title"
      :initData="initData"
      @updateAddvisible="updateAddvisible"
      @editActivate = "editActivate"
    />
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
// import {
//   getActivateList,
//   addActivate,
//   editActivate,
//   deleteActivate,
//   saveActive,
// } from "@/api/backhaul/activate";
import { getEdit,getAdd ,getList,getBatchEdit} from '@/api/backhaul/newAnchor'
import {
  getMediaList,
  getMediaMasterList,
  getProjectList,
} from "@/api/dynamic/public";
import TableColumns from "@/components/Eltable/index";
import Add from "./components/Add";
import Edit from "./components/Edit.vue"
import BulkEdit from "./components/BulkEdit.vue";
// import BulkDelete from "./components/BulkDelete.vue";

export default {
  name: "Income",
  components: { TableColumns, Pagination, Add, BulkEdit,Edit },
  data() {
    return {
      title: "",
      isInit:true,
      dialogFormVisible_add: false,
      dialogFormVisible_edit:false,
      dialogFormVisible_edits:false,
      dialogFormVisible_delete:false,
      deleteVisible: false,
      listLoading: true,
      stratedy_state: [],
      tableData: [],
      projectsList: [],
      mediaList: [],
      masterList: [],
      // 机型和安卓版本（静态数据）
      modelList:['OPPO','HUAWEI','HONOR','VIVO','XIAOMI','Tianyi','Hinova','NZONE','PTAC','WIKO','MEIZU','samsung','UNICOMVSENS','TDTech','Liantong','JRD','CMDC','其他','全部','空'],
      androidList:['9','10','11','12','13','14','15','空'],
      // 选择的数据
      selectList:[],
      // 初始请求的数据
      initList:[],
      // // 请求的次数
      // getCount:0,

      total: 0,
      initData: {},
      listQuery: {
        proj_id: "",
        media_account_id: "",
        media_id: "",
        channel: '',
        brand:'',
        os_version:'',
        media_account_child_id: "",
        page: 1,
        page_size: 20,
      },
      columns:[
        {
          prop: 'proj_name', 
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
          prop: 'media_account_name', 
          label: '主账户', 
          align: 'center',
          width:'180',
        },
        {
          prop: 'media_account_child_id', 
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
          prop: 'brand', 
          label: '机型', 
          align: 'center' ,
          width:'120',
        },
        {
          prop: 'os_version', 
          label: '安卓版本', 
          align: 'center' ,
          width:'120',
        },
        {
          prop: 'other', 
          label: '其它', 
          align: 'center' ,
          width:'100',
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
          prop: 'arpu', 
          label: 'arpu', 
          align: 'center',
          width:'120',
          render:(h,params) => {
             return (<span>{params.row.arpu == null ?'null':params.row.arpu_symbol+params.row.arpu}</span>)
          },
        },
        {
          prop: 'avg_ecpm', 
          label: '平均ecpm', 
          align: 'center' ,
          width:'100', 
        },
        {
          prop: 'max_ecpm', 
          label: '最大ecpm', 
          align: 'center' ,
          width:'100', 
        },
        {
          prop: 'max_ecpm_total', 
          label: '次数', 
          align: 'center' ,
          width:'100', 
        },
        {
          prop: 'time_limit', 
          label: '计算周期', 
          align: 'center' ,
          width:'100', 
        },
        {
          prop: 'paid_amount', 
          label: '付款金额', 
          align: 'center' ,
          width:'100', 
        },
        {
          prop: 'widget', 
          label: 'widget', 
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
      ]
    };
  },
  created() {
    this.getList();
    this.getMediaList();
    this.getMediaMasterList();
    this.getProjectList();
  },
  methods: {
 

    // 筛选
    handleFilter(value) {
      const { listQuery } = this;
      // console.log(listQuery.os_version);
      listQuery.page = 1;
      this.getList();
    },
    getMediaList() {
      getMediaList()
        .then((data) => {
          if (data.error_code === 0) {
            this.mediaList = data.data;
          }
        })
        .catch(() => {
          this.$message({
            message: "加载媒体失败",
            type: "error",
          });
        });
    },
    getMediaMasterList() {
      getMediaMasterList()
        .then((data) => {
          if (data.error_code === 0) {
            this.masterList = data.data;
          }
        })
        .catch(() => {
          this.$message({
            message: "加载账号失败",
            type: "error",
          });
        });
    },
    getProjectList() {
      getProjectList()
        .then((data) => {
          if (data.error_code === 0) {
            this.projectsList = data.data;
          }
        })
        .catch(() => {
          this.$message({
            message: "加载项目失败",
            type: "error",
          });
        });
    },
    // 获取列表数据
    getList() {
      let datasrc = this.listQuery;
      getList(datasrc)
        .then((data) => {
          if (data.error_code === 0) {
            // console.log(data);
            this.total = data.meta.total;
            this.tableData = data.data;
            this.initList = data.data.filter(item=>item.brand==''&&item.os_version=='')

          this.initList = this.tableData.filter(item => item.brand === '' && item.os_version === '');
            // console.log(initList);
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
    // 选中列表
    selectTableItem(selection,row) {
      // console.log('99',selection);
      // console.log('row22',row);
      this.selectList = selection
    },
    // 全选
    selectAllTableItem(selection) {
      // console.log('88',selection);
      this.selectList = selection
    },
    // 新增按钮点击
    addDialog() {
      this.dialogFormVisible_add = true;
      this.title = "新增";
    },
    editDialog() {
      console.log('eee',this.selectList)
      this.initData = this.selectList
      console.log('llll',this.initData)
      this.dialogFormVisible_edit = true;
      this.title = "批量编辑";
    },
    deleteDialog() {
      this.dialogFormVisible_delete = true;
      this.title = "批量删除";
    },


    // 编辑
    editChange(row) {
      this.dialogFormVisible_edits = true;
      this.initData = row

      // row.other = 1
      console.log('221',this.initData);
      this.title = "编辑";
    },
    //新增弹窗显示隐藏
    updateAddvisible(val) {
      console.log('val',val);
      
      this.dialogFormVisible_add = val;
      this.dialogFormVisible_edits = val;
      this.dialogFormVisible_edit = val;
      this.dialogFormVisible_delete = val;
    },
    // 批量编辑
    editActivate(datasrc) {
      this.initData = this.selectList
      const ids = this.selectList.map(item =>item.id).join(',')
      console.log('params',params)
      const params = {
        ...datasrc,
        ids
      }
      console.log('params',params)
      getBatchEdit(params).then((data) => {
        if (data.error_code == 0) {
          this.$message.success("编辑成功");
          this.selectList = []
          this.getList();
        }
        this.dialogFormVisible_edit = false;
      }).catch(data => {
        this.$message.error(data.error_message)
        this.dialogFormVisible_edit = false;
      });
    },
    
    //聚会处理
    saveActivate(datasrc) {
      console.log(datasrc,'datasrc');
     
      getAdd(datasrc).then(res=>{
        this.dialogFormVisible_add = false;
        if(res.error_code===0){
          console.log('success');
          this.$message({
            message:'新增成功',
            type:'success'
          })
          this.dialogFormVisible_add = false;
          this.getList()
        }else{
          this.$message({
            message:'新增失败',
            type:'error'
          })
        }
      })
      .catch(error=>{
        console.log(error);
        this.$message({
          message:error,
          type:'error'
        })
      })
    },


    // 编辑
    oneEditActivate(datasrc) {
      
      console.log('qqq',datasrc)
      getEdit(datasrc).then((data) => {
        if (data.error_code == 0) {
          this.$message.success("编辑成功");
          this.getList();
        }
        this.dialogFormVisible_edits = false;
      }).catch(data => {
        console.log('编辑失败');
        this.$message.error(data.error_message)
        this.dialogFormVisible_edits = false;
      });
    },
    // 分页- page_size
    handleSizeChange(val) {
      const { listQuery } = this;
      listQuery.page_size = val;
      listQuery.page = 1;
      this.getList();
    },
    // 分页- page
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
  },
};
</script>
<style>
/* .el-dialog {
  width: 850px;
} */
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
.mr20 {
  display: inline-block;
  margin:10px;
}
</style>

