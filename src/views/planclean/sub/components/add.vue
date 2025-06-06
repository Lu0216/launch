<template>
  <!-- Form -->
  <div class="eldialog">
    <el-dialog
      :visible.sync="visible"
      title="添加子账号"
      :before-close="handleCancel"
      width="600px"
      v-if="dialogType == 1"
    >
      <el-form ref="form1" :rules="rules1" :model="addForm1">
        <el-form-item
          :label-width="formLabelWidth"
          label="子账号id:"
          prop="media_account_child_id"
        >
          <el-input placeholder="请输入账号名" v-model="addForm1.media_account_child_id" class="form_input" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="媒体:" prop="media_id">
          <el-select 
            filterable 
            placeholder="请选择" 
            v-model="addForm1.media_id" 
            style="width:280px;"
            >
            <el-option
              v-for="item in mediaList"
              :key="item.id"
              :label="item.name_cn"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" :loading="addloading" @click="addclick(addForm1)">确 定</el-button>
      </div>
    </el-dialog>
     <el-dialog
      :visible.sync="visible"
      title="添加子账号"
      :before-close="handleCancel"
      width="600px"
      v-else
    >
      <el-form ref="form2" :rules="rules2" :model="addForm2">
        <el-form-item
          :label-width="formLabelWidth"
          label="子账号id:"
          prop="file"
        >
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
               <el-button slot="trigger" type="primary" v-if="fileList.length < 1">上传文件</el-button>
              </el-upload>
           </div>
           <a style="color:blue;" @click="handleDownload">查看上传文件格式</a>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="媒体:" prop="media_id">
          <el-select 
            filterable 
            placeholder="请选择" 
            v-model="addForm2.media_id" 
            style="width:280px;"
            >
            <el-option
              v-for="item in mediaList"
              :key="item.id"
              :label="item.name_cn"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" :loading="addloading" @click="addclick(addForm2)">确 定</el-button>
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
    addloading:{
      type: Boolean,
      default: false
    },
    dialogType: {
      type: Number,
      default: 1
    },
    mediaList:{
      type:Array,
      default: () => []
    },
  },
  computed:{
    visible:{
      get() {
        return this.dialogFormVisible
      },
      set(val){
        this.$emit('close',val)
      } 
    }
  },
  data() {
    return {
      // dialogFormVisible: true,
      formLabelWidth: "120px",
      addForm1: {
        media_account_child_id: '',
        media_id: ''
      },
       addForm2: {
        file: '',
        media_id: ''
      },
      fileList:[],
      rules1: {
        media_account_child_id: [{ required: true, message: "请输入账号名", trigger: "change" }],
        media_id: [
          { required: true, message: '请选择媒体', trigger: 'change' }
        ],
      },
      rules2: {
        file: [{ required: true, message: "请上传账号名", trigger: "blur" }],
        media_id: [
          { required: true, message: '请选择媒体', trigger: 'change' }
        ],
      },
    };
  },
  methods: {
    addclick(val) {
      if(this.dialogType == 2) {
         if(this.fileList.length === 0){
          this.$message({
            message: '未上传子账号id',
            type: 'error'
          })
          return;
        }
        
        this.$refs.form2.validate((valid) => {
          if(valid) {
            const formData = new FormData();
            formData.append('file',this.fileList[0].raw)
            formData.append('media_id',val.media_id)
            this.$emit("saveAdd", formData);
          }
        })
      } else {
        this.$refs.form1.validate((valid) => { 
        if(valid) {
          this.$emit("saveAdd", val);
        }
      })
      }
      
    },
    // 下载
    handleDownload() {
      import('@/vendor/Export2Excel').then(excel => {
        const data = [['123']]
        excel.export_json_to_excel({
          header: ['子账号id'],
          data,
          filename: '子账号id'
        })
      })
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    changeFile(file,fileList){
      this.addForm2.file = fileList
      this.fileList = fileList;
    },
    handleCancel() {
      this.$emit("close", false);
      if(this.dialogType == 1) {
        this.$refs.form1.resetFields();
      } else{
        this.fileList = []
        this.$refs.form2.resetFields();
      }
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
  width: 280px;
}
.uploadDiv{
  width:340px
}
</style>
