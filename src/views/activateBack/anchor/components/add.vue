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
          label="锚点中文名称:"
          prop="anchor_name"
        >
          <el-input :disabled="title == '编辑'" v-model="addForm.anchor_name" placeholder="请输入锚点中文名称" class="form_input" />
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="锚点值:"
          prop="anchor_val"
        >
           <el-input :disabled="title == '编辑'" v-model="addForm.anchor_val" placeholder="请输入锚点值" class="form_input" />
        </el-form-item>
        
        <el-form-item
          :label-width="formLabelWidth"
          label="状态:"
          prop="status"
        >
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
import { getMediaMasterList, getMediaChildList } from "@/api/dynamic/public";

export default {
  props: {
    dialogFormVisible:{
      type:Boolean,
      default:false,
    },
    initData:{
      type:Object,
      default: () => {}
    },
    title: {
      type: String,
      default: () => "未知",
    },
    initData: {
      type: Object,
      default: () => {},
    },
  },
  computed:{
    visible:{
      get() {
        return this.dialogFormVisible
      },
      set(val){
        this.$emit('updateAddvisible',val)
      }
    }
  },
  watch: {
    dialogFormVisible(newValue,oldValue){
      this.addForm={
        anchor_name: '',
        anchor_val: '',
        status: ''
      }
      if(this.$refs.form){
        this.$refs.form.resetFields()
      }
      if(newValue && JSON.stringify(this.initData) !== '{}') {
        const {anchor_name, anchor_val, status} = this.initData
        this.inputStatus = true
        this.addForm = {
          anchor_name,
          anchor_val,
          status
        }
      }
    }
  },
  data() {
    return {
      formLabelWidth: "150px",
      masterList: [],
      mediaChild: [],
      inputStatus: false,
      addForm: {
        anchor_name: "",
        anchor_val: "",
        status: ''
      },
      rules: {
        anchor_name: [{ required: true, message: "锚点中文名称不能为空", trigger: "blur" }],
        anchor_val: [
          { required: true, message: "锚点值不能为空", trigger: "blur" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
    };
  },
  created() {},
  methods: {
    // 选择关联主账号 -- 获取子账户信息
    addclick(val) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.title == "新增") {
            this.$emit("getAnchorAdd", val);
          } else {
            this.$emit("getAnchorEdit",val)
          }
        }
      });
    },
    handleCancel() {
      this.$emit("updateAddvisible", false);
    },
  },
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
.tips{
  margin-left: 150px;
}
.tips p{
  margin: 0;
}
</style>
