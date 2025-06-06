<template>
  <!-- Form -->
  <div class="eldialog">
    <el-dialog :visible.sync="visible" :title="title">
      <el-form ref="form" :rules="rules" :model="addForm">
        
        <el-form-item :label-width="formLabelWidth" label="项目:" prop="proj_id">
          <el-select filterable placeholder="请选择" v-model="addForm.proj_id" :disabled="title === '编辑'">
            <el-option
              v-for="item in projectsList"
              :key="item.id"
              :label="item.app_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="媒体:" prop="media_id">
          <el-select filterable placeholder="请选择" v-model="addForm.media_id" :disabled="title === '编辑'">
            <el-option
              v-for="item in mediaList"
              :key="item.id"
              :label="item.name_cn"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="激活回传GAP是否复制:" prop="is_copy_ratio">
          <el-radio-group v-model="addForm.is_copy_ratio">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
         <el-form-item :label-width="formLabelWidth" label="转化回传GAP是否复制:" prop="is_copy_advertis_ratio">
          <el-radio-group v-model="addForm.is_copy_advertis_ratio">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" :loading="btnloading" @click="addclick(addForm)">确 定</el-button>
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
    title:{
      type: String,
      default: '新增',
    },
    initData:{
      type: Object,
      default: () => {},
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
      formLabelWidth: '200px',
      addForm:{
        proj_id: '',
        media_id: '',
        is_copy_ratio: '',
        is_copy_advertis_ratio: ''
      },
      rules: {
        proj_id: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        media_id: [
          { required: true, message: '请选择媒体', trigger: 'change' }
        ],
        is_copy_ratio: [
          { required: true, message: '请选择激活回传GAP是否复制', trigger: 'change' }
        ],
        is_copy_advertis_ratio: [
          { required: true, message: '请选择转化回传GAP是否复制', trigger: 'change' }
        ]
      },
    }
  },
  created () {
    if(JSON.stringify(this.initData) !== '{}'){
        const { proj_id, media_id, is_copy_ratio, is_copy_advertis_ratio } = this.initData
        this.addForm = {
            proj_id, 
            media_id,
            is_copy_ratio,
            is_copy_advertis_ratio
        }
      }
  },
  methods: {
    addclick(val) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('saveData', val)
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
