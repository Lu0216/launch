<template>
  <!-- Form -->
  <div class="eldialog">
    <el-dialog :visible.sync="visible" title="新增">
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
        <el-form-item :label-width="formLabelWidth" label="媒体:" prop="media_id">
          <el-select filterable placeholder="请选择" v-model="importForm.media_id">
            <el-option
              v-for="item in mediaList"
              :key="item.id"
              :label="item.name_cn"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="是否为关键行为:" prop="is_tags">
          <el-radio-group v-model="importForm.is_tags">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="策略名称:" prop="package_filter_id">
          <el-select filterable placeholder="请选择" v-model="importForm.package_filter_id">
            <el-option
              v-for="item in packagefilterList"
              :key="item.id"
              :label="item.package_filter_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="渠道:" prop="src">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入渠道号，多个渠道号请用英文逗号隔开"
            v-model="importForm.src">
          </el-input>
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
               <el-button slot="trigger" type="primary" v-if="fileList.length < 1">批量导入渠道号</el-button>
               <div class="el-button el-button--primary el-button--medium is-disabled" @click.stop v-else><span>批量导入渠道号</span></div>
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

import { selectNameList } from '@/api/packagefilter'

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
    mediaList: {
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
  data () {
    return {
      formLabelWidth: '150px',
      packagefilterList:[],
      fileList:[],
      importForm:{
        proj_id: '',
        media_id: '',
        is_tags: '',
        package_filter_id: '',
        src:''
      },
      rules: {
        proj_id: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        media_id: [
          { required: true, message: '请选择媒体', trigger: 'change' }
        ],
        is_tags: [
          { required: true, message: '请选择是否关键行为', trigger: 'change' }
        ],
        package_filter_id: [
          { required: true, message: '请选择策略名称', trigger: 'change' }
        ]
      },
    }
  },
  created () {
    
  },
  methods: {
      handleProject(e){
       this.importForm.package_filter_id = '';
      selectNameList({'proj_id':e}).then((data) => {
        if (data.error_code === 0) {
          this.packagefilterList = data.data
        }else{
          this.packagefilterList = []
        }
      }).catch(() => {
        this.packagefilterList = []
        this.$message({
          message: '加载策略名称失败',
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
           if(fileList.length === 0 && !val.src){
            this.$message({
              message: '请填写或上传渠道！',
              type: 'error'
            })
            return;
          }
          const formData = new FormData();
          formData.append('proj_id',val.proj_id)
          formData.append('media_id',val.media_id)
          formData.append('is_tags',val.is_tags)
          formData.append('package_filter_id',val.package_filter_id)
          formData.append('src',val.src)
          if(fileList.length > 0){
            formData.append('file',fileList[0].raw)
          }
          this.$emit('groupAdd', formData)
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
  width:200px;
  margin-top:15px;
}
</style>
