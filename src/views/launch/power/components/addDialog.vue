<template>
  <!-- Form -->
  <div class="eldialog">
    <el-form ref="form" :rules="rules" :model="addForm">
    <el-form-item :label-width="formLabelWidth" label="LDAP账号:" prop="name">
        <el-input v-model="addForm.name"/>
    </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="姓名:" prop="name_cn">
        <el-input v-model="addForm.name_cn"/>
    </el-form-item>
    <el-form-item :label-width="formLabelWidth" label="项目权限(多选):" prop="project_ids">
        <el-select v-model="addForm.project_ids"  multiple  placeholder="请选择项目权限">
        <el-option
            v-for="item in projectsList"
            :key="item.id"
            :label="item.app_name"
            :value="item.id">
        </el-option>
        </el-select>
    </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
    <el-button @click="handleCancel">取 消</el-button>
    <el-button type="primary" @click="saveclick(addForm)">确 定</el-button>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    dialogFormVisible:{
      type:Boolean,
      default:false,
    },
    addForm:{
       type:Object,
       default:() => ({})
    },
    projectsList: {
      type:Array,
      default: () => []
    }
  },
  watch: {
    dialogFormVisible(newValue,oldValue){
      if(this.$refs.form){
        this.$refs.form.resetFields()
      }
    }
  },
  data () {
    return {
      formLabelWidth: '150px',
      rules: {
        name: [
          { required: true, message: '请输入LDAP账号', trigger: 'blur' },
          { min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'blur' }
        ],
        name_cn: [
          { required: false, message: '请输入姓名', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        project_ids: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ]
      },
    }
  },
  methods: {
    saveclick(val) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('saveUser', val)
        }
      })
    },
    handleCancel(){
      this.$emit('handleCancel')
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
