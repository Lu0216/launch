<template>
  <!-- Form -->
  <div class="eldialog">
    <el-dialog :visible.sync="visible" title="批量操作">
      <el-form ref="form" :rules="rules" :model="importForm">
        
        <el-form-item :label-width="formLabelWidth" label="项目:" prop="proj_id">
          <el-select filterable placeholder="请选择" v-model="importForm.proj_id">
            <el-option
              v-for="item in projectsList"
              :key="item.id"
              :label="item.app_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="策略名称:" prop="package_filter_name">
            <el-input v-model="importForm.package_filter_name" style="width:200px" />
        </el-form-item>
         <el-form-item :label-width="formLabelWidth" label="批量导入筛包策略:" prop="file">
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
               <el-button slot="trigger" type="primary" v-if="fileList.length < 1">上传</el-button>
               <div class="el-button el-button--primary el-button--medium is-disabled" @click.stop v-else><span>上传</span></div>
              </el-upload>
           </div>
         
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" :loading="btnloading" @click="addclick(importForm)">确 定</el-button>
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
    projectsList: {
      type:Array,
      default: () => []
    },
    btnloading:{
      type: Boolean,
      default: false
    }
  },
  computed:{
    visible:{
      get() {
        return this.dialogFormVisible
      },
      set(val){
        this.$emit('updateImportvisible',val)
      } 
    }
  },
  watch: {
    dialogFormVisible(newValue,oldValue){
      if(this.$refs.form){
        this.$refs.form.resetFields()
      }
      this.fileList = []
    }
  },
  data () {
    return {
      formLabelWidth: '200px',
      fileList:[],
      importForm:{
        proj_id: '',
        package_filter_name: '',
        file: ''
      },
      rules: {
        package_filter_name: [
          { required: true, message: '请填写策略名称', trigger: 'change' },
        ],
        proj_id: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ]
      },
    }
  },
  mounted () {

  },
  methods: {
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    changeFile(file,fileList){
      this.fileList = fileList;
    },
    addclick(val) {
      const fileList = this.fileList;
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(fileList.length === 0){
            this.$message({
              message: '请上传筛包策略！',
              type: 'error'
            })
            return;
          }

          const formData = new FormData();
          formData.append('proj_id',val.proj_id)
          formData.append('package_filter_name',val.package_filter_name)
          formData.append('file',fileList[0].raw)

          this.$emit('batchConfig', formData)
        }
      })
    },
    handleCancel(){
      this.$emit('updateImportvisible',false)
    }
  }
}
</script>
<style scoped>
.eldialog{
  width: 100%;
  align-items: center;
  background: #fff;
  padding: 10px;
}
.uploadDiv{
  width:200px
}
</style>
