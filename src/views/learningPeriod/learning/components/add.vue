<template>
  <!-- Form -->
  <div class="eldialog">
    <el-dialog
      :visible.sync="dialogFormVisible"
      :title="title"
      :before-close="handleCancel"
    >
      <el-form ref="form" :rules="rules" :model="addForm">
        <el-form-item
          :label-width="formLabelWidth"
          label="项目:"
          prop="proj_id"
        >
          <el-select
            filterable
            clearable
            placeholder="请选择"
            v-model="addForm.proj_id"
            @change="handleProject"
            :disabled="this.title == '编辑'"
          >
            <el-option
              v-for="item in projectList"
              :key="item.id"
              :label="item.app_name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="子账号:"
          prop="advertiser_id"
        >
          <el-select
            filterable
            placeholder="请选择"
            v-model="addForm.advertiser_id"
            :disabled="this.title == '编辑'"
          >
            <el-option
              v-for="item in childList"
              :key="item.id"
              :label="item.media_account_child_id"
              :value="item.media_account_child_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item
          :label-width="formLabelWidth"
          label="状态:"
          prop="status"
        >
          <div>
             <el-radio-group v-model="addForm.status" >
              <el-radio :label="0">关闭</el-radio>
              <el-radio :label="1">开启</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <!-- 新增条件 -->
        <el-form-item>
          <div>自动关闭学习期条件：<span style="color: red;">满足以下所有条件，自动关闭学习期，条件2默认不填写，不填写则不判断</span></div>
        </el-form-item>
        
        <el-form-item
          :label-width="formLabelWidth"
          label="条件1:该子账号新增设备数>=:"
          prop="limit_device_cnt"
        >
          <el-input style="width: 150px;" v-model.number="addForm.limit_device_cnt"></el-input>
          <span>个</span>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="条件2:该子账号下，已达到关键行为实际回传数标准的二级计划数量:"
          prop="limit_bid_pass"
        >
          <el-input style="width: 150px;line-height:80px;" v-model.number="addForm.limit_bid_pass"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="二级计划学习期内关键行为实际回传数标准设置:"
          prop="behavior_num"
        >
          <el-input style="width: 150px;line-height:77px;" v-model.number="addForm.behavior_num"></el-input>
          <span>个</span>
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
import { getProjectList } from "@/api/dynamic/public";
import { getChildId } from "@/api/learning";

export default {
  props: {
    dialogFormVisible:{
      type:Boolean,
      default:false,
    },
    initData:{
      type:Object,
      default: () => {}
    },
    title: {
      type: String,
      default: () => "未知",
    },
    initData: {
      type: Object,
      default: () => {},
    },
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
        advertiser_id: '',
        status: '',
        limit_device_cnt: 1000,
        limit_bid_pass: null,
        behavior_num: 20,
      }
      if(this.$refs.form){
        this.$refs.form.resetFields()
      }
      if(newValue && JSON.stringify(this.initData) !== '{}') {
        const {proj_id, advertiser_id, status, limit_device_cnt, limit_bid_pass, behavior_num} = this.initData
        this.inputStatus = true
        this.addForm = {
          proj_id,
          advertiser_id,
          status,
          limit_device_cnt,
          limit_bid_pass,
          behavior_num
        }
      }
    }
  },
  data() {
    return {
      formLabelWidth: "250px",
      inputStatus: false,
      childList: [],
      projectList: [],
      addForm: {
        proj_id: "",
        advertiser_id: "",
        status: '',
        limit_device_cnt: 1000,
        limit_bid_pass: null,
        behavior_num: 20,
      },
      rules: {
        proj_id: [{ required: true, message: "请选择项目", trigger: "blur" }],
        advertiser_id: [
          { required: true, message: "请选择子账号", trigger: "blur" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        limit_device_cnt: [{ required: true, message: "配置条件不能为空", trigger: "blur" }],
        // limit_bid_pass: [{ required: true, message: "配置条件不能为空", trigger: "blur" }],
        behavior_num: [{ required: true, message: "配置条件不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getProjectList()
    console.log('this.initData',this.initData)
    
  },
  methods: {
    // 请求项目
      getProjectList() {
        getProjectList().then((data) => {
          if (data.error_code === 0) {
            this.projectList = data.data;
          }
        });
      },
    // 选择关联主账号 -- 获取子账户信息
    addclick(val) {
      console.log('val',val);
      
      // if (val.limit_bid_pass === null) {
      //   val.limit_bid_pass = -1
      // }

      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.title == "新增") {
            this.$emit("getLearnAdd", val)
          } else {
            this.$emit("getLearnEdit",val)
          }
        }
      });
    },
    handleCancel() {
      this.$emit("updateAddvisible", false);
    },
    // 项目关联主账号
    handleProject(e) {
      this.addForm.media_account_id = ""
      // console.log(this.addForm.proj_id);
      // 主账号接口
      // console.log(this.addForm.proj_id);
      getChildId({proj_id:this.addForm.proj_id})//{proj_id:this.addForm.proj_id}
        .then((data) => {
          if (data.error_code === 0) {
            console.log(data);
            this.childList = data.data;    
          } else {
            this.childList = [];
          }
        })
        .catch(() => {
          this.masterList = [];
          this.$message({
            message: "加载账号失败",
            type: "error",
          });
        });
      
        console.log(e,'e');
        // getAnchorByProj({proj_id: e}).then((data) => {
        //     if(data.error_code ===0) {
        //       console.log(data.data);
        //       this.anchorList = data.data
            
        //     }
        //   }).catch(() => {
        //     this.$message({
        //         message: '加载失败',
        //         type: 'error'
        //     })
        //   })
    },
  },
};
</script>
<style scoped>
::v-deep .el-dialog {
  width: 650px;
}
.eldialog {
  width: 100%;
  align-items: center;
  background: #fff;
  padding: 10px;
}
.form_input {
  width: 200px;
}
.tips{
  margin-left: 150px;
}
.tips p{
  margin: 0;
}
</style>
