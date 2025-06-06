<template>
  <div>
    <el-dialog
      :visible="addvisible"
      :title="title"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" :rules="rule" label-width="150px">
        <el-form-item label="项目：" prop="proj_id">
          <el-select
            placeholder="请选择项目"
            @change="projChange(form.proj_id)"
            v-model="form.proj_id"
          >
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.app_name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="导入实时筛包规则：" prop="file">
            <div class="uploadDiv">
              <el-upload
                action=""
                accept=".xls,.xlsx"
                :limit="1"
                :on-change="changeFile"
                :on-remove="handleRemove"
                :file-list="fileList"
                :auto-upload="false"
              >
               <el-button slot="trigger" type="primary" v-if="fileList.length < 1">+</el-button>
               <div class="el-button el-button--primary el-button--medium is-disabled" @click.stop v-else><span>+</span></div>
               <div v-if="isShow" style="color:red">不能为空</div>
              </el-upload>
           </div>
        </el-form-item>

        
        <!-- <el-form-item label="导入实时筛包规则：" prop="file">
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
               <el-button slot="trigger" type="primary" >上传渠道包号</el-button>
               <div class="el-button el-button--primary el-button--medium is-disabled" @click.stop ><span>上传渠道包号</span></div>
              </el-upload>
           </div>
          
        </el-form-item> -->
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
  name: "Add",
  components: {},
  data() {
    return {
      addvisible: true,
      isShow:false,
      form: {
        proj_id: "",
        file: '',
        src:''
      },
      accountList: [],
      fileList:[],
      rule: {
        proj_id: [{ required: true, message: "请选择项目", trigger: "change" }],
        // status: [{ required: true, message: "请选择状态", trigger: "change" }],
        // src: [{ required: true, message: "请选择渠道号", trigger: "blur" }],
        // file: [{ required: true, message: "不能为空", trigger: "blur" }],
      },
    };
  },
  props: {
    title: {
      type: String,
      default: () => "未知",
    },
    addloading: {
      type: Boolean,
      default: () => false,
    },
    projectList: {
      type: Array,
      default: () => {},
    },
    
  },
  created() {},
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
      this.projectList.map((item) => {
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
          if(fileList.length === 0){
            this.$message({
              message: '请上传实时筛包规则',
              type: 'error'
            })
            this.isShow = true;
            return;
          }
          this.isShow = false;
          const formData = new FormData();
          formData.append('proj_id',params.proj_id)
          formData.append('file',fileList[0].raw)
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
