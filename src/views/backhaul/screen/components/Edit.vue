<template>
  <!-- Form -->
  <div class="eldialog">
    <el-dialog :visible.sync="visible" title="编辑">
      <el-form ref="form" :rules="rules" :model="addForm" v-if="current === 1">
          <el-form-item :label-width="formLabelWidth" label="项目:" prop="proj">
          <el-input v-model="addForm.proj" class="form_input" disabled />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="媒体:" prop="media">
          <el-input v-model="addForm.media" class="form_input" disabled />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="优化代理:" prop="opti">
          <el-input v-model="addForm.opti" class="form_input" disabled />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="渠道号:" prop="src">
          <el-input v-model="addForm.src" class="form_input" disabled />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="概率:" prop="ratio">
          <el-input-number v-model="addForm.ratio" :precision="0" :min="0" :max="100" class="form_input" />%
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="转化回传概率:" prop="advertis_ratio">
          <el-input-number v-model="addForm.advertis_ratio" :precision="0" :min="0" :max="100" class="form_input" />%
        </el-form-item>
      </el-form>
      <el-row v-if="current === 2">
        <el-col :span="24" :gutter="5" class="surebox">
          <el-col :span="8" align="right">项目：</el-col>
          <el-col :span="16">{{addForm.proj}}</el-col>
        </el-col>
        <el-col :span="24" :gutter="5" class="surebox">
          <el-col :span="8" align="right">媒体：</el-col>
          <el-col :span="16">{{addForm.media}}</el-col>
        </el-col>
        <el-col :span="24" :gutter="5" class="surebox">
          <el-col :span="8" align="right">优化代理：</el-col>
          <el-col :span="16">{{addForm.opti}}</el-col>
        </el-col>
        <el-col :span="24" :gutter="5" class="surebox">
          <el-col :span="8" align="right">渠道号：</el-col>
          <el-col :span="16">{{addForm.src}}</el-col>
        </el-col>
         <el-col :span="24" class="surebox" :style="{color:(addForm.ratio < 50? 'red':'#000')}">
          <el-col :span="8" align="right">概率：</el-col>
          <el-col :span="16">{{addForm.ratio}}%</el-col>
        </el-col>
         <el-col :span="24" class="surebox" :style="{color:(addForm.advertis_ratio < 50? 'red':'#000')}">
          <el-col :span="8" align="right">转化回传概率：</el-col>
          <el-col :span="16">{{addForm.advertis_ratio}}%</el-col>
        </el-col>
        <el-col :span="24" align='center' style="color:red;margin-top:10px" v-if="addForm.ratio < 50">您所填写的概率低于50%, 是否确认保存！</el-col>
        <el-col :span="24" align='center' style="color:red;margin-top:10px" v-if="addForm.advertis_ratio < 50">您所填写的转化概率低于50%, 是否确认保存！</el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="addclick(addForm)">{{current === 1 ? '确 定' : '保存'}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

export default {
  props: {
    dialogFormVisible:{
      type:Boolean,
      default:false,
    },
     initData:{
      type:Object,
      default:() => {},
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
  watch: {
    dialogFormVisible(newValue,oldValue){
      this.addForm = {
        proj:'',
        media:'',
        opti:'',
        src: '',
        ratio:'',
        advertis_ratio:''
      }
      this.current = 1
      if(this.$refs.form){
        this.$refs.form.resetFields()
      }
      if(newValue && JSON.stringify(this.initData) !== '{}'){
        const { proj, media, opti, src, ratio, advertis_ratio } = this.initData
        this.addForm = { proj, media, opti, src, ratio, advertis_ratio }
      }
    }
  },
  data () {
    return {
      formLabelWidth: '150px',
      current:1,
      addForm:{
        proj:'',
        media:'',
        opti:'',
        src: '',
        ratio:''
      },
      rules: {
        ratio: [
          { required: true, message: '请填写概率', trigger: 'blur' },
        ],
         advertis_ratio: [
          { required: true, message: '请填写转化回传概率', trigger: 'blur' },
        ],
      },
    }
  },
  created () {
   
  },
  methods: {
    addclick(val) {
      if(this.current === 1){
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.current = 2;
          }
        })
      }else if(this.current === 2){
        this.$emit('editScreen', val)
      }
      
    },
    handleCancel(){
      if(this.current === 2){
        this.current --
      }else{
        this.$emit('updateEditvisible',false)
      }
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
.surebox{
  font-size: 24px;
  margin: 10px 0px;
}
</style>
