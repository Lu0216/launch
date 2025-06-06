<template>
  <div>
    <el-dialog :visible="budgetvisible" :title='title' :before-close="handleClose" width="400px">
      <el-form ref="form" :model="form" label-width="180px">
        <el-form-item label="修改预算（实时生效）">
          <el-input v-model="form.budget"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="onchange">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "EditBudget",
  components: {},
  data() {
    return {
      budgetvisible: true,
      form: {
        budget: "",
        media_id:'',
        campaign_id:''
      },
    };
  },
  props: {
    title: {
      type: String,
      default: () => "未知",
    },
    editbtnloading: {
      type: Boolean,
      default: () => false,
    },
    editData: {
      type: Object,
      default: () => {},
    },
  },
  created() {
      if(JSON.stringify(this.editData) !== '{}') {
          this.form.media_id=this.editData.media_id
          this.form.campaign_id=this.editData.campaign_id
      }
  },
  methods: {
    onSubmit() {
    let params = this.form;
      this.$emit('ok', params)
    },
    onchange() {
      this.$emit("close", false);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          this.onchange()
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
  },
};
</script>
