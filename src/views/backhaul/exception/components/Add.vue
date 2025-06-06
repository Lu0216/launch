<template>
  <!-- Form -->
  <div class="eldialog">
    <el-dialog
      :visible="dialogFormVisible"
      :title="this.title"
      width="850px"
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
            :disabled="this.title == '编辑'"
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
          v-if="this.title !== '编辑'"
            filterable
            multiple
            placeholder="请选择"
            v-model="addForm.media_account_id"
            @change="handleMaster"
            :disabled="this.title == '编辑'"
          >
            <el-option
              v-for="item in masterList"
              :key="item.id"
              :label="item.account"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <el-select
          v-else
            filterable
            placeholder="请选择"
            v-model="addForm.media_account_name"
            disabled
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
      <div v-if="this.title=='编辑'">
        <el-form-item
          :label-width="formLabelWidth"
          label="关联子账号"
          prop="media_account_child_id"
        >
            <el-select
            filterable
            placeholder="请选择"
            v-model="addForm.media_account_child_id"
            :disabled="this.title == '编辑'"
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
          
        >
          <el-select
            filterable
            placeholder="请选择"
            v-model="addForm.brand"

            :disabled="this.title == '编辑'"
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
         
        >
          <el-select
            :multiple="this.title!='编辑'"
            filterable
            placeholder="请选择"
            v-model="addForm.os_version"
            :disabled="this.title == '编辑'"
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
        <el-form-item :label-width="formLabelWidth" label="概率:" prop="ratio">
          <el-input-number
            v-model="addForm.ratio"
            :min="0"
            :max="100"
            @change="changeNumber"
          ></el-input-number
          >%
        </el-form-item>
      </div>

      <!-- 新增 -->
        <el-form v-if ="title==='新增'"  ref="form_1" :model="accountChildItem" :rules="rules_1" style="width: 100%;"  v-for="(accountChildItem,accountChildIndex) in childGroupList" :key="accountChildIndex">
        <el-form-item

          :label-width="formLabelWidth"
          prop="media_account_child_id"
          :label="accountChildIndex==0?'关联子账号':''"
        >
            <el-select
            :multiple="accountChildIndex.media_account_child_id!='all'"
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
        <el-form ref="form_2" :model="groupItem"  v-for="(groupItem,groupIndex) in accountChildItem.formList" :key="groupIndex"  style="display: flex;margin-bottom: 40px; align-items: center;">
          <!-- 机型 -->
          <el-form-item label-position="top" :label="groupIndex==0?'机型':''" style="margin-left: 80px;" >
            <el-select 
            style="width: 100px;margin-right: 20px;"
            filterable
            multiple
            collapse-tags
            @change="handleBrandSelect(groupItem)"
            placeholder="请选择"
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
          <!-- 激活回传锚点及运算符 -->
          <el-form-item :rules="{required:true,message:'运算符不能为空',trigger:'blur'}" label-position="top" :label="groupIndex==0?'激活回传锚点及运算符':''">
            <el-select 
            style="width: 80px;margin-right: 20px;"
            filterable
            placeholder="请选择"
            v-model="groupItem.symbol"
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
            <el-select 
            style="width: 100px;margin-right: 20px;"
            filterable
            placeholder="请选择"
            v-model="groupItem.anchor_id"
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
          <!-- 概率 -->
          <el-form-item  :rules="{required:true,message:'概率不能为空',trigger:'change'}" label-position="top" :label="groupIndex==0?'概率':''">
            <el-input-number
            v-model="groupItem.ratio"
            style="width: 150px;"
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
import { getAnchorByProj } from '@/api/anchor'
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
    title: {
      type: String,
      default: () => "未知",
    },
    initData: {
      type: Object,
      default: () => {},
    },
  },
  // computed:{
  //   visible:{
  //     get() {
  //       return this.dialogFormVisible
  //     },
  //     set(val){
  //       this.$emit('updateAddvisible',val)
  //     }
  //   }
  // },
  // watch: {
  //   dialogFormVisible(newValue,oldValue){
  //     this.addForm={
  //       proj_id: '',
  //       media_account_id: '',
  //       media_account_child: '',
  //       ratio:100,
  //     }
  //     if(this.$refs.form){
  //       this.$refs.form.resetFields()
  //     }
  //   }
  // },
  data() {
    return {
      isFirst: true,
      // 机型和安卓版本（静态数据）
      modelList:['OPPO','HUAWEI','HONOR','VIVO','XIAOMI','Tianyi','Hinova','NZONE','PTAC','WIKO','MEIZU','samsung','UNICOMVSENS','TDTech','Liantong','JRD','CMDC','其他'],
      androidList:['9','10','11','12','13','14','15'],
      
      
      childGroupList:[
        {
          showAllSelect:true,
          media_account_child_id: [],
          formList:[
            {
              ratio: 100,
              symbol:'',
              brand:'',
              os_version:[],
              anchor_id:""
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
        id:'',
        proj_id: "",
        media_account_child_id: "",
        media_account_id: [],
        media_account_name:'',
        media_id:"",
        symbol:'',
        brand:'',
        os_version:[],
        ratio:100,
        anchor_id:""
      },
      rules: {
        proj_id: [{ required: true, message: "请选择项目", trigger: "change" }],
        media_account_id: [
          { required: true, message: "请选择关联主账号", trigger: "change" },
        ],
        media_account_child_id: [
          { required: true, message: "请选择关联子账号", trigger: "change" },
        ]
      },
      rules_1:{
        media_account_child_id: [
          { required: true, message: "请选择关联子账号", trigger: "change" },
        ]
      },
    //   rules_2:{
    //     ratio: [{ required: true, message: "请填写概率", trigger: "change" }],
    //     symbol: [{ required: true, message: "运算符不能为空", trigger: "change" }],
    //   }
    };
  },
  created() {
    // console.log(this.initData);
    if (JSON.stringify(this.initData) !== "{}" && this.title == "编辑") {
      console.log(this.initData);
      this.addForm.media_account_child_id = this.initData.media_account_child_id;
      this.addForm.proj_id = this.initData.proj_id;
      this.addForm.media_account_id = this.initData.media_account_id;
      this.addForm.ratio = this.initData.ratio;
      this.addForm.anchor_id = this.initData.anchor_id
      this.addForm.symbol = this.initData.symbol
      this.addForm.brand = this.initData.brand
      this.addForm.os_version = this.initData.os_version
      this.addForm.id = this.initData.id
      this.addForm.media_account_name = this.initData.media_account_name
      console.log(this.addForm.os_version);
      // this.handleProject(this.addForm.proj_id)
    //   console.log(this.addForm.media_account_id);
    //   console.log(this.initData.media_account_id);
        // 获取初始激活锚点
        console.log(this.addForm.proj_id);
        getAnchorByProj({proj_id: this.initData.proj_id}).then((data) => {
            if(data.error_code ===0) {
              this.anchorList = data.data
              console.log(data,'achor');
            }
          }).catch(() => {
            this.$message({
                message: '加载失败',
                type: 'error'
            })
          })
    //       // 获取初始子账号
    //   getMediaChildList({ account_id: this.initData.media_account_id })
    //     .then((data) => {
    //       if (data.error_code === 0) {
    //         this.mediaChild = data.data;
    //       } else {
    //         this.mediaChild = [];
    //       }
    //     })
    //     .catch(() => {
    //       this.mediaChild = [];
    //       this.$message({
    //         message: "加载账号失败",
    //         type: "error",
    //       });
    //     });
    }
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
          ratio: 100,
          symbol:'',
          brand:'',
          os_version:[],
          anchor_id:""
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
          ratio: 100,
          symbol:'',
          brand:'',
          os_version:[],
          anchor_id:""
        }

        this.childGroupList[i].formList.push(defaultItem)
      
      console.log(this.childGroupList);
    },
    delGroupItem(i,index){

      this.childGroupList[i].formList.splice(index,1)
    },
    // 项目关联主账号
    handleProject(e) {
      this.addForm.media_account_id = []
      this.childGroupList.forEach(item=>{
        item.media_account_child_id = []
      })
      // this.addForm.media_account_child.id = "";
      console.log(this.addForm.proj_id);
      // 主账号接口
      console.log(this.addForm.proj_id);
      getMediaMasterList({proj_id:this.addForm.proj_id})//{proj_id:this.addForm.proj_id}
        .then((data) => {
          if (data.error_code === 0) {
            console.log(data);
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
      
        console.log(e,'e');
        getAnchorByProj({proj_id: e}).then((data) => {
            if(data.error_code ===0) {
              console.log(data.data);
              this.anchorList = data.data
            
            }
          }).catch(() => {
            this.$message({
                message: '加载失败',
                type: 'error'
            })
          })
    },
    handleMaster(e) {
      this.addForm.media_account_child_id = ""
      // 获取媒体id
    //   const selectItem = this.masterList.find(item=>item.id==e)
    //   this.addForm.media_id = selectItem.media_id
    //  this.childGroupList.forEach(item=>{
    //   item.media_account_child_id = []
    //   item.showAllSelect=true
    //  })
     
      getMediaChildList({ account_id: e.join(',') })
        .then((data) => {
          console.log(data);
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
    changeNumber(val) {
      console.log(val);
      if (val == undefined) {
        return this.$message.error("概率不能为空");
      }
    },
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
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.title == "新增") {
            // 新增逻辑
            const submitData = []

            // 遍历每个子账号组
            this.childGroupList.forEach(childGroup => {
              // 遍历子账号数组
              childGroup.media_account_child_id.forEach(childId => {
                // 遍历该组下的每个表单项
                childGroup.formList.forEach(formItem => {
                  // 合并公共字段 + 子账号 + 表单项
                  submitData.push({
                  proj_id: this.addForm.proj_id,         // 公共字段：项目
                  media_id: this.addForm.media_id,       // 公共字段：媒体
                  media_account_id: this.addForm.media_account_id, // 公共字段：主账号
                  media_account_child_id: childGroup.media_account_child_id, // 整个子账号数组
                  ...formItem        
                  })
                })
              })
            })

            // 去重逻辑
            const uniqueItems = submitData.filter((item, index, self) =>
              index === self.findIndex(t => (
                t.proj_id === item.proj_id &&
                t.media_account_id === item.media_account_id &&
                t.media_account_child_id === item.media_account_child_id &&
                t.brand === item.brand &&
                t.os_version === item.os_version
              ))
            )

            console.log('最终提交数据', uniqueItems)
            this.$emit("saveActivate", uniqueItems)

          } else {
            // 编辑逻辑保持原样
            this.$emit("oneEditActivate", val)
          }
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
import { validate } from "webpack";
import { valid } from "mockjs";
import { valid } from "mockjs";
import { valid } from "mockjs";
import { valid } from "mockjs";
import { valid } from "mockjs";
import { valid } from "mockjs";

