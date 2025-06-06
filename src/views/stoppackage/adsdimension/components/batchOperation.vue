<template>
  <div>
    <el-dialog
      :visible="batchvisible"
      :title="title"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" :rules="rule" label-width="100px">
        <el-form-item label="项目" prop="proj_id">
          <el-select
            placeholder="请选择项目"
            @change="projChange(form.proj_id)"
            v-model="form.proj_id"
          >
            <el-option
              v-for="item in batchData"
              :key="item.id"
              :label="item.app_name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态选择:" prop="status">
          <div>
            <el-radio-group v-model="form.status">
              <el-radio :label="2">停投</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item label="渠道号" prop="src">
            <div class="uploadDiv">
              <el-upload
                action=""
                accept=".xls,.xlsx"
                :limit="1"
                :on-change="changeFile"
                :on-remove="handleRemove"
                :file-list="fileList"
                :auto-upload="false"
                :disabled="form.src !== ''"
              >
               <el-button slot="trigger" type="primary" v-if="fileList.length < 1">上传渠道包号</el-button>
               <div class="el-button el-button--primary el-button--medium is-disabled" @click.stop v-else><span>上传渠道包号</span></div>
              </el-upload>
           </div>
          <el-input
            v-model="form.src"
            placeholder="请输入渠道号，多个渠道号以英文,逗号隔开"
            @blur="changeSrc"
            :disabled="fileList.length>0"
          ></el-input>
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
  name: "BatchOperation",
  components: {},
  data() {
    return {
      batchvisible: true,
      form: {
        proj_id: "",
        status: "",
        file: '',
        src: "",
      },
      accountList: [],
      fileList:[],
      rule: {
        proj_id: [{ required: true, message: "请选择项目", trigger: "change" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        // src: [{ required: true, message: "请选择渠道号", trigger: "blur" }],
        // file: [{ required: true, message: "请上传文件", trigger: "change" }],
      },
    };
  },
  props: {
    title: {
      type: String,
      default: () => "未知",
    },
    batchbtnloading: {
      type: Boolean,
      default: () => false,
    },
    batchData: {
      type: Array,
      default: () => {},
    },
  },
  created() {
    // if (JSON.stringify(this.batchData) !== "{}") {
    // }
  },
  methods: {
    
    onchange() {
      this.$emit("close", false);
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          this.onchange();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 选择项目
    projChange(id) {
      this.batchData.map((item) => {
        if (item.id == id) {
          this.form.proj_id = item.id;
        }
      });
    },
    // 填写渠道号
    changeSrc(e) {
      if (e.target.value != "") {
        this.form.src = e.target.value;
      }
    },
    // 删除已上传
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    changeFile(file,fileList){
      this.fileList = fileList;
    },
    // 提交
    onSubmit() {
      let params = this.form;
      const fileList = this.fileList;
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(fileList.length === 0 && params.src == ""){
            this.$message({
              message: '请上传渠道包号！',
              type: 'error'
            })
            return;
          }
          const formData = new FormData();
          formData.append('proj_id',params.proj_id)
          formData.append('status',params.status)
          if(fileList.length == 0) {
            formData.append('src',params.src)
          }else {
            formData.append('file',fileList[0].raw)
          }
          this.$emit('ok', formData)
        }
      })
    },
  },
};
</script>
<style scoped>
.uploadDiv{
  width:200px;
  margin-bottom:10px;
}
</style>
