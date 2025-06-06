<template>
  <!-- Form -->
  <div class="eldialog">
    <el-dialog
      :visible.sync="visible"
      :title="this.title"
      :before-close="handleCancel"
      width="800px"
    >
      <el-form ref="form" :rules="rules" :model="addForm">
        <el-form-item
          :label-width="formLabelWidth"
          label="项目:"
          prop="proj_id"
        >
          <el-select
            filterable
            placeholder="请选择项目"
            v-model="addForm.proj_id"
            @change="handleProject"
            :disabled="this.title == '编辑'"
            style="width:280px;"
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
        <el-form-item :label-width="formLabelWidth" label="媒体:" prop="media_id">
          <el-select
            filterable
            placeholder="请选择"
            v-model="addForm.media_id"
            @change="changeMedia"
            :disabled="this.title == '编辑'"
            style="width:280px;"
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
            :disabled="this.title == '编辑'"
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
          prop="media_account_child"
        >
          <el-select
            filterable
            placeholder="请选择关联子账号"
            v-model="addForm.media_account_child"
            :disabled="this.title == '编辑'"
            style="width:280px;"
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
          label="关键行为类型:"
          prop="custom_type_id"
        >
          <el-select
            filterable
            placeholder="请选择关键行为类型"
            v-model="addForm.custom_type_id"
            style="width:280px;"
            @change="handleCustomType"
          >
            <el-option
              v-for="item in customList"
              :key="item.custom_type_id"
              :label="item.custom_type_name"
              :value="item.custom_type_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="关键行为名称:" prop="custom_name">
          <el-input v-model="addForm.custom_name"
          placeholder="请输入具体内容，不能含有特殊字符"
          style="width:280px"
          />
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="show_cnt:"
        >
          <el-form-item prop="show_cnt_ad_type" style="width:160px;display: inline-block;" v-if="addForm.custom_type_id == 1" >
            <el-select
              filterable
              placeholder="请选择ad_type"
              v-model="addForm.show_cnt_ad_type"
              style="width:150px;"
            >
              <el-option
                v-for="item in ad_typeList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
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
            <!-- <el-input-number
              v-model="addForm.show_cnt"
              :min="0.0"
              :precision="2"
              :step="0.1"
              placeholder="请输入大于0的具体数值，保留两位小数"
              style="width:150px;"
            ></el-input-number> -->
            <el-input v-model="addForm.show_cnt" style="width:200px;" placeholder="请输入数字，保留两位小数"></el-input>
            <!-- <span style="color:#c8c8cd">请输入大于0的具体数值，保留两位小数</span> -->
          </el-form-item>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="平均ecpm:"
        >
          <el-form-item prop="avg_ecpm_ad_type" style="width:160px;display: inline-block;" v-if="addForm.custom_type_id == 1" >
            <el-select
              filterable
              placeholder="请选择ad_type"
              v-model="addForm.avg_ecpm_ad_type"
              style="width:150px;"
            >
              <el-option
                v-for="item in ad_typeList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="avg_ecpm_symbol" style="width:160px;display: inline-block;">
            <el-select
              filterable
              placeholder="请选择运算符"
              v-model="addForm.avg_ecpm_symbol"
              style="width:150px;"
            >
              <el-option
                v-for="item in ecpmList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="avg_ecpm" style="display: inline-block;">
            <!-- <el-input-number
              v-model="addForm.avg_ecpm"
              :min="0.0"
              :precision="2"
              :step="0.1"
              placeholder="请输入大于0的具体数值，保留两位小数"
              style="width:150px;"
            ></el-input-number>
            <span style="color:#c8c8cd">请输入大于0的具体数值，保留两位小数</span> -->
            <el-input v-model="addForm.avg_ecpm" style="width:200px;" placeholder="请输入数字，保留两位小数"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="arpu:"
        >
          <el-form-item prop="arpu_ad_type" style="width:160px;display: inline-block;" v-if="addForm.custom_type_id == 1" >
            <el-select
              filterable
              placeholder="请选择ad_type"
              v-model="addForm.arpu_ad_type"
              style="width:150px;"
            >
              <el-option
                v-for="item in ad_typeList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
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
            <!-- <el-input-number
              v-model="addForm.arpu"
              :min="0.0"
              :precision="2"
              :step="0.1"
              placeholder="请输入大于0的具体数值，保留两位小数"
              style="width:150px;"
            ></el-input-number>
            <span style="color:#c8c8cd">请输入大于0的具体数值，保留两位小数</span> -->
            <el-input v-model="addForm.arpu" style="width:200px;" placeholder="请输入数字，保留两位小数"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="最大ecpm:"
        >
          <el-form-item prop="max_ecpm_ad_type" style="width:160px;display: inline-block;" v-if="addForm.custom_type_id == 1" >
            <el-select
              filterable
              placeholder="请选择ad_type"
              v-model="addForm.max_ecpm_ad_type"
              style="width:150px;"
            >
              <el-option
                v-for="item in ad_typeList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="max_ecpm_symbol" style="width:160px;display: inline-block;">
            <el-select
              filterable
              placeholder="请选择运算符"
              v-model="addForm.max_ecpm_symbol"
              style="width:150px;"
            >
              <el-option
                v-for="item in maxecpmList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="max_ecpm" style="display: inline-block;">
            <!-- <el-input-number
              v-model="addForm.max_ecpm"
              :min="0.0"
              :precision="2"
              :step="0.1"
              placeholder="请输入大于0的具体数值，保留两位小数"
              style="width:150px;"
            ></el-input-number>
            <span style="color:#c8c8cd">请输入大于0的具体数值，保留两位小数</span> -->
            <el-input v-model="addForm.max_ecpm" style="width:200px;" placeholder="请输入数字，保留两位小数"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item
        >
          <el-form-item label="单个UDI的展示广告排名前N的ecpm值必须满足M:" style="margin-bottom:20px;">
          </el-form-item>
          <el-form-item prop="ecpm_ad_type" label="ad_type:" label-width="120px" style="margin-bottom:20px;" v-if="addForm.custom_type_id == 1">
            <el-select
              filterable
              placeholder="请选择ad_type"
              v-model="addForm.ecpm_ad_type"
              style="width:220px;"
            >
              <el-option
                v-for="item in ad_typeList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="top_number" label="N:" label-width="120px" style="display: inline-block;margin-bottom:20px;">
            <el-input v-model="addForm.top_number" style="width:220px;" placeholder="仅支持输入1-20之间的正整数"></el-input>
          </el-form-item>
          <el-form-item label="M:" label-width="120px" style="margin-bottom:20px;">
            <el-form-item prop="ecpm_symbol" style="width:160px;display: inline-block;">
              <el-select
                filterable
                placeholder="请选择运算符"
                v-model="addForm.ecpm_symbol"
                style="width:150px;"
              >
                <el-option
                v-for="item in ecpm_symbol_List"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="ecpm" style="display: inline-block;margin-bottom:10px;">
              <el-input v-model="addForm.ecpm" style="width:240px;" placeholder="请输入数字，保留两位小数"></el-input>
            </el-form-item>
          </el-form-item>
           <el-form-item label="累计提现金额:" label-width="120px">
            <el-form-item prop="cash_symbol" style="width:160px;display: inline-block;">
              <el-select
                filterable
                placeholder="请选择运算符"
                v-model="addForm.cash_symbol"
                style="width:150px;"
              >
                <el-option
                v-for="item in cash_symbol_List"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="cash" style="display: inline-block;margin-bottom:10px;">
              <el-input  v-model.number="addForm.cash" style="width:240px;" placeholder="请输入正整数，单位为分"></el-input>
            </el-form-item>
          </el-form-item>
           <el-form-item label="完成关卡数:" label-width="120px">
            <el-form-item prop="game_level_symbol" style="width:160px;display: inline-block;">
              <el-select
                filterable
                placeholder="请选择运算符"
                v-model="addForm.game_level_symbol"
                style="width:150px;"
              >
                <el-option
                v-for="item in cash_symbol_List"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="game_level" style="display: inline-block;margin-bottom:10px;">
              <el-input  v-model.number="addForm.game_level" style="width:240px;" placeholder="请输入正整数"></el-input>
            </el-form-item>
          </el-form-item>
        </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="ad_type:"
          prop="ad_type"
          v-if="addForm.custom_type_id != 1"
        >
          <el-select
            filterable
            placeholder="请选择ad_type"
            v-model="addForm.ad_type"
            style="width:280px;"
          >
            <el-option
              v-for="item in ad_typeList2"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="ad_pos:" v-if="addForm.custom_type_id == 5" prop="ad_pos" style="display: inline-block;">
            <el-input v-model="addForm.ad_pos" style="width:300px;" placeholder="请输入广告位，多个广告位用英文下,间隔"></el-input>
          </el-form-item>
        <el-form-item
          :label-width="formLabelWidth"
          label="时间限制:"
          prop="time_limit"
        >
          <el-input-number
              v-model="addForm.time_limit"
              :min="1"
              :max="24"
              :precision="1"
              :step="0.1"
              placeholder="保留一位小数，范围限制在大于等于1，小于等于24"
              style="width:150px;"
            ></el-input-number>
            <span style="color:#c8c8cd">保留一位小数，范围限制在大于等于1，小于等于24</span>
        </el-form-item>
        <el-form-item prop="gap_ratio" label="gap:" label-width="120px" style="display: inline-block;margin-bottom:20px;">
            <el-input v-model="addForm.gap_ratio" style="width:220px;" placeholder="仅支持输入0-100之间的整数"></el-input>
            <span>%</span>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" :loading="addloading" @click="addclick(addForm)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getMediaMasterList, getMediaChildList } from "@/api/dynamic/public";

export default {
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    projectList: {
      type: Array,
      default: () => [],
    },
    mediaList:{
      type:Array,
      default: () => []
    },
    customList: {
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
    addloading:{
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
        this.$emit('close',val)
      }
    }
  },
  watch: {
    // dialogFormVisible(newValue,oldValue){
    //   if(this.$refs.form){
    //     this.$refs.form.resetFields()
    //   }
    // }
  },
  data() {
    return {
      // dialogFormVisible: true,
      formLabelWidth: "120px",
      masterList: [],
      mediaChild: [],
      addForm: {
        id:'',
        proj_id:'',
        media_id:'',
        media_account_id:'',
        media_account_child:'',
        custom_type_id:'',
        custom_name:'',
        show_cnt:'',
        avg_ecpm:'',
        max_ecpm:'',
        ecpm:'',
        top_number:'',
        arpu:'',
        cash: '',
        game_level: '',
        show_cnt_symbol:'',
        avg_ecpm_symbol:'',
        max_ecpm_symbol:'',
        ecpm_symbol:'',
        arpu_symbol:'',
        cash_symbol: '',
        game_level_symbol: '',
        ad_type:'',
        ad_pos: '',
        time_limit:'',
        show_cnt_ad_type:'',
        avg_ecpm_ad_type:'',
        arpu_ad_type:'',
        max_ecpm_ad_type:'',
        ecpm_ad_type:'',
        gap_ratio:'',
      },
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
      ecpmList:[
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
      maxecpmList:[
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
      ecpm_symbol_List:[
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
       cash_symbol_List:[
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
      ad_typeList:[
        {
          id: 0,
          name:''
        },
        {
          id:1,
          name:'all'
        },
        {
          id:2,
          name:'video'
        },{
          id:3,
          name:'chaping'
        }
      ],
      ad_typeList2:[
        {
          id:1,
          name:'all'
        },
        {
          id:2,
          name:'video'
        },{
          id:3,
          name:'chaping'
        }
      ],
      rules: {
        proj_id: [{ required: true, message: "请选择项目", trigger: "change" }],
        media_id: [
          { required: true, message: '请选择媒体', trigger: 'change' }
        ],
        media_account_id: [
          { required: true, message: "请选择关联主账号", trigger: "change" },
        ],
        media_account_child: [
          { required: true, message: "请选择关联子账号", trigger: "change" },
        ],
        custom_type_id: [{ required: true, message: "请选择关键行为类型", trigger: "change" }],
        custom_name: [
          { required: true, message: '关键行为名称不能为空', trigger: 'blur' },
          { pattern: /^[^\,，。；：\s]+$/,message: '不能含有特殊字符', trigger: 'blur' },
        ],
        // show_cnt_symbol: [{ required: true, message: "请选择运算符", trigger: "change" }],
        show_cnt: [
          { required: false, message: '请输入具体数值，保留两位小数', trigger: 'blur' },
          { pattern: /^[0-9]{1,}\.{0,1}[0-9]{0,2}$/,message: '请输入具体数值，保留两位小数', trigger: 'blur' },
        ],
        // avg_ecpm_symbol: [{ required: true, message: "请选择运算符", trigger: "change" }],
        avg_ecpm: [
          { required: false, message: '请输入具体数值，保留两位小数', trigger: 'blur' },
          { pattern: /^[0-9]{1,}\.{0,1}[0-9]{0,2}$/,message: '请输入具体数值，保留两位小数', trigger: 'blur' },
        ],
        // arpu_symbol: [{ required: true, message: "请选择运算符", trigger: "change" }],
        arpu: [
          { required: false, message: '请输入具体数值，保留两位小数', trigger: 'change' },
          { pattern: /^[0-9]{1,}\.{0,1}[0-9]{0,2}$/,message: '请输入具体数值，保留两位小数', trigger: 'blur' },
        ],
        // max_ecpm_symbol: [{ required: true, message: "请选择运算符", trigger: "change" }],
        max_ecpm: [
          { required: false, message: '请输入具体数值，保留两位小数', trigger: 'blur' },
          { pattern: /^[0-9]{1,}\.{0,1}[0-9]{0,2}$/,message: '请输入具体数值，保留两位小数', trigger: 'blur' },
        ],
        top_number: [
          { required: false, message: '请输入1-20之间的正整数', trigger: 'blur' },
          { pattern: /^((1\d?)|([1-9]?)|(20))$/,message: '请输入1-20之间的正整数', trigger: 'blur' },
        ],
        gap_ratio: [
          { required: true, message: '请输入0-100之间的正整数', trigger: 'blur' },
          { pattern: /^(100|\d{1,2}|\d)$/, message: '请输入0-100之间的正整数', trigger: 'blur' },
        ],
        ecpm:[
          { required: false, message: '请输入大于0的具体数值，保留两位小数', trigger: 'blur' },
          { pattern: /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/,message: '请输入大于0的具体数值，保留两位小数', trigger: 'blur' },
        ],
        cash:[
          { required: false, message: '请输入大于0的正整数', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/,message: '请输入大于0的正整数', trigger: 'blur' },
        ],
        game_level:[
          { required: false, message: '请输入大于0的正整数', trigger: 'blur' },
          { pattern: /^[1-9]\d*$/,message: '请输入大于0的正整数', trigger: 'blur' },
        ],

        ad_type: [
          { required: true, message: '请选择ad_type', trigger: 'change' }
        ],
        time_limit: [
          { required: true, message: '时间限制不能为空', trigger: 'blur' },
        ],
      },
    };
  },
  created() {
    if (JSON.stringify(this.initData) !== "{}" && this.title == "编辑") {
      this.addForm.id = this.initData.id
      this.addForm.proj_id = this.initData.proj_id;
      this.addForm.media_id = this.initData.media_id;
      this.addForm.media_account_id = this.initData.media_account;
      this.addForm.media_account_child = this.initData.media_account_child;
      this.addForm.custom_type_id = this.initData.custom_type_id;
      this.addForm.custom_name = this.initData.custom_name;
      this.addForm.gap_ratio = this.initData.gap_ratio;

      this.addForm.show_cnt = this.initData.show_cnt == null ? '':this.initData.show_cnt;
      this.addForm.avg_ecpm = this.initData.avg_ecpm == null ? '':this.initData.avg_ecpm;
      this.addForm.max_ecpm = this.initData.max_ecpm == null ? '':this.initData.max_ecpm;
      this.addForm.arpu = this.initData.arpu == null ? '':this.initData.arpu;
      this.addForm.ecpm = this.initData.ecpm == null ? '':this.initData.ecpm;
      this.addForm.cash = this.initData.cash ? parseInt(this.initData.cash) :'';
      this.addForm.game_level = this.initData.game_level ? parseInt(this.initData.game_level) :'';
      this.addForm.top_number = this.initData.top_number == null ? '':this.initData.top_number;

      this.addForm.show_cnt_symbol = this.initData.show_cnt_symbol == null ?'':this.initData.show_cnt_symbol;
      this.addForm.avg_ecpm_symbol = this.initData.avg_ecpm_symbol == null ?'':this.initData.avg_ecpm_symbol;
      this.addForm.max_ecpm_symbol = this.initData.max_ecpm_symbol == null ?'':this.initData.max_ecpm_symbol;
      this.addForm.cash_symbol = this.initData.cash_symbol == null ?'':this.initData.cash_symbol;
      this.addForm.game_level_symbol = this.initData.game_level_symbol == null ?'':this.initData.game_level_symbol;
      this.addForm.arpu_symbol = this.initData.arpu_symbol == null ?'':this.initData.arpu_symbol;
      this.addForm.ecpm_symbol = this.initData.ecpm_symbol == null ?'':this.initData.ecpm_symbol;


      this.addForm.ad_pos = this.initData.ad_pos;
      this.addForm.time_limit = this.initData.time_limit;
      this.addForm.ad_type = this.initData.ad_type;
      this.addForm.show_cnt_ad_type = this.initData.show_cnt_ad_type;
      this.addForm.avg_ecpm_ad_type = this.initData.avg_ecpm_ad_type;
      this.addForm.max_ecpm_ad_type = this.initData.max_ecpm_ad_type;
      this.addForm.arpu_ad_type = this.initData.arpu_ad_type;
      this.addForm.ecpm_ad_type = this.initData.ecpm_ad_type;
    }
  },
  methods: {
    // 选择项目
    handleProject(e) {
      this.addForm.media_account_id = "";
      this.addForm.media_account_child = "";
      this.addForm.media_id = '';
      this.addForm.proj_id = e;
    },
    // 选择媒体
    changeMedia(val){
      this.addForm.media_account_id = '';
      this.addForm.media_account_child = "";
      let dataObj = {
        proj_id: this.addForm.proj_id,
        media_id:val
      }
      getMediaMasterList(dataObj)
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
            message: "加载媒体失败",
            type: "error",
          });
        });
    },
    // 选择主账号
    handleMaster(e) {
      this.addForm.media_account_child = "";
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
      this.$refs.form.validate((valid) => {
        console.log(val)
        if(valid) {
          if((val.arpu == '' && val.arpu_symbol == ''
        && val.max_ecpm == '' && val.max_ecpm_symbol == ''
        && val.show_cnt == '' && val.show_cnt_symbol == ''
        && val.avg_ecpm == '' && val.avg_ecpm_symbol == ''
        && val.cash == '' && val.cash_symbol == ''
        && val.game_level == '' && val.game_level_symbol == ''
        && val.ecpm == '' && val.ecpm_symbol == ''&& val.top_number == ''
        && val.show_cnt_ad_type == ''&& val.avg_ecpm_ad_type == ''&& val.arpu_ad_type == ''&& val.max_ecpm_ad_type == ''&& val.ecpm_ad_type == '')
        || (val.arpu !== '' && val.arpu_symbol !== ''
        && val.max_ecpm !== '' && val.max_ecpm_symbol !== ''
        && val.show_cnt !== '' && val.show_cnt_symbol !== ''
        && val.avg_ecpm !== '' && val.avg_ecpm_symbol !== ''
        && val.cash !== '' && val.cash_symbol !== ''
        && val.game_level !== '' && val.game_level_symbol !== ''
        && val.ecpm !== '' && val.ecpm_symbol !== '' && val.top_number !== ''
        && val.show_cnt_ad_type !== ''&& val.avg_ecpm_ad_type !== ''&& val.arpu_ad_type !== ''&& val.max_ecpm_ad_type !== ''&& val.ecpm_ad_type !== '')){
          this.$emit("saveAdd", val);
        } else if(this.addForm.custom_type_id == 1){
          if((val.arpu !== '' && (val.arpu_symbol == '' || val.arpu_ad_type == '' )) || (val.arpu == '' && (val.arpu_symbol !== '' || val.arpu_ad_type !== '' ))) {
            return this.$message.error('arpu字段的所有配置项必须同时配置！')
          }else if((val.max_ecpm !== '' && (val.max_ecpm_symbol == '' || val.max_ecpm_ad_type == '')) || (val.max_ecpm == '' && (val.max_ecpm_symbol !== '' || val.max_ecpm_ad_type !== ''))){
            return this.$message.error('最大ecpm字段的所有配置项必须同时配置！')
          }else if((val.show_cnt !== '' && (val.show_cnt_symbol == '' || val.show_cnt_ad_type == '')) || (val.show_cnt == '' && (val.show_cnt_symbol !== '' || val.show_cnt_ad_type !== ''))){
            return this.$message.error('show_cnt字段的所有配置项必须同时配置！')
          }else if((val.avg_ecpm !== '' && (val.avg_ecpm_symbol == '' || val.avg_ecpm_ad_type == '')) || (val.avg_ecpm == '' && (val.avg_ecpm_symbol !== '' || val.avg_ecpm_ad_type !== ''))){
            return this.$message.error('平均ecpm字段的所有配置项必须同时配置！')
          }else if((val.cash !== '' && val.cash_symbol == '') || (val.cash == '' &&val.cash_symbol !== '')){
            return this.$message.error('累计提现金额，其中一项不为空，另外一项也不能为空')
          }else if((val.game_level !== '' && val.game_level_symbol == '') || (val.game_level == '' &&val.game_level_symbol !== '')){
            return this.$message.error('完成关卡数，其中一项不为空，另外一项也不能为空')
          }else if((val.top_number !== '' && (val.ecpm == '' || val.ecpm_symbol == '' || val.ecpm_ad_type == '')) || (val.top_number == '' && (val.ecpm !== '' || val.ecpm_symbol !== '' || val.ecpm_ad_type !== ''))){
            return this.$message.error('单个UDI的展示广告排名前N的ecpm值必须满足M字段的所有配置项必须同时配置！')
          }else {
            this.$emit("saveAdd", val);
          }
        }else{
          if((val.arpu !== '' && val.arpu_symbol == '') || (val.arpu == '' &&val.arpu_symbol !== '')) {
            return this.$message.error('arpu，其中一项不为空，另外一项也不能为空')
          }else if((val.max_ecpm !== '' && val.max_ecpm_symbol == '') || (val.max_ecpm == '' &&val.max_ecpm_symbol !== '')){
            return this.$message.error('最大ecpm，其中一项不为空，另外一项也不能为空')
          }else if((val.show_cnt !== '' && val.show_cnt_symbol == '') || (val.show_cnt == '' &&val.show_cnt_symbol !== '')){
            return this.$message.error('show_cnt，其中一项不为空，另外一项也不能为空')
          }else if((val.avg_ecpm !== '' && val.avg_ecpm_symbol == '') || (val.avg_ecpm == '' &&val.avg_ecpm_symbol !== '')){
            return this.$message.error('平均ecpm，其中一项不为空，另外一项也不能为空')
          }else if((val.cash !== '' && val.cash_symbol == '') || (val.cash == '' &&val.cash_symbol !== '')){
            return this.$message.error('累计提现金额，其中一项不为空，另外一项也不能为空')
          }else if((val.game_level !== '' && val.game_level_symbol == '') || (val.game_level == '' &&val.game_level_symbol !== '')){
            return this.$message.error('完成关卡数，其中一项不为空，另外一项也不能为空')
          }else if((val.top_number !== '' && (val.ecpm == '' || val.ecpm_symbol == '')) || (val.top_number == '' && (val.ecpm !== '' || val.ecpm_symbol !== ''))){
            return this.$message.error('单个UDI的展示广告排名前N的ecpm值必须满足M，N不为空，M也不能为空')
          }else {
            this.$emit("saveAdd", val);
          }
        }
        }
      })
    },
    handleCancel() {
      this.$emit("close", false);
      this.$refs.form.resetFields();
    },
    handleCustomType(e){
      this.addForm.ad_type = ''
      if(e != '1'){
        this.addForm.show_cnt_ad_type = '';
        this.addForm.avg_ecpm_ad_type = '';
        this.addForm.arpu_ad_type = '';
        this.addForm.max_ecpm_ad_type = '';
        this.addForm.ecpm_ad_type = '';
      }
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
</style>
