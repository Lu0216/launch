<template>
  <div>
    <el-dialog :visible="bidvisible" :title='title' :before-close="handleClose" width="350px">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="修改出价">
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
      bidvisible: true,
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
    bidbtnloading: {
      type: Boolean,
      default: () => false,
    },
    bidData: {
      type: Object,
      default: () => {},
    },
  },
  created() {
      if(JSON.stringify(this.bidData) !== '{}') {
        this.form.unit_id=this.bidData.unit_id
        this.form.price = this.bidData.bid_amount
      }
      this.loading = this.bidbtnloading
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
