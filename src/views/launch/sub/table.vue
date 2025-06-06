<template>
  <div class="income_div">
    <div class="income_header">
      <span class="adname">代理：</span>
      <el-select
        v-model="listQuery.name"
        clearable
        class="filter-item select-item"
        filterable
        placeholder="请选择代理"
        @change="handleFilter"
      >
        <el-option
          v-for="item in agentList"
          :key="item.id"
          :label="item.short_name"
          :value="item.id"
        />
      </el-select>
      <span class="adname">媒体：</span>
      <el-select
        v-model="listQuery.media_id"
        clearable
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
        v-model="listQuery.account"
        clearable
        class="filter-item select-item"
        filterable
        placeholder="请选择账号"
        @change="handleFilter"
      >
        <el-option
          v-for="item in accountList"
          :key="item.id"
          :label="item.account"
          :value="item.id"
        />
      </el-select>
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
      <span class="adname">子账号：</span>
      <el-input
        clearable
        v-model="listQuery.media_account_child"
        class="filter-item select-item"
        placeholder="请填写子账号"
        @change="handleFilter"
      />
      <el-button
        class="add_income"
        type="primary"
        icon="el-icon-edit"
        @click="open"
        >添加</el-button
      >
      <el-button
        class="add_income"
        type="primary"
        icon="el-icon-edit"
        @click="openMore"
        >批量添加</el-button
      >
      <el-button
        class="add_income"
        type="primary"
        icon="el-icon-edit"
        @click="download"
        >批量下载</el-button
      >
      <el-button
        :disabled="stop"
        class="add_income"
        type="primary"
        icon="el-icon-edit"
        @click="chooseTable(2)"
        >停止投放</el-button
      >
      <el-button
        :disabled="start"
        class="add_income"
        type="primary"
        icon="el-icon-edit"
        @click="chooseTable(1)"
        >开始投放</el-button
      >
    </div>
    <el-card shadow="never">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="id" label="序号"> </el-table-column>
        <el-table-column prop="media" label="媒体"> </el-table-column>
        <el-table-column prop="account" label="主账号" width="200">
        </el-table-column>
        <el-table-column
          prop="media_account_child_id"
          label="子账号id"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="gdt_user_action_set_id"
          label="行为数据源"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="ver"
          label="是否对接今日头条2.0接口"
          width="120"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row['ver']"> 是 </span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column prop="event_type_text" label="转化目标">
        </el-table-column>
        <el-table-column prop="operator" label="创建者" width="150">
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="200">
        </el-table-column>
        <el-table-column prop="updated_at" label="更新时间" width="200">
        </el-table-column>
        <el-table-column prop="status" label="状态" fixed="right" width="150">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 1"
              type="primary"
              @click="statusChange(scope.row)"
              >正在投放</el-button
            >
            <el-button v-else type="warning" @click="statusChange(scope.row)"
              >已停投</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />
    </el-card>
    <el-dialog :visible.sync="dialogFormVisible_add" title="添加子账号">
      <el-form ref="form" :rules="rule" :model="add_form">
        <el-form-item
          :label-width="formLabelWidth"
          label="子账号id:"
          prop="account_child_id"
        >
          <el-input
            v-model="add_form.account_child_id"
            placeholder="请输入账号名"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="主账号:"
          prop="media_account_id"
        >
          <el-select
            filterable
            placeholder="请选择主账号"
            @change="mediaChange(add_form.media_account_id)"
            v-model="add_form.media_account_id"
          >
            <el-option
              v-for="item in accountList"
              :key="item.id"
              :label="item.account"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-input
            class="input-item"
            v-if="media_id === 1 || media_id === 3"
            v-model.number="add_form.gdt_user_action_set_id"
            placeholder="请输入行为数据源"
          />
        </el-form-item>
         <el-form-item
          :label-width="formLabelWidth"
          v-if="media_id === 4"
          label="投放类型:"
          prop="launch_type"
        >
          <el-select
            filterable
            placeholder="请选择投放类型"
            v-model="add_form.launch_type"
          >
            <el-option
              v-for="item in launchList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          v-if="media_id === 10"
          label="子账号回传秘钥:"
          prop="gdt_user_action_set_id"
        >
          <el-input
            v-model="add_form.gdt_user_action_set_id"
            placeholder="请输入回传秘钥，否则不会回传数据"
          />
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="状态选择:"
          prop="status"
        >
          <div>
            <el-radio-group v-model="add_form.status">
              <el-radio :label="1">投放</el-radio>
              <el-radio :label="2">停投</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <!-- 激活事件源id -->
        <el-form-item
          :label-width="formLabelWidth"
          label="激活事件源id:"
          prop="vivo_src_id"
          v-if="media_id == 9"
        >
          <el-input
            v-model="add_form.vivo_src_id"
            placeholder="请输入激活事件源id"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item
          v-if="media_id === 5"
          :label-width="200"
          label="是否对接今日头条2.0接口:"
          prop="ver"
        >
          <div>
            <el-radio-group v-model="add_form.ver">
              <el-radio label="v2">是</el-radio>
              <el-radio label="v1">否</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="转化目标:"
          prop="event_type"
          v-if="media_id == 5"
        >
          <div>
            <el-radio-group v-model="add_form.event_type">
              <el-radio :label="2">付费</el-radio>
              <el-radio :label="25">关键行为</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="oppo app-id:"
          prop="media_app_id"
          v-if="media_id == 8||media_id == 15"
        >
          <el-input
            placeholder="请输入oppo app-id"
            v-model="add_form.media_app_id"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="oppo app-key:"
          prop="media_app_key"
          v-if="media_id == 8||media_id == 15"
        >
          <el-input
            placeholder="请输入oppo app-key"
            v-model="add_form.media_app_key"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="access_token:"
          prop="media_app_id"
          v-if="media_id == 11"
        >
          <el-input
            placeholder="请输入access_token"
            v-model="add_form.media_app_id"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="refresh_token:"
          prop="media_app_key"
          v-if="media_id == 11"
        >
          <el-input
            placeholder="请输入refresh_token"
            v-model="add_form.media_app_key"
            style="width: 240px"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_add = false">取 消</el-button>
        <el-button type="primary" @click="addclick(add_form)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogFormVisible_addMore" title="批量添加">
      <el-form ref="addform" :rules="addrule" :model="addMore_form">
        <el-form-item
          :label-width="formLabelWidth"
          label="主账号:"
          prop="media_account_id"
        >
          <el-select
            filterable
            placeholder="请选择主账号"
            @change="mediaTemplateChange"
            v-model="addMore_form.media_account_id"
          >
            <el-option
              v-for="item in accountList"
              :key="item.id"
              :label="item.account"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-button style="margin-top: 10px" @click="getTemplate"
            >查看上传文件格式</el-button
          >
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="文件上传:"
          prop="childs_file"
        >
          <el-upload
            ref="upload"
            :limit="1"
            :on-change="handleChange"
            :auto-upload="false"
            class="upload"
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            name="file"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">点击上传</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_addMore = false">取 消</el-button>
        <el-button type="primary" @click="addclickMore(addMore_form)"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import {
  getSubList,
  addSub,
  editSub,
  subDownload,
  addSubMore,
  statusSub,
  getTemplateLink
} from "@/api/dynamic/sub";
import {
  getMediaList,
  getProjectList,
  getAgent,
  getMediaMasterList
} from "@/api/dynamic/public";
import { getToken } from "@/utils/auth"; // getToken from cookie
export default {
  name: "Income",
  components: { Pagination },
  data() {
    const validatePass = (rule, value, callback) => {
      let reg = /^[0-9a-zA-Z_]{1,}$/;
      if (!reg.test(value)) {
        callback(new Error("子账号id只支持字母数字下划线"));
      } else {
        callback();
      }
    };
    return {
      isLoading: false,
      dialogtitle: "用户编辑",
      dialogFormVisible: false,
      dialogFormVisible_add: false,
      dialogFormVisible_addMore: false,
      addMore_form: {
        media_account_id: "",
        childs_file: []
      },
      launchList: [
        {
          value: 'bdfeed',
          label: '信息流'
        },
        {
          value: 'bdsearch',
          label: '大搜'
        },
      ],
      add_form: {
        account_child_id: "",
        media_account_id: "",
        status: 1,
        gdt_user_action_set_id: "",
        launch_type: 'bdfeed',
        ver: "",
        event_type: 2,
        media_app_id: "",
        media_app_key: "",
        vivo_src_id:""
      },
      formLabelWidth: `150px`,
      name: "",
      total: 0,
      mediaList: [],
      agentList: [],
      projectList: [],
      accountList: [],
      pagination: {
        page: 1,
        pageSize: 20
      },
      listQuery: {
        name: "",
        account: "",
        media_id: "",
        proj_id: "",
        media_account_child: "",
      },
      token: getToken(),
      tableData: [],
      listLoading: true,
      rule: {
        account_child_id: [
          { required: true, message: "请输入子账号", trigger: "blur" },
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        media_account_id: [
          { required: true, message: "请选择主账号", trigger: "blur" }
        ],
        gdt_user_action_set_id: [
          { required: true, message: "请填写子账号回传秘钥", trigger: "blur" }
        ],
        launch_type: [
          { required: true, message: "请选择投放类型", trigger: "change" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        vivo_src_id: [
        { required: true, message: "请输入激活事件源id", trigger: "blur" },
        ],
        ver: [{ required: true, message: "请选择状态", trigger: "change" }],
        event_type: [
          { required: true, message: "请选择转化目标", trigger: "change" }
        ],
        media_app_id: [
          { required: true, message: "请选择oppo app_id", trigger: "blur" }
        ],
        media_app_key: [
          { required: true, message: "请选择oppo app_key", trigger: "blur" }
        ]
      },
      addrule: {
        media_account_id: [
          { required: true, message: "请选择主账号", trigger: "blur" }
        ],
        childs_file: [
          { required: true, message: "请上传文件", trigger: "blur" }
        ]
      },
      list: [],
      start: true,
      stop: true,
      multipleSelection: [],
      visibleStatus: false,
      media_id: "",
      media_idTemplate: ""
    };
  },
  created() {
    // this.rule = this.rules
    // this.addrule = this.addrules
    this.getAgent();
    this.getMediaList();
    this.getProjectList();
    this.getAccount();
    this.getList();
  },
  methods: {
    mediaChange(id) {
      this.accountList.map(item => {
        console.log(item);
        if (item.id == id) {
          // media_id == 5主账号
          this.media_id = item.media_id;
        }
      });
    },
    download() {
      const baseUrl = process.env.BASE_API;
      let url = `${baseUrl}/api/media/account/child/download?name=${
        this.listQuery.name
      }&account=${this.listQuery.account}&media_id=${
        this.listQuery.media_id
      }&proj_id=${this.listQuery.proj_id}&media_account_child=${
        this.listQuery.media_account_child
      }&token=${this.token}`;
      window.open(url);
    },
    mediaTemplateChange(e) {
      this.accountList.map(item => {
        if (item.id == e) {
          // media_id == 5主账号
          this.media_idTemplate = item.media_id;
        }
      });
    },
    getTemplate() {
      if (this.media_idTemplate) {
        getTemplateLink({ media_id: this.media_idTemplate }).then(data => {
          if (data.error_code === 0) {
            window.open(data.data.link);
          }
        });
      } else {
        this.$message({
          message: "请选择主账号",
          type: "warning"
        });
      }
    },
    handleChange(file) {
      const { size } = file;
      if (!(file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
        this.$message.error("请上传xlsx格式的文件");
        return false;
      }
      if (size / 1024 / 1024 > 3) {
        this.$message.error("文件大小不得大于3M");
        return false;
      }
      this.addMore_form.childs_file = file.raw;
    },
    // 筛选
    handleFilter(value) {
      const { pagination } = this;
      pagination.page = 1;
      this.getList();
    },
    // 新增收入源
    open() {
      // this.$router.push({ path: 'income/addIncome' })
      this.dialogFormVisible_add = true;
      (this.add_form = {
        account_child_id: "",
        media_account_id: "",
        gdt_user_action_set_id: "",
        launch_type: "bdfeed",
        status: 1,
        event_type: 2
      }),
        (this.media_id = "");
    },
    addclick(form) {
      if (this.isLoading) {
        // 如果正在发送请求，则不执行后续操作
        return;
      }
      this.isLoading = true; // 设置为正在发送请求状态
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.media_id !== 5) {
            delete form.event_type;
          }
          if (form.id) {
            editSub(form).then(data => {
              if (data.error_code === 0) {
                this.$message.success(
                  data.error_message ? data.error_message : "保存成功"
                );
                this.getList();
              } else {
                this.$message.error(
                  data.error_message ? data.error_message : "保存失败"
                );
              }
              this.isLoading = false; // 请求完成后重置isLoading状态
            }).catch(error => {
              this.$message.error("保存失败");
              this.isLoading = false; // 请求失败时也要重置isLoading状态
            });
          } else {
            addSub(form).then(data => {
              if (data.error_code === 0) {
                console.log(form, data.data, "保存成功");
                this.$message.success(
                  data.error_message ? data.error_message : "保存成功"
                );
                this.getList();
              } else {
                this.$message.error(
                  data.error_message ? data.error_message : "保存失败"
                );
              }
              this.isLoading = false; // 请求完成后重置isLoading状态
            }).catch(error => {
              this.$message.error("保存失败");
              this.isLoading = false; // 请求失败时也要重置isLoading状态
            });
          }
          this.dialogFormVisible_add = false;
        } 
      });
  },
    //批量添加
    openMore() {
      // this.$router.push({ path: 'income/addIncome' })
      this.dialogFormVisible_addMore = true;
      this.$refs.upload.clearFiles();
      this.addMore_form = {
        media_account_id: "",
        childs_file: []
      };
    },
    addclickMore(form) {
      if (this.isLoading) {
        return;
      }
      this.isLoading = true
      this.$refs.addform.validate(valid => {
        if (valid) {
          const formData = new FormData();
          formData.append("childs_file", form.childs_file);
          formData.append("media_account_id", form.media_account_id);
          addSubMore(formData).then(data => {
            if (data.error_code === 0) {
              this.$message({
                type: "success",
                message: "新增成功!"
              });
              this.getList();
            } else {
              this.$message({
                type: "error",
                message: "新增失败!"
              });
            }
            this.isLoading = false;
            this.dialogFormVisible_addMore = false;
          });
        }
      });
    },
    // 多选项操作
    handleSelectionChange(val) {
      var ids = [];
      if (val.length > 0) {
        this.start = false;
        this.stop = false;
        for (var key in val) {
          ids.push(val[key].id);
          if (val[key].status === 2) {
            // 暂停状态
            this.stop = true;
            continue;
          }
          if (val[key].status === 1) {
            this.start = true;
          }
        }
      } else {
        this.start = true;
        this.stop = true;
      }
      this.multipleSelection = ids;
    },
    statusChange(row) {
      //单个停止投放
      this.$confirm("是否确认修改状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            childs_id: [],
            status: row.status == 1 ? 2 : 1
          };
          params.childs_id.push(row.id);
          statusSub(params).then(data => {
            if (data.error_code === 0) {
              this.$message.success(
                data.error_message ? data.error_message : "状态改变成功"
              );
              this.getList();
            } else {
              this.$message.error(
                data.error_message ? data.error_message : "状态改变失败"
              );
            }
          });
          this.visibleStatus = false;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改"
          });
        });
    },
    chooseTable(num) {
      //批量停止投放
      let params = {
        childs_id: this.multipleSelection,
        status: num
      };
      statusSub(params).then(data => {
        if (data.error_code === 0) {
          this.$message.success(data.error_message);
          this.getList();
        } else {
          this.$message.success(data.error_message);
        }
      });
    },
    // 请求代理
    getAgent() {
      getAgent().then(data => {
        if (data.error_code === 0) {
          this.agentList = data.data;
        }
      });
    },
    // 请求媒体
    getMediaList() {
      getMediaList().then(data => {
        if (data.error_code === 0) {
          this.mediaList = data.data;
        }
      });
    },
    // 请求项目
    getProjectList() {
      getProjectList().then(data => {
        if (data.error_code === 0) {
          this.projectList = data.data;
        }
      });
    },
    // 请求账号
    getAccount() {
      getMediaMasterList().then(data => {
        if (data.error_code === 0) {
          this.accountList = data.data;
          console.log(data.data);
        }
      });
    },
    // 请求数据
    getList() {
      const { pagination, listQuery } = this;
      const params = {
        ...pagination,
        ...listQuery
      };
      getSubList(params)
        .then(data => {
          if (data.error_code === 0) {
            this.tableData = data.data;
            this.total = data.meta.total;
            this.listLoading = false;
          }
        })
        .catch(() => {
          this.$message({
            message: "加载失败",
            type: "error"
          });
        });
    }
  }
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
  width: 150px;
  margin: 10px 20px 0px 0px;
}
.input-item {
  width: 150px;
}
</style>
