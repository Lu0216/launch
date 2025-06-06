<template>
  <!-- Form -->
  <div class="eldialog">
    <el-dialog
      :visible="dialogFormVisible"
      :title="this.title"
      :before-close="handleCancel"
    >
      <el-form ref="form" :rules="rules" :model="addForm">
        <el-form-item
          :label-width="formLabelWidth"
          label="激活回传锚点:"
          prop="symbol"
        >
          <el-form-item prop="symbol" style="width:140px;display:inline-block;">
            <el-select
              filterable
              placeholder="请选择运算符"
              v-model="addForm.symbol"
              style="width:140px;"
            >
              <el-option
                key="1"
                :label="`>=`"
                :value="1"
              >
              </el-option>
              <el-option
                key="2"
                :label="`=`"
                :value="2"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="anchor_id" style="width:180px;display:inline-block;">
            <el-select
              filterable
              placeholder="请选择"
              v-model="addForm.anchor_id"
              style="width:180px;"
            >
              <el-option
                v-for="item in anchorList"
                :key="item.anchor_id"
                :label="item.anchor.anchor_name"
                :value="item.anchor_id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="概率:" prop="ratio">
          <el-input-number
            v-model="addForm.ratio"
            :min="0"
            :max="100"
            @change="changeNumber"
          ></el-input-number
          >%
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
import { getAnchorByProj } from '@/api/anchor'
export default {
  props: {
    // dialogFormVisible:{
    //   type:Boolean,
    //   default:false,
    // },
    projectsList: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: () => "未知",
    },
    initData: {
      type: Array,
      default: () => {},
    },
  },
  // computed:{
  //   visible:{
  //     get() {
  //       return this.dialogFormVisible
  //     },
  //     set(val){
  //       this.$emit('updateAddvisible',val)
  //     }
  //   }
  // },
  // watch: {
  //   dialogFormVisible(newValue,oldValue){
  //     this.addForm={
  //       proj_id: '',
  //       media_account_id: '',
  //       media_account_child: '',
  //       ratio:100,
  //     }
  //     if(this.$refs.form){
  //       this.$refs.form.resetFields()
  //     }
  //   }
  // },
  data() {
    return {
      dialogFormVisible: true,
      formLabelWidth: "150px",
      anchorList:[],
      addForm: {
        proj_id: "",
        media_account_id: "",
        media_account_child: "",
        ratio: 100,
        symbol:''
      },
      pageSize:100,
      rules: {
        ratio: [{ required: true, message: "请填写概率", trigger: "change" }],
        symbol: [{ required: true, message: "运算符不能为空", trigger: "change" }],
      },
    };
  },
  // created() {
  //   if (JSON.stringify(this.initData) !== "{}" && this.title == "编辑") {
  //     this.addForm.media_account_child = this.initData.media_account_child;
  //     this.addForm.proj_id = this.initData.proj;
  //     this.addForm.media_account_id = this.initData.media_account;
  //     this.addForm.ratio = this.initData.ratio;
  //   }
  // },
  mounted() {
    console.log('ffff',this.initData)
    this.addForm.proj_id = this.initData[0].proj_id
    this.getAnchorByProj()
  },
  methods: {
    getAnchorByProj() {
      // const order = {page:1,pageSize:this.pageSize,proj_id: this.addForm.proj_id}
      getAnchorByProj({proj_id: this.addForm.proj_id}).then((data) => {
            if(data.error_code ===0) {
              this.anchorList = data.data
              console.log(data,'achor');
            }
          }).catch(() => {
            this.$message({
                message: '加载失败',
                type: 'error'
            })
          })
    },
    changeNumber(val) {
      if (val == undefined) {
        return this.$message.error("概率不能为空");
      }
    },
    addclick(val) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit("editActivate",val)
        }
      });
    },
    handleCancel() {
      this.$emit("updateAddvisible", false);
      this.$refs.form.resetFields();
    },
  },
};
</script>
<style scoped>
.eldialog {
  width: 100%;
  align-items: center;
  background: #fff;
  padding: 10px;
}
.form_input {
  width: 200px;
}
</style>
