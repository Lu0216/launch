<template>
  <!-- Form -->
  <div class="eldialog">
    <el-dialog :visible.sync="visible" title="批量删除">
      <el-form ref="form">
        <el-form-item :label-width="formLabelWidth" label="上传计划id:" prop="file">
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
               <el-button slot="trigger" type="primary">上传文件</el-button>
               <!-- <div class="el-button el-button--primary el-button--medium is-disabled" @click.stop v-else><span>上传渠道包号</span></div> -->
              </el-upload>
              （上传表中仅需填写计划id）
           </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="addclick()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

export default {
    name:'BatchDelete',
  props: {
    dialogFormVisible: {
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
        this.$emit('updateImportDeletevisible',val)
      } 
    }
  },
  watch: {
    dialogFormVisible(newValue,oldValue){
      this.fileList = []
      if(this.$refs.form){
        this.$refs.form.resetFields()
      }
      
    }
  },
  data () {
    return {
      formLabelWidth: '150px',
      fileList:[]
    }
  },
  mounted () {
    //
  },
  methods: {
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    changeFile(file,fileList){
      this.fileList = fileList;
    },
    addclick() {
      if(this.fileList.length === 0){
        this.$message({
          message: '未上传计划id！',
          type: 'error'
        })
        return;
      }
      const formData = new FormData();
      formData.append('file',this.fileList[0].raw)
      this.$emit('deletePlans', formData)
    },
    handleCancel(){
      this.$emit('updateImportDeletevisible',false)
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
.surebox{
  font-size: 24px;
  margin: 10px 0px;
}
</style>
