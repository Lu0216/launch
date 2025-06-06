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
            placeholder="请选择"
            v-model="addForm.proj_id"
            @change="handleProject"
          >
            <el-option
              v-for="item in projectsList"
              :key="item.id"
              :label="item.app_name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="关联主账号:"
          prop="media_account_id"
        >
          <el-select
            filterable
            placeholder="请选择"
            v-model="addForm.media_account_id"
            @change="handleMaster"
          >
            <el-option
              v-for="item in masterList"
              :key="item.id"
              :label="item.account"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="关联子账号:"
          prop="media_account_child_id"
        >
          <el-select
            filterable
            placeholder="请选择"
            v-model="addForm.media_account_child_id"
          >
            <el-option
              v-for="item in mediaChild"
              :key="item.media_account_child_id"
              :label="item.media_account_child_id"
              :value="item.media_account_child_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="激活回传锚点:"
          prop="symbol"
        >
        <el-form-item prop="symbol" style="width:140px;display:inline-block;">
          <el-select
            filterable
            placeholder="请选择运算符"
            v-model="addForm.symbol"
             style="width:140px;"
          >
            <el-option
              key="1"
              :label="`>=`"
              :value="1"
            >
            </el-option>
             <el-option
              key="2"
              :label="`=`"
              :value="2"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="anchor_id" style="width:180px;display:inline-block;">
          <el-select
            filterable
            placeholder="请选择"
            v-model="addForm.anchor_id"
            style="width:180px;"
          >
            <el-option
              v-for="item in anchorList"
              :key="item.anchor_id"
              :label="item.anchor.anchor_name"
              :value="item.anchor_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        
        </el-form-item>
        <div class="tips">
          <p>备注：</p>
          <p>100-500的锚点值建议使用运算符为 >=；</p>
          <p>500以上锚点值建议使用运算符为 =</p>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="addclick(addForm)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getMediaMasterList, getMediaChildList } from "@/api/dynamic/public";
import { getAnchorByProj } from '@/api/anchor'
export default {
  props: {
    dialogFormVisible:{
      type:Boolean,
      default:false,
    },
    projectsList: {
      type: Array,
      default: () => [],
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
        media_account_id: '',
        media_account_child_id: '',
        anchor_id:'',
        symbol:'',
      }
      if(this.$refs.form){
        this.$refs.form.resetFields()
      }
    }
  },
  data() {
    return {
      formLabelWidth: "150px",
      masterList: [],
      mediaChild: [],
      anchorList: [],
      addForm: {
        proj_id: "",
        media_account_id: "",
        media_account_child_id: "",
        anchor_id:'',
        symbol:''
      },
      rules: {
        proj_id: [{ required: true, message: "项目不能为空", trigger: "change" }],
        media_account_id: [
          { required: true, message: "关联主账号不能为空", trigger: "change" },
        ],
        media_account_child_id: [
          { required: true, message: "关联子账号不能为空", trigger: "change" },
        ],
        anchor_id: [{ required: true, message: "激活回传场景不能为空", trigger: "change" }],
        symbol: [{ required: true, message: "运算符不能为空", trigger: "change" }],
      },
    };
  },
  created() {},
  methods: {
    handleProject(e) {
      getMediaMasterList({ proj_id: e })
        .then((data) => {
          if (data.error_code === 0) {
            this.masterList = data.data;
          } else {
            this.masterList = [];
          }
        })
        .catch(() => {
          this.masterList = [];
          this.$message({
            message: "加载账号失败",
            type: "error",
          });
        });
        getAnchorByProj({proj_id: e}).then((data) => {
          if(data.error_code ===0) {
            this.anchorList = data.data
          }
          }).catch(() => {
            this.$message({
                message: '加载失败',
                type: 'error'
            })
          })
    },
    // 选择关联主账号 -- 获取子账户信息
    handleMaster(e) {
      this.addForm.media_account_child_id = "";
      getMediaChildList({ account_id: e })
        .then((data) => {
          if (data.error_code === 0) {
            this.mediaChild = data.data;
          } else {
            this.mediaChild = [];
          }
        })
        .catch(() => {
          this.mediaChild = [];
          this.$message({
            message: "加载账号失败",
            type: "error",
          });
        });
    },
    addclick(val) {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.title == "新增") {
            this.$emit("getSubAdd", val);
          }
        }
      });
    },
    handleCancel() {
      this.$emit("updateAddvisible", false);
      // this.$refs.form.resetFields();
    },
  },
};
</script>
<style scoped>
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
