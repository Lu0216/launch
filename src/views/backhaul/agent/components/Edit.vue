<template>
  <!-- Form -->
  <div class="eldialog">
    <el-dialog :visible.sync="visible" :title="addDialogType === 'edit' ? '编辑' : '新增'">
      <el-form ref="form" :rules="rules" :model="addForm" v-if="current === 1">
        <el-form-item :label-width="formLabelWidth" label="项目:" prop="proj_id">
          <el-select filterable placeholder="请选择" v-model="addForm.proj_id" @change="changeProj" :disabled="addDialogType === 'edit'">
            <el-option
              v-for="item in projectsList"
              :key="item.id"
              :label="item.app_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item :label-width="formLabelWidth" label="媒体:" prop="media_id">
          <el-select filterable placeholder="请选择" v-model="addForm.media_id" @change="changeMedia" :disabled="addDialogType === 'edit'">
            <el-option
              v-for="item in mediaList"
              :key="item.id"
              :label="item.name_cn"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item :label-width="formLabelWidth" label="代理:" prop="opti_id">
          <el-select filterable placeholder="请选择" v-model="addForm.opti_id" @change="changeOpti" :disabled="addDialogType === 'edit'">
            <el-option
              v-for="item in agentList"
              :key="item.id"
              :label="item.short_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="概率:" prop="ratio">
          <el-input-number v-model="addForm.ratio" :precision="0" :min="0" :max="100" class="form_input" />%
        </el-form-item>
      </el-form>
      <el-row v-if="current === 2">
        <el-col :span="24" :gutter="5" class="surebox">
          <el-col :span="7" align="right">项目：</el-col>
          <el-col :span="17">{{selectName.proj}}</el-col>
        </el-col>
        <el-col :span="24" :gutter="5" class="surebox">
          <el-col :span="7" align="right">媒体：</el-col>
          <el-col :span="17">{{selectName.media}}</el-col>
        </el-col>
        <el-col :span="24" :gutter="5" class="surebox">
          <el-col :span="7" align="right">优化代理：</el-col>
          <el-col :span="17">{{selectName.opti}}</el-col>
        </el-col>
         <el-col :span="24" class="surebox" :style="{color:(addForm.ratio < 50? 'red':'#000')}">
          <el-col :span="7" align="right">概率：</el-col>
          <el-col :span="17">{{addForm.ratio}}%</el-col>
        </el-col>
        <el-col :span="24" align='center' style="color:red;margin-top:10px" v-if="addForm.ratio < 50">您所填写的概率低于50%, 是否确认保存！</el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" :loading="btnloading" @click="addclick(addForm)">{{current === 1 ? '确 定' : '保 存'}}</el-button>
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
    addDialogType:{
      type:String,
      default:() => 'add'
    },
    projectsList: {
      type:Array,
      default: () => []
    },
    mediaList:{
      type:Array,
      default: () => []
    },
    agentList:{
      type:Array,
      default: () => []
    },
    initData:{
      type:Object,
      default:() => {}
    },
    btnloading:{
      type:Boolean,
      default:false
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
      this.current = 1
      const { proj= '', media= '', opti= '', proj_id= '', media_id= '', opti_id= '', ratio= ''} = this.initData
      this.selectName={ proj, media, opti }
      this.addForm={ proj_id, media_id,  opti_id, ratio }
      if(this.$refs.form){
        this.$refs.form.resetFields()
      }
    }
  },
  data () {
    return {
      formLabelWidth: '150px',
      current:1,
      addForm:{
        proj_id: '',
        media_id: '',
        opti_id: '',
        ratio: ''
      },
      selectName:{
        proj: '',
        media: '',
        opti: '',
      },
      rules: {
        proj_id: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        media_id: [
          { required: true, message: '请选择媒体', trigger: 'change' }
        ],
        opti_id: [
          { required: true, message: '请选择关联子账号', trigger: 'change' }
        ],
        ratio: [
          { required: true, message: '请填写概率', trigger: 'blur' },
        ],
      },
    }
  },
  mounted () {
    
  },
  methods: {
    changeProj(val){
      let obj = this.projectsList.find((item)=>{
          return item.id === val;
      });
      this.selectName.proj = obj.app_name;
    },
    changeMedia(val){
      let obj = this.mediaList.find((item)=>{
          return item.id === val;
      });
      this.selectName.media = obj.name_cn;
    },
    changeOpti(val){
      let obj = this.agentList.find((item)=>{
          return item.id === val;
      });
      this.selectName.opti = obj.short_name;
    },
    addclick(val) {
      if(this.current === 1){
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.current = 2;
          }
        })
      }else if(this.current === 2){
        this.$emit('saveAgent', val)
      }
      
    },
    handleCancel(){
      if(this.current === 2){
        this.current --;
      }else{
        this.$emit('updateAddvisible',false)
      }
      
    },
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
