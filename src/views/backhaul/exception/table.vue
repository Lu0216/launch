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
        <el-option label="全部" value="" />
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
        <el-option label="全部" value="" />
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
        <el-option label="全部" value="" />
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
      style="width: 6%;"
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
      <el-button
      size="small"
        class="add_income"
        type="primary"
        icon="el-icon-plus"
        :disabled="selectList.length == 0"
        @click="deleteDialog"
        >批量删除</el-button
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
        </el-table-column>
        <el-table-column
          prop="operate"
          label="操作"
          header-align="center"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="warning" @click="editChange(scope.row)"
              >编辑</el-button
            >
            <el-popover
            v-if="!initList.includes(scope.row)"
              placement="top"
              width="160"
              :ref="`popover-${scope.row.id}`"
            >
              <p>确定删除该条数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button
                  size="mini"
                  type="text"
                  @click="
                    scope._self.$refs[`popover-${scope.row.id}`].doClose()
                  "
                  >取消</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleDelete(scope)"
                  >确定</el-button
                >
              </div>
              <el-button type="primary" slot="reference">删除</el-button>
            </el-popover>
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
      :initData="initData"
      :title="title"
      @updateAddvisible="updateAddvisible"
      @saveActivate="saveActivate"
      @oneEditActivate="oneEditActivate"
    />
    <BulkEdit
      v-if="dialogFormVisible_edit"
      :title="title"
      :initData="initData"
      @updateAddvisible="updateAddvisible"
      @editActivate = "editActivate"
    />
    <BulkDelete
      v-if="dialogFormVisible_delete"
      :title="title"
      @updateAddvisible="updateAddvisible"
      @deleteActivate = "deleteActivate"
    ></BulkDelete>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import {
  getActivateList,
  addActivate,
  editActivate,
  deleteActivate,
  saveActive,
} from "@/api/backhaul/activate";
import {
  getMediaList,
  getMediaMasterList,
  getProjectList,
} from "@/api/dynamic/public";
import TableColumns from "@/components/Eltable/index";
import Add from "./components/Add";
import BulkEdit from "./components/BulkEdit.vue";
import BulkDelete from "./components/BulkDelete.vue";

export default {
  name: "Income",
  components: { TableColumns, Pagination, Add, BulkEdit, BulkDelete },
  data() {
    return {
      title: "",
      isInit:true,
      dialogFormVisible_add: false,
      dialogFormVisible_edit:false,
      dialogFormVisible_delete:false,
      deleteVisible: false,
      listLoading: true,
      stratedy_state: [],
      tableData: [],
      projectsList: [],
      mediaList: [],
      masterList: [],
      // 机型和安卓版本（静态数据）
      modelList:['OPPO','HUAWEI','HONOR','VIVO','XIAOMI','Tianyi','Hinova','NZONE','PTAC','WIKO','MEIZU','samsung','UNICOMVSENS','TDTech','Liantong','JRD','CMDC','其他','空'],
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
      columns: [
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
          prop: "media_account_name",
          label: "主账号",
          align: "center",
        },
        {
          prop: "media_account_child_id",
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
          prop: "symbol_text",
          label: "运算符",
          align: "center",
        },
        {
          prop: "anchor_name",
          label: "激活回传锚点",
          align: "center",
        },
        
        {
          prop: "ratio",
          label: "概率",
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
      getActivateList(datasrc)
        .then((data) => {
          if (data.error_code === 0) {
            // console.log(data);
            this.total = data.meta.total;
            this.tableData = data.data;
            this.initList = data.data.filter(item=>item.brand==''&&item.os_version=='')
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
      // console.log('eee',this.selectList)
      this.initData = this.selectList
      // console.log('llll',this.initData)
      this.dialogFormVisible_edit = true;
      this.title = "批量编辑";
    },
    deleteDialog() {
      this.dialogFormVisible_delete = true;
      this.title = "批量删除";
    },


    // 编辑
    editChange(row) {
      this.dialogFormVisible_add = true;
      this.initData = row;
      console.log(row);
      this.title = "编辑";
    },
    //新增弹窗显示隐藏
    updateAddvisible(val) {
      this.dialogFormVisible_add = val;
      this.dialogFormVisible_edit = val;
      this.dialogFormVisible_delete = val;
    },
    // 删除
    handleDelete(scope) {
      // console.log(scope);
      const id = scope.row.id
      // console.log(id);
      deleteActivate({id})
        .then((data) => {
     
          if (data.error_code === 0) {
            scope._self.$refs[`popover-${scope.row.id}`].doClose();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getList();
          } else {
            this.$message({
              type: "error",
              message: "删除失败!",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "删除失败!",
          });
        });
    },
    // 批量编辑
    editActivate(datasrc) {
      this.initData = this.selectList
      const id = this.selectList.map(item =>item.id).join(',')
      const params = {
        ...datasrc,
        id
      }
      // console.log(params);
      editActivate(params).then((data) => {
        if (data.error_code == 0) {
          this.$message.success("编辑成功");
          this.getList();
        }
        this.dialogFormVisible_edit = false;
      }).catch(data => {
        this.$message.error(data.error_message)
        this.dialogFormVisible_edit = false;
      });
    },
    // 批量删除
    deleteActivate() {
      const id = this.selectList.map(item =>item.id).join(',')
      // console.log(id);
      deleteActivate({id})
        .then((data) => {
          if (data.error_code === 0) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.dialogFormVisible_delete = false;
            this.getList();
          } else {
            this.$message({
              type: "error",
              message: "删除失败!",
            });
            this.dialogFormVisible_delete = false;
          }
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "删除失败!",
          });
          this.dialogFormVisible_delete = false;
        });
    },

    // 调用新增
    // addActivateApi(datasrc){
    //   addActivate(datasrc)
    //     .then((data) => {
    //       if (data.error_code === 0) {
    //         this.$message({
    //           type: "success",
    //           message: "新增成功!",
    //         });
    //         this.getList();
    //       } else {
    //         console.log(datasrc,'fails');
    //         this.$message({
    //           type: "error",
    //           message: "新增失败!",
    //         });
    //       }
    //       this.dialogFormVisible_add = false;
    //     })
    //     .catch(() => {
    //       console.log(datasrc,'catch');
    //       this.$message({
    //         type: "error",
    //         message: "新增失败!",
    //       });
    //       this.dialogFormVisible_add = false;
    //     });
    // } ,

    //聚会处理
    saveActivate(datasrc) {
      console.log(datasrc,'datasrc');
     
      saveActive(datasrc).then(res=>{
        this.dialogFormVisible_add = false;
        if(res.error_code===0){
          console.log('success');
          this.$message({
            message:'新增成功',
            type:'success'
          })
          this.dialogFormVisible_add = false
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


    // 新增保存
    // addActivate(datasrc) {
    //   // 拿到重复的项的id
    //   let isRepeat = []  //重复项的数组 -覆盖 -edit
    //   let repeatId = []  //重复项的id
    //   let noRepeat = []  //不重复项的数组 -新增 -add
    //   // 拿到重复的项
    //   console.log(datasrc,'datasrc');
    //   datasrc.forEach(item1=>{
    //     const repeat = this.tableData.filter(item=>item.proj_id==item1.proj_id&&item.media_account_id==item1.media_account_id&&item.media_account_child_id==item1.media_account_child_id&&item.brand==item1.brand&&item.os_version==item1.os_version)
    //     isRepeat.push(repeat) //重复的项
    //   })
    //   // console.log(isRepeat.flat().length,isRepeat);
    //   // console.log(datasrc,'datasrc');
    //   // console.log(isRepeat.flat(),'isRepeat');
    //   let temp = []
    //   if(isRepeat.flat().length!=0){
    //     // 得到不重复的项的部分
    //     console.log(isRepeat.flat().length,datasrc.length,'length');
    //     if(isRepeat.flat().length==datasrc.length){
    //       noRepeat = []
    //     }else{
    //       isRepeat.flat().forEach(item =>{
    //         const x = datasrc.filter(item1=>item.proj_id==item1.proj_id&&item.media_account_child_id==item1.media_account_child_id&&item.os_version==item1.os_version&&item.brand==item1.brand&&item.media_account_id==item1.media_account_id)
    //         console.log(x,'111');
    //         temp.push(x)
    //       })
    //       noRepeat = datasrc.filter(item=>!temp.flat().includes(item))
    //       console.log(temp);
    //     }
   
    //     // 得到重复项的Id
    //     isRepeat.flat().forEach(item1=>{
    //       // console.log(item);
    //       const id = this.tableData.find(item=>item.proj_id==item1.proj_id&&item.media_account_id==item1.media_account_id&&item.media_account_child_id==item1.media_account_child_id&&item.brand==item1.brand&&item.os_version==item1.os_version).id
    //       // console.log(id);
    //       repeatId.push(id)
    //   })
    //     // 重复的项覆盖原来的 
    //     isRepeat.flat().forEach(item=>{
    //       // item.id = `${item.id}`
    //       const {id,ratio,anchor_id,symbol} = item
    //       this.oneEditActivate({id,ratio,anchor_id,symbol})
    //     })
    //     // 不重复的项新增
    //    if(noRepeat.length!=0){
    //     console.log(noRepeat,'223');
    //       noRepeat.forEach(item=>{
    //       this.addActivateApi(item)
    //     })
    //    }

    //    console.log(noRepeat,isRepeat.flat(),'final');
    //   }
    //   // 没有重复的项是则传入的全部新增
    //   else {
    //     console.log(datasrc,'123');
    //     datasrc.forEach(item=>{
    //     this.addActivateApi(item)
    //    })
    //   }

    // },
    // 编辑
    oneEditActivate(datasrc) {
      // console.log(datasrc);
      const {id,ratio,anchor_id,symbol} = datasrc
      console.log({id,ratio,anchor_id,symbol});
      editActivate({id,ratio,anchor_id,symbol}).then((data) => {
        if (data.error_code == 0) {
          this.$message.success("编辑成功");
          this.getList();
        }
        this.dialogFormVisible_add = false;
      }).catch(data => {
        console.log('编辑失败');
        this.$message.error(data.error_message)
        this.dialogFormVisible_add = false;
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
</style>import { pushd } from "shelljs";
import { find } from "shelljs";
import { find } from "shelljs";
import { filter } from "vue/types/umd";
import { saveActive } from "../../../api/backhaul/activate";
import { error } from "shelljs";

