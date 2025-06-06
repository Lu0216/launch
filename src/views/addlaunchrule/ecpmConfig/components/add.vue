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
          prop="app_id"
        >
          <el-select
            filterable
            placeholder="请选择"
            v-model="addForm.app_id"
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
          label-width="150px" 
          label="MAX：" 
          prop="max_ecpm">
            <el-input v-model="addForm.max_ecpm" style="width:235px;" placeholder="请输入最大值" />
        </el-form-item>
        <el-form-item 
          label-width="150px" 
          label="MIN：" 
          prop="min_ecpm">
            <el-input v-model="addForm.min_ecpm" style="width:235px;" placeholder="请输入最小值" />
        </el-form-item>
        <el-form-item>
            <div class="tips">
              <p>备注：</p>
              <p>1、MAX,MIN至少填写一组</p>
              <p>2、MAX为大于输入值时直接回传</p>
              <p>3、MIN为小于输入值时不回传</p>
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
        app_id: "",
        max_ecpm: "",
        min_ecpm: "",
      };
      // 如果对话框打开（newValue为true）且有初始化数据
      if (newValue && JSON.stringify(this.initData) !== "{}") {
        this.addForm = {
          app_id: this.initData.app_id,
          max_ecpm: this.initData.max_ecpm || "", 
          min_ecpm: this.initData.min_ecpm || "" 
        }
      }
    }
  },
  data() {
    return {
      formLabelWidth: "150px",
      anchorList: [],
      anchorId: "",
      addForm: {
        app_id: "",
        max_ecpm: "",
        min_ecpm: "",
      },
      rules: {
        app_id: [{ required: true, message: "请选择项目", trigger: "blur" }],
      }
    };
  },
  created() {
    
  },
  methods: {
    // 选择关联主账号 -- 获取子账户信息
    addclick(val) {
      console.log('val',val)
      
      this.$refs.form.validate(valid => {
        if (valid) {
          const { app_id, max_ecpm, min_ecpm } = val
          if (this.title == "新增") {
            const params = {
              app_id,
              max_ecpm,
              min_ecpm
            }
            this.$emit("addCongig", params);
          } else {
            const params = {
              app_id,
              max_ecpm,
              min_ecpm,
              id: this.initData.id
            }
            this.$emit("editCongig", params);
          }
        }
      });
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
