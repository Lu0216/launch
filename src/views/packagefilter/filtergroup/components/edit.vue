<template>
  <!-- Form -->
  <div class="eldialog">
    <el-dialog :visible.sync="visible" title="编辑">
      <el-form ref="form" :rules="rules" :model="importForm">
        
        <el-form-item :label-width="formLabelWidth" label="项目:" prop="proj">
            <el-input disabled v-model="initData.proj" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="媒体:" prop="media">
            <el-input disabled v-model="initData.media" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="渠道:" prop="src">
            <el-input disabled v-model="initData.src" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="是否为关键行为:" prop="is_tags">
          <el-radio-group v-model="importForm.is_tags" disabled>
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
    dialogType:{
      type:String,
      default:'add',
    },
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    initData:{
      type:Object,
      default: () => {}
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
        this.$emit('updateEditvisible',val)
      } 
    }
  },
  data () {
    return {
      formLabelWidth: '150px',
      packagefilterList:[],
      importForm:{
        is_tags: '',
        package_filter_id: ''
      },
      rules: {
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
    if(JSON.stringify(this.initData) !== '{}'){
        const { proj_id, media_id, is_tags, package_filter_id } = this.initData
        this.handleProject(proj_id)
        this.importForm = {
            is_tags,
            package_filter_id
        }
      }
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
    addclick(val) {
      const fileList = this.fileList;
      this.$refs.form.validate((valid) => {
        if (valid) {
          val.id = this.initData.id
          this.$emit('groupEdit', val)
        }
      })
    },
    handleCancel(){
      this.$emit('updateEditvisible',false)
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
