<template>
  <div>
    <el-dialog :visible="budgetvisible" :title='title' :before-close="handleClose" width="400px">
      <el-form ref="form" :model="form" label-width="150px">
        <el-form-item label="修改深度转化出价">
          <el-input-number v-model="form.price" :controls="false" :precision="2" @focus="changefocus"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit" :loading="loading">保存</el-button>
        <el-button @click="onchange">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "EditBid",
  components: {},
  data() {
    return {
      budgetvisible: true,
      form: {
        price: "",
        unit_id:'',
      },
      loading:false,
    };
  },
  props: {
    title: {
      type: String,
      default: () => "未知",
    },
    depthbidbtnloading: {
      type: Boolean,
      default: () => false,
    },
    depthbidData: {
      type: Object,
      default: () => {},
    },
  },
  created() {
      if(JSON.stringify(this.depthbidData) !== '{}') {
        this.form.unit_id=this.depthbidData.unit_id
        this.form.price = this.depthbidData.dep_bid_amount
      }
      this.loading = this.depthbidbtnloading
  },
  methods: {
    onSubmit() {
      let params = this.form;
      this.loading = true;
      this.$emit('ok', params)
    },
    onchange() {
      this.$emit("close", false);
    },
    changefocus() {
      this.loading = false;
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
