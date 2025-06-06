<template>
  <!-- Form -->
  <div class="eldialog">
    <el-dialog :visible.sync="visible" title="批量新增">
      <el-form ref="form">
        <el-form-item :label-width="formLabelWidth" label="渠道包号:" prop="file">
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
               <el-button slot="trigger" type="primary" v-if="fileList.length < 1">上传渠道包号</el-button>
               <div class="el-button el-button--primary el-button--medium is-disabled" @click.stop v-else><span>上传渠道包号</span></div>
              </el-upload>
              <span style="line-height:14px;display:inline-block;margin-top:20px;">（上传文件表头字段：渠道号，概率，转化回传概率；上传数据内容格式示例：bz00078，80，90
              <p>注：80，代表80%的激活回传概率；90代表90%的转化回传概率）</p></span>
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
        this.$emit('updateImportvisible',val)
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
          message: '请上传渠道包号！',
          type: 'error'
        })
        return;
      }
      const formData = new FormData();
      formData.append('file',this.fileList[0].raw)
      this.$emit('batchScreen', formData)
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
  width:340px
}
.surebox{
  font-size: 24px;
  margin: 10px 0px;
}
</style>
