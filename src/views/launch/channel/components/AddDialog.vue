<template>
  <!-- Form -->
  <div class="eldialog">
    <el-dialog :visible.sync="visible" :title="dialogType === 'add' ? '添加' : '编辑'">
      <el-form ref="form" :rules="rules" :model="addForm">
        <el-form-item :label-width="formLabelWidth" label="项目:" prop="proj_id">
          <el-select filterable  placeholder="请选择" v-model="addForm.proj_id" @change="handleProject" :disabled="dialogType === 'edit'">
            <el-option
              v-for="item in projectsList"
              :key="item.id"
              :label="item.app_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogType === 'edit'" :label-width="formLabelWidth" label="渠道标签:" prop="tag">
          <el-input v-model="addForm.tag" class="form_input" :disabled="dialogType === 'edit'" />
        </el-form-item>
        <el-form-item v-else :label-width="formLabelWidth" label="渠道标签:" prop="tag_id">
          <el-select filterable  placeholder="请选择" v-model="addForm.tag_id" @change="changeTags">
            <el-option
              v-for="item in tagsList"
              :key="item.tag_id"
              :label="item.tag_name"
              :value="item.tag_id">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item :label-width="formLabelWidth" label="关联主账号:" prop="media_account_id" :rules="asyncRule">
          <el-select filterable  placeholder="请选择" v-model="addForm.media_account_id" @change="handleMaster"  :disabled="disableStatus">
            <el-option
              v-for="item in masterList"
              :key="item.id"
              :label="item.account"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="关联子账号:" prop="media_account_child_id" :rules="asyncChildRule">
          <el-select filterable  placeholder="请选择" v-model="addForm.media_account_child_id" :disabled="disableStatus">
            <el-option
              v-for="item in mediaChild"
              :key="item.media_account_child_id"
              :label="item.media_account_child_id"
              :value="item.media_account_child_id">
            </el-option>
          </el-select>
        </el-form-item>
          <p v-show="tipStatus" style="text-align:center;color:red;">此子账号用于爬取媒体审核状态，若需更改请联系产品或开发</p>
        <el-form-item v-if="dialogType === 'edit'" :label-width="formLabelWidth" label="渠道包号:" prop="src">
          <el-input v-model="addForm.src" class="form_input" :disabled="dialogType === 'edit'" />
        </el-form-item>
        <el-form-item v-else :label-width="formLabelWidth" label="创建渠道号数量:" prop="num">
          <el-input-number v-model="addForm.num" class="form_input" :min="1" :max="500" :precision="0" />
          <div style="color:#888">仅支持输入1-500之间的正整数</div>
        </el-form-item>
        <el-form-item v-if="app_idStatus" :label-width="formLabelWidth" label="该项目在广点通媒体的appid:" prop="gdt_media_appid">
          <el-input v-model="addForm.gdt_media_appid" class="form_input" />
          <p style="color:red;">注：用于爬取广点通主线包审核状态用，重要！</p>
        </el-form-item>
        <!-- <el-form-item :label-width="formLabelWidth" label="是否主线包:" prop="is_main_src" v-if="addForm.media_id == 1 || addForm.media_id == 5 || addForm.media_id == 2||dialogType === 'edit'">
          <div>
            仅当关联主账号是头条和广点通媒体以及快手时，此字段才可选择 ,选择非头条和广点通媒体及快手的主账号时，此字段是无效字段，即不可编辑，作置灰状态
            <el-radio-group v-model="addForm.is_main_src" :disabled="addForm.media_id != 1 && addForm.media_id != 5 && addForm.media_id != 2|| dialogType === 'edit' || addForm.media_account_id == ''">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
          </div>
        </el-form-item> -->
        <el-form-item :label-width="formLabelWidth" label="备注:" prop="remark">
          <el-input type="textarea" :rows="3" v-model="addForm.remark" class="form_input" maxlength="50" />
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

import { getMediaMasterList, getMediaChildList, getMediaTagList, getAppid } from '@/api/dynamic/public'

export default {
  props: {
    dialogType:{
      type:String,
      default:'add',
    },
    dialogFormVisible:{
      type:Boolean,
      default:false,
    },
    projectsList: {
      type:Array,
      default: () => []
    },
    tagsList: {
      type:Array,
      default: () => []
    },
    initData:{
      type:Object,
      default: () => {}
    },
    btnloading:{
      type: Boolean,
      default: false
    }
  },
  computed:{
    asyncRule: {
      get(){
        return [ { required: this.addForm.tag_type == 1, message: '请选择关联主账号', trigger: 'change' }]
      }
    },
    asyncChildRule:{
      get(){
        return [ { required: this.addForm.tag_type == 1, message: '请选择关联子账号', trigger: 'change' }]
      }
    },
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
    dialogType(newValue,oldValue) {
      this.app_idStatus = false
    },
    dialogFormVisible(newValue,oldValue){
      this.addForm = {
          proj_id: '',
          tag_id: '',
          media_account_id: '',
          media_account_child_id: '',
          src: '',
          num: '',
          tag:'',
          tag_type:'',
          remark: '',
          gdt_media_appid: ''
          // is_main_src:2,
        }
      if(this.$refs.form){
        this.$refs.form.resetFields()
      }
      if(newValue && JSON.stringify(this.initData) !== '{}'){
        const { proj_id, tag_id, media_account_id, media_account_child_id, channel, num, tag, tag_type, remark ,is_main_src,gdt_media_appid} = this.initData
        this.addForm.proj_id = proj_id
         this.addForm.tag_id = tag_id
         this.addForm.media_account_id = media_account_id
        this.handleProject()
        this.handleMaster(media_account_id)
        this.addForm = {
          proj_id,
          tag_id,
          media_account_id,
          media_account_child_id,
          src: channel,
          num,
          tag,
          tag_type,
          remark,
          gdt_media_appid
          // is_main_src,
        }
        tag_id == 43 ? this.app_idStatus = true : this.app_idStatus = false
      }
    },
  },
  data () {
    return {
      formLabelWidth: '150px',
      masterList:[],
      mediaChild:[],
      tipStatus: false,
      disableStatus: false,
      app_idStatus: false,
      addForm:{
        proj_id: '',
        tag_id: '',
        media_account_id: '',
        media_account_child_id: '',
        src: '',
        num: '',
        tag:'',
        tag_type: '',
        remark: '',
        // is_main_src:2,
        media_id:'',
        gdt_media_appid: ''
      },
      rules: {
        tag_id: [
          { required: true, message: '请选择渠道标签', trigger: 'change' },
        ],
        proj_id: [
          { required: true, message: '请选择项目', trigger: 'change' }
        ],
        num: [
          { required: true, message: '请填写创建渠道号数量', trigger: 'change' },
        ],
      },
    }
  },
  created () {
   
  },
  methods: {
    changeTags(e){
      if(e == 43) {
        this.app_idStatus = true
      } else {
        this.app_idStatus = false
      }
      let selected = this.tagsList.filter(el => el.tag_id === e)
      this.addForm.tag_type = selected[0].tag_type
      this.$refs.form.clearValidate(['media_account_id','media_account_child_id'])
      if(this.addForm.tag_type != 1){
        this.disableStatus = true
        this.addForm.media_account_id = '';
        this.addForm.media_account_child_id = '';
        // this.addForm.is_main_src = 2
      }
      this.handleProject()
    },
    // 选择项目
     handleProject(){
       this.addForm.media_account_id = '';
       this.addForm.media_account_child_id = '';
      //  广点通主线包
       if(this.addForm.tag_id == 43 && this.dialogType == 'add') {
        getAppid({tag_id:this.addForm.tag_id,proj_id:this.addForm.proj_id}).then((data) => {
          this.addForm.gdt_media_appid = data.data.gdt_media_appid
        })
       }
      //  this.addForm.is_main_src = 2
      getMediaTagList({'proj_id':this.addForm.proj_id,'tag_id': this.addForm.tag_id}).then((data) => {
        if (data.error_code === 0) {
          // ==1主线包
          if(data.data.is_exists_main == 1 ) {
            this.disableStatus = true
            this.tipStatus = true
            this.addForm.media_account_id = data.data.accountList[0].id
            this.addForm.media_account_child_id = data.data.child_accountList[0].media_account_child_id
          } else {
            if(this.addForm.tag_type != 1) {
              this.disableStatus = true
            } else {
              this.disableStatus = false
            }
            this.tipStatus = false
          }
          this.masterList = data.data.accountList
          this.mediaChild = data.data.child_accountList
        }else{
          this.addForm.tag_type = 0
          this.masterList = []
          this.mediaChild = []
        }
      }).catch(() => {
        this.addForm.tag_type = 0
        this.masterList = []
        this.mediaChild = []
        this.$message({
          message: data.error_message,
          type: 'error'
        })
      })
     },
    //  关联主账号
     handleMaster(e){
      this.addForm.media_account_child_id = '';
      if(this.dialogType == 'add') {
        let dataValue = this.masterList.filter(item => item.id == e)
        this.addForm.media_id = dataValue[0].media_id
        // this.addForm.is_main_src = 2
      }
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
          // if((val.media_id == 1 || val.media_id == 5) && val.is_main_src == 1) {
          //   if(val.num != 1) {
          //     return this.$message.error('主线包每次仅可创建1个渠道号！')
          //   }
          // }
          this.$emit('saveChannel', val)
        }
      })
    },
    handleCancel(){
      // this.$emit('handleCancel')
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
