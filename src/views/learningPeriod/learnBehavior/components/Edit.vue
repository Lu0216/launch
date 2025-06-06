<template>
  <!-- Form -->
  <div class="eldialog">
    <el-dialog
      :visible="dialogFormVisible"
      :title="this.title"
      width="1200px"
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
            disabled
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
        <el-form-item :label-width="formLabelWidth" label="媒体:" prop="media_id">
          <el-select
            filterable
            placeholder="请选择"
            v-model="addForm.media_id"
            @change="changeMedia"
            disabled
            >
            <el-option
              v-for="item in mediaList"
              :key="item.id"
              :label="item.name_cn"
              :value="item.id">
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
            placeholder="请选择关联主账号"
            v-model="addForm.media_account_id"
             @change="handleMaster"
            disabled
            style="width:280px;"
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
            placeholder="请选择关联子账号"
            v-model="addForm.media_account_child_id"
            disabled
            style="width:280px;"
          >
            <el-option
              v-for="item in mediaChild"
              :key="item.id"
              :label="item.media_account_child_id"
              :value="item.media_account_child_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="机型:"
          prop="brand"
        >
          <el-select
            filterable
            placeholder="请选择"
            v-model="addForm.brand"
            disabled
          >
            <el-option
              v-for="(item,index) in modelList"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="安卓版本:"
          prop="os_version"
        >
          <el-select
            filterable
            placeholder="请选择"
            v-model="addForm.os_version"
            disabled
          >
            <el-option
              v-for="(item,i) in androidList"
              :key="i"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          
        >
        <template #label>
          <span class="required-star">*</span>show_cnt: 
        </template>
          <el-form-item prop="show_cnt_symbol" style="width:160px;display: inline-block;">
            <el-select
              filterable
              placeholder="请选择运算符"
              v-model="addForm.show_cnt_symbol"
              style="width:150px;"
            >
              <el-option
                v-for="item in showcntList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="show_cnt" style="display: inline-block;">
            <el-input v-model="addForm.show_cnt" style="width:200px;" placeholder="请输入数字，保留两位小数"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="arpu:"
        >
        <template #label>
          <span class="required-star">*</span>arpu: 
        </template>
          <el-form-item prop="arpu_symbol" style="width:160px;display: inline-block;">
            <el-select
              filterable
              placeholder="请选择运算符"
              v-model="addForm.arpu_symbol"
              style="width:150px;"
            >
              <el-option
                v-for="item in arpuList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="arpu" style="display: inline-block;">
            <el-input v-model="addForm.arpu" style="width:200px;" placeholder="请输入数字，保留两位小数"></el-input>
          </el-form-item>
        </el-form-item>
        <!-- 增加字段 -->
        <el-form-item :label-width="formLabelWidth" label="平均ecpm:" prop="avg_ecpm">
          <el-input v-model="addForm.avg_ecpm" style="width:150px;" placeholder="请输入平均ecpm"></el-input>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="最大ecpm及次数:"
        >
          <el-form-item prop="max_ecpm" style="width:150px;display: inline-block;">
            <el-input v-model="addForm.max_ecpm" style="width:150px;" placeholder="请输入最大ecpm"></el-input>
          </el-form-item>
          <el-form-item prop="max_ecpm_total" style="display: inline-block;margin-left: 10px;">
            <el-input v-model="addForm.max_ecpm_total" style="width:150px;" placeholder="请输入次数"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="计算周期:" prop="time_limit">
          <el-input v-model="addForm.time_limit" style="width:150px;" placeholder="请输入计算周期"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="付款金额:" prop="paid_amount">
          <el-input v-model="addForm.paid_amount" style="width:150px;" placeholder="请输入付款金额"></el-input>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="widget">
            <el-select 
            filterable
            placeholder="请选择widget行为"
            v-model="addForm.widget"
            >
              <el-option
                v-for="item in widgetList"
                :key="item"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="概率:" prop="gap_ratio">
          <el-input-number
            v-model="addForm.gap_ratio"
            :min="0"
            :max="100"
          ></el-input-number
          >%
        </el-form-item>
    </el-form>
        <div class="tips">
          <p>备注：</p>
          <p>1、100-500的锚点值建议使用运算符为 >=；</p>
          <p>2、500以上锚点值建议使用运算符为 =</p>
          <p>3、概率为0时，不回传</p>
          <p>4、机型与安卓版本必须同时填写或同时不填</p>
          <p>5、平均ecpm：非必填；不填写时ecpm默认为0</p>
          <p>6、最大ecpm：非必填；不填写时最大ecpm为0</p>
          <p>7、计算周期：单位：小时；必填；最小为1，最大为72:开始时间为新增时间</p>
          <p>8、(show cnt、 arpu)、付费金额、widget至少填写一组:开始时间为新增时间</p>
        </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="addclick(addForm)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getMediaMasterList, getMediaChildList } from "@/api/dynamic/public";
export default {
  props: {
    // dialogFormVisible:{
    //   type:Boolean,
    //   default:false,
    // },
    projectsList: {
      type: Array,
      default: () => [],
    },
    mediaList:{
      type:Array,
      default: () => []
    },
    masterList:{
      type:Array,
      default: () => []
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
  data() {
    return {
      // 机型和安卓版本（静态数据）
      modelList:['OPPO','HUAWEI','HONOR','VIVO','XIAOMI','Tianyi','Hinova','NZONE','PTAC','WIKO','MEIZU','samsung','UNICOMVSENS','TDTech','Liantong','JRD','CMDC','其他'],
      androidList:['9','10','11','12','13','14','15'],
      showcntList:[
        {
          id:0,
          name:''
        },
        {
          id:1,
          name:'>'
        },
        {
          id:2,
          name:'<'
        },
        {
          id:3,
          name:'>='
        },
        {
          id:4,
          name:'<='
        },
        {
          id:5,
          name:'='
        }

      ],
      arpuList:[
        {
          id:0,
          name:''
        },
        {
          id:1,
          name:'>'
        },
        {
          id:2,
          name:'<'
        },
        {
          id:3,
          name:'>='
        },
        {
          id:4,
          name:'<='
        },
        {
          id:5,
          name:'='
        }

      ],
      widgetList: [
        {
          value:1,
          label:'弹窗展示'
        },
        {
          value:2,
          label:'点击添加'
        },
        {
          value:3,
          label:'添加成功'
        },
      ],
      dialogFormVisible: true,
      formLabelWidth: "150px",
      // masterList: [],
      mediaChild: [],
      addForm: {
        id:'',
        proj_id: "",
        media_id:'',
        media_account_child_id: "",
        media_account_id: "",
        media_account_name:'',
        brand:'',
        os_version:'',
        show_cnt_symbol: '',
        show_cnt: '',
        arpu_symbol: '',
        arpu: '',
        avg_ecpm: 0, 
        max_ecpm: 0,
        max_ecpm_total: '',
        time_limit: '',
        paid_amount: '',
        widget: null,
        gap_ratio:100,
      },
      rules: {
        proj_id: [{ required: true, message: "请选择项目", trigger: "change" }],
        media_id: [
          { required: true, message: "请选择媒体", trigger: "change" },
        ],
        media_account_id: [
          { required: true, message: "请选择关联主账号", trigger: "change" },
        ],
        media_account_child_id: [
          { required: true, message: "请选择关联子账号", trigger: "change" },
        ],
        // brand: [
        //   { required: true, message: "请选择机型", trigger: "change" },
        // ],
        // os_version: [
        //   { required: true, message: "请选择安卓版本", trigger: "change" },
        // ],
        gap_ratio: [
          { required: true, message: "请输入概率", trigger: "blur" },
        ],
        time_limit: [
          { required: true, message: "请输入计算周期", trigger: "blur" },
        ],
      },
    //   rules_2:{
    //     gap_ratio: [{ required: true, message: "请填写概率", trigger: "change" }],
    //     symbol: [{ required: true, message: "运算符不能为空", trigger: "change" }],
    //   }
    };
  },
  created() {    
      console.log('this.initData',this.initData)
      console.log('this.masterList',this.masterList)
      this.addForm.proj_id = this.initData.proj_id;
      this.addForm.media_id = this.initData.media_id;
      this.addForm.media_account_id = this.initData.media_account;
      this.addForm.media_account_child_id = this.initData.media_account_child;
      this.addForm.gap_ratio = this.initData.gap_ratio;
      this.addForm.brand = this.initData.brand
      this.addForm.os_version = this.initData.os_version
      this.addForm.show_cnt_symbol = this.initData.show_cnt_symbol
      this.addForm.show_cnt = this.initData.show_cnt
      this.addForm.arpu_symbol = this.initData.arpu_symbol
      this.addForm.arpu = this.initData.arpu
      this.addForm.avg_ecpm = this.initData.avg_ecpm
      this.addForm.max_ecpm = this.initData.max_ecpm
      this.addForm.max_ecpm_total = this.initData.max_ecpm_total   
      this.addForm.time_limit = this.initData.time_limit
      this.addForm.paid_amount = this.initData.paid_amount
      this.addForm.widget = this.initData.widget
      this.addForm.id = this.initData.id
      // this.addForm.media_account_name = this.initData.media_account_name
      console.log(this.addForm.os_version)
      console.log(this.addForm.proj_id)
      // this.handleProject()
      // this.changeMedia()
  },
  methods: {
    // 选择项目
    handleProject(e) {
      this.addForm.media_account_id = "";
      this.addForm.media_account_child_id = "";
      this.addForm.media_id = '';
      this.addForm.proj_id = e;
    },
    // 选择媒体
    changeMedia(val) {
      this.addForm.media_account_id = '';
      this.addForm.media_account_child_id = "";
      let dataObj = {
        proj_id: this.addForm.proj_id,
        media_id:val
      }
      getMediaMasterList(dataObj)
        .then((data) => {
          if (data.error_code === 0) {
            this.masterList = data.data;
            console.log('this.masterList',this.masterList);
            
          } else {
            this.masterList = [];
          }
        })
        .catch(() => {
          this.masterList = [];
          this.$message({
            message: "加载媒体失败",
            type: "error",
          });
        });
    },
    // 选择主账号
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
            message: "加载主账号失败",
            type: "error",
          });
        });
    },
    addclick(val) {
      // console.log('val',val)
      console.log('val22',val.media_id,val.media_account_id)
      // 找到匹配的项
            const foundItem = this.masterList.find(item =>
                item.media_id == val.media_id &&
                item.account == val.media_account_id
            );

            // 如果找到了，取出 id 并赋值给 val.media_account_id
            if (foundItem) {
                val.media_account_id = foundItem.id; // 
                console.log('idddd', val.media_account_id);
            } else {
                console.log('wwwww')
            }
          console.log('val', val);
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit("oneEditActivate", val)
        }
      })
    },
    handleCancel() {
      this.$emit("updateAddvisible", false)
      this.$refs.form.resetFields()
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
.tips{
  margin-left: 150px;
}
.tips p{
  margin: 0;
}
.form_input {
  width: 200px;
}
.active{
  margin-top: 30px;
}
.required-star {
  color: red;
}
</style>

