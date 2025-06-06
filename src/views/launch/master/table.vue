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
      <span class="adname">账号：</span>
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
        @click="download"
        >批量下载</el-button
      >
      <span class="adname">账户类型：</span>
      <el-select
        v-model="listQuery.is_cashback"
        clearable
        class="filter-item select-item"
        filterable
        placeholder="请选择账号类型"
        @change="handleFilter"
      >
        <el-option
          v-for="item in cashback"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <span class="adname">是否对接今日头条2.0接口：</span>
      <el-select
        v-model="listQuery.is_headline"
        clearable
        class="filter-item select-item"
        filterable
        placeholder="请选择是否对接今日头条2.0"
        @change="handleFilter"
      >
        <el-option
          v-for="item in isHeadline"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
    <el-card shadow="never">
      <TableColumns
        :dataSource="list"
        :total="total"
        :listLoading="listLoading"
        :columns="columns"
        :currentPage="pagination.page"
        :pageSize="pagination.pageSize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      >
      </TableColumns>
    </el-card>
    <el-dialog
      :visible.sync="dialogFormVisible_add"
      :title="add_form.id ? '编辑账号' : '创建账号'"
    >
      <el-form ref="myform" :rules="rules" :model="add_form">
        <el-form-item
          :label-width="formLabelWidth"
          label="账号名:"
          prop="account"
        >
          <el-input
            v-model="add_form.account"
            :disabled="add_form.id ? true : false"
            placeholder="请输入账号名"
          />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="密码:" prop="pass">
          <el-input v-model="add_form.pass" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="关联媒体:"
          prop="media_id"
        >
          <el-select
            filterable
            placeholder="请选择"
            v-model="add_form.media_id"
            @change="mediaChange(add_form.media_id)"
            :disabled="add_form.id ? true : false"
          >
            <el-option
              v-for="item in mediaList"
              :key="item.id"
              :label="item.name_cn"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label-width="'230px'"
          label="是否为框返账户:"
          prop="is_cashback"
          v-if="add_form.media_id == 5"
        >
          <el-radio-group
            v-model="add_form.is_cashback"
            @change="checkboxchange"
            :disabled="
              add_form.id && edit_form.is_cashback === 1 ? true : false
            "
          >
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="关联项目:"
          prop="proj_id"
        >
          <el-select
            filterable
            placeholder="请选择"
            v-model="add_form.proj_id"
            :disabled="add_form.id ? true : false"
          >
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.app_name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <span v-show="add_form.id ? true : false" style="color: #dddddd"
            >如需更改关联项目,请联系我们</span
          >
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="一级垫款:"
          prop="agency_core_id"
        >
          <el-select
            filterable
            placeholder="请选择代理"
            v-model="add_form.agency_core_id"
          >
            <el-option
              v-for="item in agentAddList"
              :key="item.id"
              :label="item.short_name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-input
            class="input-item"
            width="300px"
            v-model="add_form.rebates"
            @input="validatePositiveNumber('rebates')"
            style="width: 180px;"
            placeholder="请输入返点"
          >
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="二级优化:"
          prop="agency_opti_id"
        >
          <el-select
            filterable
            placeholder="请选择代理"
            v-model="add_form.agency_opti_id"
          >
            <el-option
              v-for="item in agentAddList"
              :key="item.id"
              :label="item.short_name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-input
            class="input-item"
            v-model="add_form.charge"
            @input="validatePositiveNumber('charge')"
            placeholder="请输入服务费"
          />
        </el-form-item>
        <el-form-item
          :label-width="'155px'"
          label="返点服务费生效时间:"
          prop="start_at"
        >
          <el-date-picker
            :clearable="false"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            v-model="add_form.start_at"
            type="datetime"
            placeholder="选择日期"
          >
          </el-date-picker>
          <span v-show="add_form.id ? true : false" style="color: #dddddd"
            >如需选择不可选时间,请联系我们</span
          >
        </el-form-item>
        <!-- <el-form-item
          :label-width="'230px'"
          label="是否对接今日头条2.0接口:"
          prop="is_headline"
          v-if="add_form.media_id == 5"
        >
          <el-radio-group :disabled="add_form.media_id == 5" v-model="add_form.is_headline">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item
          :label-width="'155px'"
          label="是否使用增长参谋:"
          prop="use_growth_staff"
        >
          <el-checkbox
            v-model="add_form.use_growth_staff"
            :true-label="1"
            :false-label="0"
          ></el-checkbox>
          <span style="color: #dddddd; margin-left: 10px"
            >勾选后请至穿山甲后台添加权限</span
          >
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_add = false">取 消</el-button>
        <el-button type="primary" @click="addclick(add_form)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAccountList,
  addAccount,
  editAccount,
  AccountDownload,
} from "@/api/dynamic/master";
import {
  getMediaList,
  getProjectList,
  getAgent,
  getMediaMasterList,
} from "@/api/dynamic/public";
import TableColumns from "@/components/Eltable/index";
import { getToken } from "@/utils/auth"; // getToken from cookie
export default {
  name: "Master",
  components: { TableColumns },
  data() {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          return this.dealDisabledDate(time);
        },
      }, // 日期设置对象
      disDate: "",
      title: "编辑",
      dialogFormVisible_add: false,
      edit_form: {},
      add_form: {
        is_cashback: 2,
        account: "",
        pass: "",
        media_id: "",
        agency_core_id: "",
        rebates: "",
        proj_id: "",
        agency_opti_id: "",
        charge: "",
        start_at: "",
        is_headline: "",
        use_growth_staff: 0,
      },
      formLabelWidth: "120px",
      mediaList: [],
      agentList: [],
      agentAddList: [],
      projectList: [],
      accountList: [],
      pagination: {
        page: 1,
        pageSize: 20,
      },
      total: 0,
      listQuery: {
        name: "",
        media_id: "",
        proj_id: "",
        account: "",
        is_cashback: "",
        is_headline: "",
      },
      //项目类型
      cashback: [
        {
          id: 1,
          name: "返货/框返/赠送金账户",
        },
        {
          id: 2,
          name: "普通账户",
        },
      ],
      // 是否对接今日头条2.0
      isHeadline: [
        {
          id: 0,
          name: "全部",
        },
        {
          id: 1,
          name: "是",
        },
        {
          id: 2,
          name: "否",
        },
      ],
      token: getToken(),
      listLoading: true,
      mediaOptions: [
        { id: 1, name: "广点通" },
        { id: 2, name: "快手" },
      ],
      rules: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur",
          },
        ],
        pass: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 1,
            max: 40,
            message: "长度在 1 到 40 个字符",
            trigger: "blur",
          },
        ],
        media_id: [{ required: true, message: "请选择媒体", trigger: "blur" }],
        proj_id: [{ required: true, message: "请选择项目", trigger: "blur" }],
        agency_core_id: [
          { required: true, message: "请选择一级垫付", trigger: "blur" },
        ],
        agency_opti_id: [
          { required: true, message: "请选择二级优化", trigger: "blur" },
        ],
        start_at: [
          {
            required: true,
            message: "请选择返点服务费生效时间",
            trigger: "blur",
          },
        ],
      },
      list: [],
      columns: [
        {
          prop: "id", // <String>  对应属性名
          label: "序号", // <String>   表头标签
          align: "center", // 表头内容是否居中
        },
        {
          prop: "account", // <String>  对应属性名
          label: "账号名", // <String>   表头标签
          align: "center", // 表头内容是否居中
        },
        {
          prop: "pass", // <String>  对应属性名
          label: "密码", // <String>   表头标签
          align: "center", // 表头内容是否居中
        },
        {
          prop: "agency_core_name", // <String>  对应属性名
          label: "核心代理", // <String>   表头标签
          align: "center", // 表头内容是否居中
        },
        {
          prop: "rebates", // <String>  对应属性名
          label: "返点", // <String>   表头标签
          align: "center", // 表头内容是否居中
        },
        {
          prop: "agency_opti_name", // <String>  对应属性名
          label: "优化代理", // <String>   表头标签
          align: "center", // 表头内容是否居中
        },
        {
          prop: "charge", // <String>  对应属性名
          label: "服务费", // <String>   表头标签
          align: "center", // 表头内容是否居中
        },
        {
          prop: "media_name", // <String>  对应属性名
          label: "媒体名称", // <String>   表头标签
          align: "center", // 表头内容是否居中
        },
        {
          prop: "media_name", // <String>  对应属性名
          label: "是否对接今日头条2.0接口", // <String>   表头标签
          align: "center", // 表头内容是否居中
          render: (i, item) => {
            if (item.row.is_headline == 1) {
              return <span>是</span>;
            } else {
              return <span>否</span>;
            }
          },
        },
        {
          prop: "proj_name", // <String>  对应属性名
          label: "项目", // <String>   表头标签
          align: "center", // 表头内容是否居中
        },
        {
          prop: "is_cashback",
          label: "是否是框返账户", // <String>   表头标签
          align: "center", // 表头内容是否居中
          render: (i, item) => {
            if (item.row.is_cashback == 1) {
              return <span>是</span>;
            } else {
              return <span>否</span>;
            }
          },
        },
        {
          prop: "operator", // <String>  对应属性名
          label: "创建者", // <String>   表头标签
          align: "center", // 表头内容是否居中
        },
        {
          prop: "created_at", // <String>  对应属性名
          label: "创建时间", // <String>   表头标签
          align: "center", // 表头内容是否居中
        },
        {
          prop: "updated_at", // <String>  对应属性名
          label: "更新时间", // <String>   表头标签
          align: "center", // 表头内容是否居中
        },
        {
          prop: "start_at", // <String>  对应属性名
          label: "返点服务费生效时间", // <String>   表头标签
          align: "center", // 表头内容是否居中
        },
        {
          prop: "auth_url", // <String>  对应属性名
          label: "token授权链接", // <String>   表头标签
          align: "center", // 表头内容是否居中
          width: 150, // 列宽
          render: (h, params) => {
            return (
              <el-tooltip placement="top">
                <div slot="content" style="width:300px;">
                  {params.row.auth_url}
                </div>
                <div style="width:100px;white-space:nowrap;text-overflow:ellipsis;verflow:hidden;">
                  {params.row.auth_url}
                </div>
              </el-tooltip>
            );
          },
        },
        {
          prop: "use_growth_staff", // <String>  对应属性名
          label: "是否使用增长参谋", // <String>   表头标签
          align: "center", // 表头内容是否居中
          render: (i, item) => {
            if (item.row.use_growth_staff == 1) {
              return <span>是</span>;
            } else {
              return <span>否</span>;
            }
          },
        },
        {
          prop: "id", // <String>  对应属性名
          label: "操作", // <String>   表头标签
          align: "center", // 表头内容是否居中
          width: 200, // 列宽
          render: (h, params) => {
            const editButton = h(
              "el-button",
              {
                props: {
                  type: "primary",
                },
                on: {
                  click: () => {
                    this.editType(params.row);
                  },
                },
              },
              "编辑"
            );
            return h("div", [editButton]);
          },
        },
      ],
    };
  },
  created() {
    this.getAgent();
    this.getMediaList();
    this.getProjectList();
    this.getAccount();
    this.getList();
  },
  methods: {
    validatePositiveNumber(field) {
      if (this.add_form[field] < 0) {
        this.add_form[field] = ''
        this.$message.error('返点和服务费只允许输入正值')
      }
    },
    dealDisabledDate(time) {
      const disTime = this.add_form.id
        ? new Date(this.disDate).getTime()
        : Date.now() - 24 * 60 * 60 * 1000;
      return time.getTime() < disTime;
    },
    // 筛选
    handleFilter(value) {
      const { pagination } = this;
      pagination.page = 1;
      this.getList();
    },
    editType(params) {
      this.dialogFormVisible_add = true;
      if (this.$refs.myform) {
        this.$refs.myform.resetFields();
      }
      this.disDate = params.start_at;
      this.add_form = JSON.parse(JSON.stringify(params));
      this.edit_form = JSON.parse(JSON.stringify(params));
      this.getAgent(params.media_id);
    },
    mediaChange(media_id) {
      this.getAgent(media_id);
    },
    download() {
      const baseUrl = process.env.BASE_API;
      let url = `${baseUrl}/api/media/account/download?name=${this.listQuery.name}&account=${this.listQuery.account}&media_id=${this.listQuery.media_id}&proj_id=${this.listQuery.proj_id}&token=${this.token}`;
      window.open(url);
    },
    // 请求代理
    getAgent(media_id) {
      if (media_id) {
        const params = { media_id };
        getAgent(params).then((data) => {
          if (data.error_code === 0) {
            this.agentAddList = data.data;
          }
        });
      } else {
        getAgent().then((data) => {
          if (data.error_code === 0) {
            this.agentList = data.data;
          }
        });
      }
    },
    // 请求媒体
    getMediaList() {
      getMediaList().then((data) => {
        if (data.error_code === 0) {
          this.mediaList = data.data;
          this.mediaOptions = data.data;
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
    // 请求账号
    getAccount() {
      getMediaMasterList().then((data) => {
        if (data.error_code === 0) {
          this.accountList = data.data;
        }
      });
    },
    // 请求数据
    getList() {
      const { pagination, listQuery } = this;
      const params = {
        ...pagination,
        ...listQuery,
      };
      this.listLoading = true;
      getAccountList(params)
        .then((data) => {
          if (data.error_code === 0) {
            this.total = data.meta.total;
            this.list = data.data;
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
    // 新增收入源
    open() {
      this.dialogFormVisible_add = true;
      if (this.$refs.myform) {
        this.$refs.myform.resetFields();
      }
      this.add_form = {
        is_cashback: 2,
        account: "",
        pass: "",
        media_id: "",
        agency_core_id: "",
        rebates: "",
        proj_id: "",
        agency_opti_id: "",
        charge: "",
        start_at: "",
        use_growth_staff: 0,
      };
      this.title = "创建账号";
    },
    addclick(form) {
      this.$refs.myform.validate((valid) => {
        if (valid) {
          if (form.id) {
            // 编辑
            if (this.edit_form.is_cashback === form.is_cashback) {
              this.editAccount();
            } else {
              this.$confirm("请确认该账户为框返账户，此后不可改变", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  this.editAccount();
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "已取消",
                  });
                });
            }
          } else {
            // 新增
            if (this.add_form.is_cashback === 1) {
              this.$confirm("请确认该账户为框返账户，此后不可改变", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(() => {
                  this.addAccount();
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "已取消",
                  });
                });
            } else {
              this.addAccount();
            }
          }
        }
      });
    },
    editAccount() {
      editAccount(this.add_form).then((data) => {
        if (data.error_code === 0) {
          this.$message.success(
            data.error_message ? data.error_message : "保存成功"
          );
          this.dialogFormVisible_add = false;
          this.getList();
        } else {
          this.$message.error(
            data.error_message ? data.error_message : "保存失败"
          );
        }
      });
    },
    addAccount() {
      addAccount(this.add_form).then((data) => {
        if (data.error_code === 0) {
          this.$message.success(
            data.error_message ? data.error_message : "保存成功"
          );
          this.dialogFormVisible_add = false;
          this.getList();
        } else {
          this.$message.error(
            data.error_message ? data.error_message : "保存失败"
          );
        }
      });
    },
    // 分页- pageSize
    handleSizeChange(val) {
      const { pagination } = this;
      pagination.pageSize = val;
      pagination.page = 1;
      this.getList();
    },
    // 分页- page
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.getList();
    },
    checkboxchange(value) {},
  },
};
</script>
<style>
.el-dialog {
  width: 650px;
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
  margin-left: 6px;
}
.select-item {
  width: 150px;
  margin: 10px 20px 0px 0px;
}
.input-item {
  width: 150px;
}
</style>
