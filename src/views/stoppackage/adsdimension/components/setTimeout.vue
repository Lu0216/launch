<template>
  <div>
    <el-dialog :visible="budgetvisible" :before-close="handleClose">
      <el-form ref="form" :model="form" label-width="180px">
        <el-form-item label="预算定时任务（次日0点生效）">
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
    timebtnloading: {
      type: Boolean,
      default: () => false,
    },
    initdata: {
      type: Object,
      default: () => {},
    },
  },
  created() {
      if(JSON.stringify(this.initdata) !== '{}') {
          this.form.media_id=this.initdata.media_id
          this.form.campaign_id=this.initdata.campaign_id
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
        .then((_) => {
          this.onchange()
        })
        .catch((_) => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
  },
};
</script>
