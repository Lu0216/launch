<template>
  <!-- Form -->
  <div class="eldialog">
    <el-dialog
      :visible="dialogFormVisible"
      :title="this.title"
      width="1900px"
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
        <el-form-item :label-width="formLabelWidth" label="媒体:" prop="media_id">
          <el-select
            filterable
            placeholder="请选择"
            v-model="addForm.media_id"
            @change="changeMedia"
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
            multiple
            placeholder="请选择关联主账号"
            v-model="addForm.media_account_id"
            @change="handleMaster"
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

      <!-- 新增 -->
        <el-form  ref="form_1" :model="accountChildItem" :rules="rules_1" style="width: 100%;"  v-for="(accountChildItem,accountChildIndex) in childGroupList" :key="accountChildIndex">
        <el-form-item

          :label-width="formLabelWidth"
          prop="media_account_child_id"
          :label="accountChildIndex==0?'关联子账号':''"
        >
            <el-select
            multiple
            filterable
            placeholder="请选择"
            v-model="accountChildItem.media_account_child_id"   
          >
            <el-option
              v-for="item in mediaChild"
              :key="item.id"
              :label="item.media_account_child_id"
              :value="item.media_account_child_id"
            >
            </el-option>
          </el-select>
          <el-button v-if="accountChildItem.showAllSelect" @click="allSelect(accountChildIndex)" style="width: 30px;height: 30px; border-radius: 50%;text-align: left;"><span style="margin-right: 40px;display: flex;align-items: center;justify-content: center;padding-bottom: 10px;font-size: 12px;">全选</span></el-button>
          <el-button type="primary" v-else @click="cancelSelect(accountChildIndex)" style="width: 30px;height: 30px; border-radius: 50%;text-align: left;"><span style="margin-right: 40px;display: flex;align-items: center;justify-content: center;padding-bottom: 10px;font-size: 12px;" >取消</span></el-button>
          <i @click="addAccountChild(accountChildIndex)" v-if="childGroupList.length==accountChildIndex+1" class="el-icon-circle-plus"  style="font-size: 30px;color: #02A7F0;margin-left: 20px;margin-bottom: 15px;"></i>
          <i @click="delAccountChild(accountChildIndex)" v-else class="el-icon-remove" style="font-size: 30px;color: #D9001B;margin-left: 20px;margin-bottom: 15px;"></i>
          <i @click="delAccountChild(accountChildIndex)" v-if="(childGroupList.length==accountChildIndex+1)&&accountChildIndex!=0" class="el-icon-remove" style="font-size: 30px;color: #D9001B;margin-left: 20px;margin-bottom: 15px;"></i>
          
        </el-form-item>
        <el-form-item>
        <el-form ref="form_2" :model="groupItem" :rules="rules_2"  v-for="(groupItem,groupIndex) in accountChildItem.formList" :key="groupIndex"  style="display: flex;margin-bottom: 40px; align-items: center;">
          <!-- 关键行为名称 -->
          <el-form-item label-position="top" :label="groupIndex==0?'关键行为名称':''" prop="custom_name">
            <el-input v-model="groupItem.custom_name"
            placeholder="请输入"
            style="width:100px;margin-right: 10px;"
            />
        </el-form-item>
          <!-- 机型 -->
          <el-form-item label-position="top" :label="groupIndex==0?'机型':''"  >
            <el-select 
            style="width: 150px;margin-right: 20px;"
            filterable
            multiple
            collapse-tags
            placeholder="请选择"
             @change="handleBrandSelect(groupItem)"
            v-model="groupItem.brand"
            >
              <el-option
                v-for="item in modelList"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
              <el-option value="all" label="全选">
            </el-option>
            </el-select>
          </el-form-item>
          <!-- 安卓版本 -->
          <el-form-item label-position="top" :label="groupIndex==0?'安卓版本':''">
            <el-select 
            style="width: 100px;margin-right: 20px;"
            filterable
            multiple
            collapse-tags
            placeholder="请选择"
            v-model="groupItem.os_version"
            >
              <el-option
                v-for="item in androidList"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- show_cnt -->
          <el-form-item label-position="top" :label="groupIndex==0?'show_cnt符号':''">
            <el-select 
            style="width: 100px;margin-left: 5px;"
            filterable
            placeholder="请选择"
            v-model="groupItem.show_cnt_symbol"
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
          <el-form-item  prop="show_cnt" label-position="top" :label="groupIndex==0?'show_cnt':''">
            <el-input v-model="groupItem.show_cnt" style="width: 120px;margin-left: 5px;" placeholder="请输入数字，保留两位小数"></el-input>
          </el-form-item>
          <!-- arpu -->
          <el-form-item  label-position="top" :label="groupIndex==0?'arpu符号':''">
            <el-select 
            style="width: 100px;margin-left: 15px;"
            filterable
            placeholder="请选择"
            v-model="groupItem.arpu_symbol"
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
          <el-form-item  prop="arpu"  label-position="top" :label="groupIndex==0?'arpu':''">
            <el-input v-model="groupItem.arpu" style="width: 120px;margin-left: 5px;" placeholder="请输入数字，保留两位小数"></el-input>
          </el-form-item>
          <!-- 平均ecpm -->
          <el-form-item  prop="avg_ecpm"  label-position="top" :label="groupIndex==0?'平均ecpm':''">
            <el-input v-model="groupItem.avg_ecpm" style="width: 100px;margin-left: 5px;" placeholder="请输入平均ecpm"></el-input>
          </el-form-item>
          <!-- 最大ecpm及次数 -->
          <el-form-item prop="max_ecpm" label-position="top" :label="groupIndex==0?'最大ecpm':''">
            <el-input v-model="groupItem.max_ecpm" style="width: 100px;margin-left: 5px;" placeholder="请输入最大ecpm"></el-input>
          </el-form-item>
          <!-- 最大ecpm及次数 -->
          <el-form-item prop="max_ecpm_total" label-position="top" :label="groupIndex==0?'最大ecpm次数':''">
            <el-input v-model="groupItem.max_ecpm_total" style="width: 100px;margin-left: 5px;" placeholder="请输入次数"></el-input>
          </el-form-item>
          <!-- 计算周期 -->
          <el-form-item prop="time_limit" :rules="{required:true,message:'计算周期不能为空',trigger:'blur'}" label-position="top" :label="groupIndex==0?'计算周期':''">
            <!-- <el-input-number v-model="groupItem.time_limit" style="width: 120px;margin-left: 5px;" :min="1" :max="72" @change="changePeriod" > </el-input-number> -->
            <el-input v-model="groupItem.time_limit" style="width: 120px;margin-left: 5px;" placeholder="请输入计算周期"></el-input>
          </el-form-item>
          <!-- 付款金额 -->
          <el-form-item prop="paid_amount" label-position="top" :label="groupIndex==0?'付款金额':''">
            <el-input v-model="groupItem.paid_amount" style="width: 100px;margin-left: 5px;" placeholder="请输入付款金额"></el-input>
          </el-form-item>
          <!-- 安卓版本 -->
          <el-form-item label-position="top" :label="groupIndex==0?'widget':''">
            <el-select 
            style="width: 120px;margin-left:10px;"
            filterable
            placeholder="请选择widget行为"
            v-model="groupItem.widget"
            >
              <el-option
                v-for="item in widgetList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 概率 -->
          <el-form-item  :rules="{required:true,message:'概率不能为空',trigger:'change'}" label-position="top" :label="groupIndex==0?'概率':''">
            <el-input-number
            v-model="groupItem.gap_ratio"
            style="width: 150px;margin-left: 5px;"
            :min="0"
            :max="100"
            @change="changeNumber"
            >
            </el-input-number>%
          </el-form-item>
          <i v-if="groupIndex+1==accountChildItem.formList.length" @click="addDefaultItem(accountChildIndex)" :class="['el-icon-circle-plus',groupIndex==0?'active':'']"  style="font-size: 30px;color: #02A7F0;margin-left: 20px;margin-bottom: 15px;"></i>
          <i v-else @click="delGroupItem(accountChildIndex,groupIndex)" class="el-icon-remove" style="font-size: 30px;color: #D9001B;margin-left: 20px;margin-bottom: 15px;"></i>
          <i v-if="groupIndex+1==accountChildItem.formList.length&&groupIndex!=0" @click="delGroupItem(accountChildIndex,groupIndex)" class="el-icon-remove" style="font-size: 30px;color: #D9001B;margin-left: 20px;margin-bottom: 15px;"></i>
        </el-form>
      </el-form-item>
      </el-form>
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
    projectsList: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: () => "未知",
    },
    mediaList:{
      type:Array,
      default: () => []
    },
    initData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isFirst: true,
      // 机型和安卓版本（静态数据）
      modelList:['OPPO','HUAWEI','HONOR','VIVO','XIAOMI','Tianyi','Hinova','NZONE','PTAC','WIKO','MEIZU','samsung','UNICOMVSENS','TDTech','Liantong','JRD','CMDC','其他'],
      androidList:['9','10','11','12','13','14','15'],
      showcntList:[
        {
          id:1,
          name:'>='
        },
        {
          id:2,
          name:'不配置项'
        },
      ],
      arpuList:[
        {
          id:1,
          name:'>='
        },
        {
          id:2,
          name:'不配置项'
        },
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
      
      childGroupList:[
        {
          showAllSelect:true,
          media_account_child_id: [],
          formList:[
            {
              gap_ratio: 100,
              brand: [],
              os_version:[],
              show_cnt_symbol: '>=',
              show_cnt: '',
              arpu_symbol: '>=',
              arpu: '',
              custom_name: '',
              avg_ecpm: 0, 
              max_ecpm: 0,
              max_ecpm_total: '',
              time_limit: '10',
              paid_amount: '',
              widget: null,
            }
          ],
        }
      ],
      
      dialogFormVisible: true,
      formLabelWidth: "150px",
      masterList: [],
      mediaChild: [],
      anchorList:[],
      addForm: {
        // id:'',
        proj_id: "",
        media_account_child_id: "",
        media_account_id: [],
        media_account_name:'',
        media_id:"",
        brand:[],
        os_version:[],
        gap_ratio:100,
        show_cnt_symbol: '>=',
        show_cnt: '',
        arpu_symbol: '>=',
        arpu: '',
        custom_name: '',
        avg_ecpm: 0, 
        max_ecpm: 0,
        max_ecpm_total: '',
        time_limit: '10',
        paid_amount: '',
        widget: null,
      },
      rules: {
        proj_id: [{ required: true, message: "请选择项目", trigger: "change" }],
        media_account_id: [
          { required: true, message: "请选择关联主账号", trigger: "change" },
        ],
        media_account_child_id: [
          { required: true, message: "请选择关联子账号", trigger: "change" },
        ],
        media_id: [
          { required: true, message: "请选择媒体", trigger: "change" },
        ],
      },
      rules_1:{
        media_account_child_id: [
          { required: true, message: "请选择关联子账号", trigger: "change" },
        ]
      },
      rules_2:{
        custom_name: [
          { required: true, message: "请输入关键行为名称", trigger: "blur" },
        ],
        show_cnt: [
          { required: false, message: '请输入具体数值，保留两位小数', trigger: 'blur' },
          { pattern: /^[0-9]{1,}\.{0,1}[0-9]{0,2}$/,message: '请输入具体数值，保留两位小数', trigger: 'blur' },
        ],
        arpu: [
          { required: false, message: '请输入具体数值，保留两位小数', trigger: 'change' },
          { pattern: /^[0-9]{1,}\.{0,1}[0-9]{0,2}$/,message: '请输入具体数值，保留两位小数', trigger: 'blur' },
        ],
      },
    };
  },
  created() {
  },
  methods: {
    allSelect(index){
      console.log(this.mediaChild);
      this.childGroupList[index].showAllSelect=false
      this.childGroupList[index].media_account_child_id = this.mediaChild.map(item=>item.media_account_child_id)
    },
    cancelSelect(index){
      this.childGroupList[index].showAllSelect=true
      this.childGroupList[index].media_account_child_id=[]
    },

    addAccountChild(index){
      let defaultChildItem={
        media_account_child_id: "",
        showAllSelect:true,
        formList:[{
          gap_ratio: 100,
          brand:[],
          os_version:[],
          show_cnt_symbol: '>=',
          show_cnt: '',
          arpu_symbol: '>=',
          arpu: '',
          custom_name: '',
          avg_ecpm: 0, 
          max_ecpm: 0,
          max_ecpm_total: '',
          time_limit: '10',
          paid_amount: '',
          widget: null,
        },]
      }
      this.childGroupList.push(defaultChildItem)
   
    },
    delAccountChild(index){
 
      this.childGroupList.splice(index,1)
    },
    // 点击+增加一组基础表单
    addDefaultItem(i){
      let defaultItem={
          gap_ratio: 100,
          brand:'',
          os_version:[],
          show_cnt_symbol: '>=',
          show_cnt: '',
          arpu_symbol: '>=',
          arpu: '',
          custom_name: '',
          avg_ecpm: 0, 
          max_ecpm: 0,
          max_ecpm_total: '',
          time_limit: '10',
          paid_amount: '',
          widget: null,
        }

        this.childGroupList[i].formList.push(defaultItem)
      
      console.log(this.childGroupList);
    },
    delGroupItem(i,index){

      this.childGroupList[i].formList.splice(index,1)
    },
    // 选择项目
    handleProject(e) {
      this.addForm.media_account_id = []
      this.addForm.media_account_child_id = "";
      this.addForm.media_id = '';
      this.addForm.proj_id = e;
    },
    // 选择媒体
    changeMedia(val){
      this.addForm.media_account_id = []
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
      this.addForm.media_account_child_id = ""
      getMediaChildList({ account_id: e.join(',') })
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
    changeNumber(val) {
      console.log(val);
      if (val == undefined) {
        return this.$message.error("概率不能为空");
      }
    },
    // changePeriod(val) {
    //   console.log(val);
    //   if (val == undefined) {
    //     return this.$message.error("计算周期不能为空");
    //   }
    // },
    handleBrandSelect(groupItem) {
      const hasAll = groupItem.brand.includes('all')
      const allValues = this.modelList
      // 选择全选
      if (hasAll) {
        if (this.isFirst) {
          groupItem.brand = this.modelList
          this.isFirst = false
        } else {
          groupItem.brand = []
          this.isFirst = true
        }
        
      } 
      // 取消全选或手动全选
      else {
        const isAllSelected = allValues.every(val => 
          groupItem.brand.includes(val)
        )
        groupItem.brand = isAllSelected ? [...allValues] : groupItem.brand
      }
    },
    addclick(val) {
      // 验证机型版本
      this.childGroupList.forEach(item => {
        item.formList.forEach(item1 => {
          if (item1.brand !== '' && item1.os_version === '') {
            this.$message({ message: '请同时填写机型和安卓版本', type: 'warning' })
            return
          }
          if (item1.brand === '' && item1.os_version !== '') {
            this.$message({ message: '请同时填写机型和安卓版本', type: 'warning' })
            return
          }
        })
      })

      this.$refs.form.validate((valid) => {
        if (valid) {
          // 最终提交的数据集合
          const submitData = []

          // 遍历每个子账号组
          this.childGroupList.forEach(childGroup => {
            // 遍历该组下的每个表单项
            childGroup.formList.forEach(formItem => {
              // 合并公共字段 + 子账号数组 + 表单项
              submitData.push({
                proj_id: this.addForm.proj_id,         // 公共字段：项目
                media_id: this.addForm.media_id,       // 公共字段：媒体
                media_account_id: this.addForm.media_account_id, // 公共字段：主账号
                media_account_child_id: childGroup.media_account_child_id, // 整个子账号数组
                ...formItem                            // 表单项数据
              })
            })
          })

          console.log('uniqueItems',submitData)
          
          this.$emit("saveActivate", submitData)
        }
      })
    },
    handleCancel() {
      this.$emit("updateAddvisible", false);
      this.$refs.form.resetFields();
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
</style>


