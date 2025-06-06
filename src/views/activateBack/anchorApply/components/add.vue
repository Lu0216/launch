<template>
  <!-- Form -->
  <div class="eldialog">
    <el-dialog
      :visible.sync="dialogFormVisible"
      :title="title"
      :before-close="handleCancel"
    >
      <el-form ref="form" :rules="rules" :model="addForm">
        <el-form-item
          :label-width="formLabelWidth"
          label="项目:"
          prop="proj_id"
        >
          <el-select
            filterable
            placeholder="请选择"
            v-model="addForm.proj_id"
            :disabled="this.title == '编辑'"
          >
            <el-option
              v-for="item in projectsList"
              :key="item.id"
              :label="item.app_name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="锚点中文名称:"
          prop="anchor_name"
        >
          <el-select
            filterable
            placeholder="请选择"
            v-model="addForm.anchor_name"
            :disabled="this.title == '编辑'"
            @change="changeAchor"
            multiple
          >
            <el-option
              v-for="item in anchorList"
              :key="item.id"
              :label="item.anchor_name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="状态:" prop="status">
          <div>
            <el-radio-group v-model="addForm.status" >
              <el-radio :label="0">关闭</el-radio>
              <el-radio :label="1">开启</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="addclick(addForm)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getActBackList } from "@/api/activateBack";
export default {
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    initData: {
      type: Object,
      default: () => {}
    },
    projectsList: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: () => "未知"
    },
    initData: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    visible: {
      get() {
        return this.dialogFormVisible;
      },
      set(val) {
        this.$emit("updateAddvisible", val);
      }
    }
  },
  watch: {
    dialogFormVisible(newValue, oldValue) {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
      this.addForm = {
        proj_id: "",
        anchor_name: "",
        status: 1
      };
      if (newValue && JSON.stringify(this.initData) !== "{}") {
        const { status } = this.initData;
        const { anchor_name } = this.initData.anchor;
        this.addForm = {
          proj_id: this.initData.proj_id,
          anchor_name: Array.isArray(anchor_name) ? anchor_name : [anchor_name],
          status
        };
      }
    }
  },
  data() {
    return {
      formLabelWidth: "150px",
      anchorList: [],
      anchorId: "",
      addForm: {
        proj_id: "",
        anchor_name: "",
        status: 1
      },
      rules: {
        proj_id: [{ required: true, message: "请选择项目", trigger: "blur" }],
        anchor_name: [
          { required: true, message: "请选择锚点中文名称", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }]
      }
    };
  },
  created() {
    this.getActBackList();
  },
  methods: {
    // 选择关联主账号 -- 获取子账户信息
    addclick(val) {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { status, proj_id } = val;
          if (this.title == "新增") {
            const params = {
              status,
              proj_id,
              anchor_id: this.anchorId.join(",")
            };
            this.$emit("getProjAnchorAddBatch", params);
          } else {
            const params = {
              status,
              proj_id
            };
            this.$emit("getProjAnchorEdit", params);
          }
        }
      });
    },
    getActBackList(e) {
      getActBackList()
        .then(data => {
          if (data.error_code === 0) {
            this.anchorList = data.data;
          }
        })
        .catch(() => {
          this.$message({
            message: "加载失败",
            type: "error"
          });
        });
    },
    changeAchor(e) {
      this.anchorId = e;
    },
    handleCancel() {
      this.$emit("updateAddvisible", false);
    }
  }
};
</script>
<style scoped>
::v-deep .el-dialog {
  width: 650px;
}
.eldialog {
  width: 100%;
  align-items: center;
  background: #fff;
  padding: 10px;
}
.form_input {
  width: 200px;
}
.tips {
  margin-left: 150px;
}
.tips p {
  margin: 0;
}
</style>
