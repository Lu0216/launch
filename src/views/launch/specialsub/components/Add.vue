<template>
  <!-- Form -->
  <div class="eldialog">
    <el-dialog :visible.sync="visible" title="添加">
      <el-form ref="form" :rules="rules" :model="addForm">
        <el-form-item :label-width="formLabelWidth" label="项目:" prop="proj_id">
          <el-select filterable  placeholder="请选择" v-model="addForm.proj_id" @change="handleProject">
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.app_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item :label-width="formLabelWidth" label="关联主账号:" prop="media_account_id">
          <el-select filterable  placeholder="请选择" v-model="addForm.media_account_id" @change="handleMaster">
            <el-option
              v-for="item in masterList"
              :key="item.id"
              :label="item.account"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item :label-width="formLabelWidth" label="关联子账号:" prop="media_account_child">
          <el-select filterable  placeholder="请选择" v-model="addForm.media_account_child">
            <el-option
              v-for="item in mediaChild"
              :key="item.media_account_child_id"
              :label="item.media_account_child_id"
              :value="item.media_account_child_id">
            </el-option>
          </el-select>
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

import { getMediaMasterList, getMediaChildList } from '@/api/dynamic/public'

export default {
  props: {
    dialogFormVisible:{
      type:Boolean,
      default:false,
    },
    projectList: {
      type:Array,
      default: () => []
    }
  },
  computed:{
    visible:{
      get() {
        return this.dialogFormVisible
      },
      set(val){
        this.$emit('updateAddvisible',val)
      } 
    }
  },
  watch: {
    dialogFormVisible(newValue,oldValue){
      this.addForm={
        proj_id: '',
        media_account_id: '',
        media_account_child: ''
      }
      if(this.$refs.form){
        this.$refs.form.resetFields()
      }
    }
  },
  data () {
    return {
      formLabelWidth: '150px',
      masterList:[],
      mediaChild:[],
      addForm:{
        proj_id: '',
        media_account_id: '',
        media_account_child: '',
      },
      rules: {
        proj_id: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        media_account_id: [
          { required: true, message: '请选择关联主账号', trigger: 'change' }
        ],
        media_account_child: [
          { required: true, message: '请选择关联子账号', trigger: 'change' }
        ],
      },
    }
  },
  created () {
   
  },
  methods: {
    //   选择项目
     handleProject(e){
       this.addForm.media_account_id = '';
       this.addForm.media_account_child = '';
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
    //  关联主账号
     handleMaster(e){
      this.addForm.media_account_child = '';
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
    addclick(val) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('addSub', val)
        }
      })
    },
    // 关闭
    handleCancel(){
      this.$emit('updateAddvisible',false)
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
.form_input{
  width:200px
}
</style>
