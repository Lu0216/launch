<template>
  <!-- Form -->
  <div class="eldialog">
    <el-dialog
      :visible="dialogFormVisible"
      :title="this.title"
      :before-close="handleCancel"
    >
      <el-form ref="form" :rules="rules" :model="addForm">
        <el-form-item
          :label-width="formLabelWidth"
          label="show_cnt:"
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

        <!-- 新增字段 -->
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
            @change="changeNumber"
          ></el-input-number
          >%
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
      type: Array,
      default: () => {},
    },
  },
  data() {
    return {
      dialogFormVisible: true,
      formLabelWidth: "150px",
      anchorList:[],
      addForm: {
        ids:'',
        show_cnt:'',
        arpu:'',
        show_cnt_symbol:'>=',
        arpu_symbol:'>=',
        gap_ratio: 100,
        avg_ecpm: 0, 
        max_ecpm: 0,
        max_ecpm_total: '',
        time_limit: '10',
        paid_amount: '',
         widget: null,
      },
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
      pageSize:100,
      rules: {
        show_cnt: [
          { required: false, message: '请输入具体数值，保留两位小数', trigger: 'blur' },
          { pattern: /^[0-9]{1,}\.{0,1}[0-9]{0,2}$/,message: '请输入具体数值，保留两位小数', trigger: 'blur' },
        ],
        arpu: [
          { required: false, message: '请输入具体数值，保留两位小数', trigger: 'change' },
          { pattern: /^[0-9]{1,}\.{0,1}[0-9]{0,2}$/,message: '请输入具体数值，保留两位小数', trigger: 'blur' },
        ],
        time_limit: [
          { required: true, message: "请输入计算周期", trigger: "blur" },
        ],
        gap_ratio: [
          { required: true, message: '请输入0-100之间的正整数', trigger: 'blur' },
          { pattern: /^(100|\d{1,2}|\d)$/, message: '请输入0-100之间的正整数', trigger: 'blur' },
        ],
        show_cnt_symbol: [{ required: true, message: "请选择运算符", trigger: "change" }],
        arpu_symbol: [{ required: true, message: "请选择运算符", trigger: "change" }],
      },
    };
  },
  mounted() {
    console.log('ffff',this.initData)
    this.addForm.proj_id = this.initData[0].proj_id
  },
  methods: {
    changeNumber(val) {
      if (val == undefined) {
        return this.$message.error("概率不能为空");
      }
    },
    addclick(val) {
      if (val.show_cnt == '' || val.arpu == '') {
        this.$message({
            message: "show_cnt或者arpu不能为空",
            type: "error",
          })
          return
      }

      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit("editActivate",val)
        }
      });
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
.form_input {
  width: 200px;
}
.required-star {
  color: red;
}
</style>
