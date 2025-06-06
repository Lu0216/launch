<template>
  <!-- Form -->
  <div class="eldialog">
    <el-dialog :visible.sync="visible" :title="dialogType === 'import' ? '批量新增' : '批量更新'">
      <el-form ref="form" :rules="rules" :model="importForm">
        <el-form-item :label-width="formLabelWidth" label="项目:" prop="proj_id">
          <el-select filterable placeholder="请选择" v-model="importForm.proj_id" @change="handleProject">
            <el-option
              v-for="item in projectsList"
              :key="item.id"
              :label="item.app_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item :label-width="formLabelWidth" label="关联主账号:" prop="media_account_id">
          <el-select filterable placeholder="请选择" v-model="importForm.media_account_id" @change="handleMaster">
            <el-option
              v-for="item in masterList"
              :key="item.id"
              :label="item.account"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item :label-width="formLabelWidth" label="关联子账号:" prop="media_account_child_id">
          <el-select filterable placeholder="请选择" v-model="importForm.media_account_child_id">
            <el-option
              v-for="item in mediaChild"
              :key="item.media_account_child_id"
              :label="item.media_account_child_id"
              :value="item.media_account_child_id">
            </el-option>
          </el-select>
        </el-form-item>
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

import { getMediaMasterList, getMediaChildList } from '@/api/dynamic/public'

export default {
  props: {
    dialogType:{
      type:String,
      default:'add',
    },
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
      formLabelWidth: '150px',
      masterList:[],
      mediaChild:[],
      fileList:[],
      importForm:{
        proj_id: '',
        media_account_id: '',
        media_account_child_id: '',
        file: ''
      },
      rules: {
        proj_id: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        media_account_id: [
          { required: true, message: '请选择关联主账号', trigger: 'change' }
        ],
        media_account_child_id: [
          { required: true, message: '请选择关联子账号', trigger: 'change' }
        ],
        // file: [
        //   { required: true, message: '请上传渠道包号' },
        // ],
      },
    }
  },
  mounted () {
    //
  },
  methods: {
    handleProject(e){
       this.importForm.media_account_id = '';
       this.importForm.media_account_child_id = '';
      getMediaMasterList({'proj_id':e}).then((data) => {
        if (data.error_code === 0) {
          this.masterList = data.data
        }else{
          this.masterList = []
        }
      }).catch(() => {
        this.masterList = []
        this.$message({
          message: '加载账号失败',
          type: 'error'
        })
      })
     },
    handleMaster(e){
      this.importForm.media_account_child_id = '';
      getMediaChildList({'account_id':e}).then((data) => {
        if (data.error_code === 0) {
          this.mediaChild = data.data
        }else{
          this.mediaChild = []
        }
      }).catch(() => {
        this.mediaChild = []
        this.$message({
          message: '加载账号失败',
          type: 'error'
        })
      })
    },
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
              message: '请上传渠道包号！',
              type: 'error'
            })
            return;
          }

          const formData = new FormData();
          formData.append('proj_id',val.proj_id)
          formData.append('media_account_id',val.media_account_id)
          formData.append('media_account_child_id',val.media_account_child_id)
          formData.append('file',fileList[0].raw)
          this.$emit('batchChannel', formData)
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
