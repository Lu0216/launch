<template>
  <div class="income_div">
    <div class="income_header">
     <span  class="adname">代理：</span>
      <el-select
        v-model="listQuery.agent_id"
        clearable
        class="filter-item select-item"
        filterable
        placeholder="请选择代理"
        @change="handleFilter">
        <el-option v-for="(item) in agentList" :key="item.id" :label="item.short_name" :value="item.id"/>
      </el-select>
       <span  class="adname">媒体：</span>
      <el-select
        v-model="listQuery.media_id"
         clearable
        class="filter-item select-item"
        filterable
        placeholder="请选择媒体"
        @change="handleFilter">
        <el-option v-for="(item) in mediaList" :key="item.id" :label="item.name_cn" :value="item.id"/>
      </el-select>
       <span  class="adname">项目：</span>
      <el-select
        v-model="listQuery.proj_id"
         clearable
        class="filter-item select-item"
        filterable
        placeholder="请选择项目"
        @change="handleFilter">
        <el-option v-for="(item) in projectList" :key="item.id" :label="item.app_name" :value="item.id"/>
      </el-select>
        <el-button class="add_income" type="primary" icon="el-icon-edit" @click="open">添加</el-button>
    </div>
     <el-card shadow="never">
      <TableColumns
        :dataSource="list"
        :total="total"
        :listLoading="listLoading"
        :columns="columns"
        :currentPage="pagination.page"
        :pageSize="pagination.pageSize"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      >
      </TableColumns>
    </el-card>

    <el-dialog :visible.sync="dialogFormVisible_add" :title='add_form.id?"编辑":"新增"'>
      <el-form ref="form" :rules="rule" :model="add_form">
        <el-form-item :label-width="formLabelWidth" label="代理简称:" prop="short_name">
          <el-input v-model="add_form.short_name" placeholder="请输代理简称" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="代理公司全称:" prop="company">
           <el-input v-model="add_form.company" v-if="add_form.company&&add_form.id" :disabled="true"/>
           <el-input v-model="add_form.company" v-else placeholder="请输入代理公司全称,一经添加不可修改"/>
         
        </el-form-item>
         <el-form-item :label-width="formLabelWidth" label="商务姓名:" prop="contact">
          <el-input v-model="add_form.contact" placeholder="请输入商务姓名"/>
        </el-form-item>
        <div>
          <el-form-item :label-width="formLabelWidth" label="联系方式:" prop="mobile">
             <div> 手机：<el-input class="contact-item"  v-model="add_form.mobile" placeholder="请输入11位阿拉伯数字字符"/></div>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" prop="wechat">
             <div>微信：<el-input class="contact-item"  v-model="add_form.wechat" placeholder="请输入不超过50个字符"/></div> 
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" prop="mail">
             <div>商务邮箱：<el-input class="contact-item"  v-model="add_form.mail" placeholder="请输入不超过50个字符"/></div> 
          </el-form-item>
        </div>
        <!-- <el-form-item :label-width="formLabelWidth" label="商务联系方式(至少选择2个):">
          <div> 手机：<el-input class="contact-item"  v-model="add_form.mobile" placeholder="请输入手机号码"/></div>
          <div>微信：<el-input class="contact-item"  v-model="add_form.wechat" placeholder="请输入微信号"/></div> 
          <div>邮箱：<el-input class="contact-item"  v-model="add_form.mail" placeholder="请输入邮箱"/></div> 
        </el-form-item> -->
        <el-form-item :label-width="formLabelWidth" label="关联媒体(多选):" prop="media">
            <el-checkbox-group v-model="checkedItem">
             <el-checkbox :disabled="discheckedItem.includes(item.id)"  v-for="item in mediaOptions" :label="item.id" :key="item.id">{{item.name_cn}}
            </el-checkbox>
        </el-checkbox-group>
        </el-form-item>
         <el-form-item :label-width="formLabelWidth" label="回传概率：" prop="default_rate">
             <el-input-number class="contact-item" controls-position="right" v-model="add_form.default_rate" :min="0" :max="100" placeholder="请输入回传概率"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="运营邮箱：" prop="agent_mail">
             <el-input class="contact-item"  v-model="add_form.agent_mail" placeholder="请输入运营邮箱"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible_add = false">取 消</el-button>
        <el-button type="primary" @click="addclick(add_form)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getAgentList, editAgent, addAgent } from '@/api/dynamic/agent'
import { getMediaList, getProjectList, getAgent } from '@/api/dynamic/public'
import TableColumns from '@/components/Eltable/index'
export default {
  name: 'Agent',
  components: { TableColumns },
  data() {
    return {
      dialogtitle: '用户编辑',
      dialogFormVisible: false,
      dialogFormVisible_add: false,
      add_form: {
        short_name: '',
        company: '',
        contact:'',
        mobile:'',
        wechat:'',
        mail:'',
        media:[],
        default_rate:process.env.AGENT_RATE,
        agent_mail:'',
      },
      checkedItem:[],
      discheckedItem:[],
      mediaList:[],
      mediaOptions:[],
      agentList:[],
      projectList:[],
      formLabelWidth: '120px',
      Width:'100px',
      total: 0,
      pagination: {
        page: 1,
        pageSize: 20
      },
      listQuery: {
        agent_id: '',
        media_id:'',
        proj_id:''
      },
      listLoading: true,
      rule: [],
      rules: {
        // new RegExp("[\+$","g")
        short_name: [
          { required: true, message: '请输入代理简称', trigger: 'blur' },
          {min: 1, max: 50, message: '请输入代理简称，1-50字符的', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请输入代理公司全称', trigger: 'blur' },
          {min: 1, max: 100, message: '请输入代理公司全称，1-100字符，一经添加不可修改', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入商务姓名', trigger: 'blur' },
          {min: 1, max: 50, message: '请输入商务姓名', trigger: 'blur' }
        ],
        mobile: [
          {required: false, message: '请输入联系方式', trigger: 'blur' },
          {pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,min: 11, max: 11,message: '请输入正确的电话号码', trigger: 'change' },
        ],
        media: [
          { required: true, message: '请选择媒体', trigger: 'blur' }
        ],
        default_rate:[
          { required: true, message: '请输入回传概率', trigger: 'blur' }
        ],
        agent_mail:[
          { required: true, message: '请输入运营邮箱', trigger: 'blur' }
        ]
      },
       list:[],
       columns: [
        {
          prop: 'id', // <String>  对应属性名
          label: '序号', // <String>   表头标签
          align: 'center' // 表头内容是否居中
        },
        {
          prop: 'short_name', // <String>  对应属性名
          label: '代理简称', // <String>   表头标签
          align: 'center' // 表头内容是否居中
        },
        {
          prop: 'company', // <String>  对应属性名
          label: '代理全称', // <String>   表头标签
          align: 'center' // 表头内容是否居中
        },
          {
          prop: 'contact', // <String>  对应属性名
          label: '商务姓名', // <String>   表头标签
          align: 'center' // 表头内容是否居中
        },
        {
          prop: 'mail', // <String>  对应属性名
          label: '商务邮箱', // <String>   表头标签
          align: 'center', // 表头内容是否居中
        },
        {
          prop: 'agent_mail', // <String>  对应属性名
          label: '运营邮箱', // <String>   表头标签
          align: 'center', // 表头内容是否居中
        },
        {
          prop: 'default_rate', // <String>  对应属性名
          label: '回传概率', // <String>   表头标签
          align: 'center', // 表头内容是否居中
        },
        {
          prop: 'wechat', // <String>  对应属性名
          label: '微信', // <String>   表头标签
          align: 'center', // 表头内容是否居中
        },
         {
          prop: 'mobile', // <String>  对应属性名
          label: '手机号码', // <String>   表头标签
          align: 'center', // 表头内容是否居中
        },
        {
          prop: 'cpc_price', // <String>  对应属性名
          label: '媒体名称', // <String>   表头标签
          align: 'center', // 表头内容是否居中
          render: (h, params) => {
            const arr=[]
            params.row.media.find(item=>{
              arr.push(item.name_cn)
            })
            return (
              <span>{arr.toString(',')}</span>
            )
          }
        },
         {
          prop: 'cpc_price', // <String>  对应属性名
          label: '项目', // <String>   表头标签
          align: 'center', // 表头内容是否居中
          render: (h, params) => {
            const arr=[]
            params.row.project.find(item=>{
              arr.push(item.app_name)
            })
            return (
              <span>{arr.toString(',')}</span>
            )
          }
        },
         {
          prop: 'operator', // <String>  对应属性名
          label: '创建者', // <String>   表头标签
          align: 'center' // 表头内容是否居中
        },
        {
          prop: 'created_at', // <String>  对应属性名
          label: '创建时间', // <String>   表头标签
          align: 'center' // 表头内容是否居中
        },
         {
          prop: 'updated_at', // <String>  对应属性名
          label: '更新时间', // <String>   表头标签
          align: 'center' // 表头内容是否居中
        },
        {
          prop: 'id', // <String>  对应属性名
          label: '操作', // <String>   表头标签
          align: 'center', // 表头内容是否居中
          width: 200, // 列宽
          render: (h, params) => {
            const editButton = h('el-button', {
              props: {
                type: 'primary'
              },
              on: {
                click: () => {
                  this.editType(params.row)
                }
              }
            }, '编辑')
            return h('div', [editButton])
          }
        }
      ]
    }
  },
  created() {
    this.rule = this.rules
    this.getAgent()
    this.getMediaList()
    this.getProjectList()
    this.getList()
  },
  methods: {
    // 筛选
    handleFilter (value) {
      const { pagination } = this
      pagination.page = 1
      this.getList()
    },
    editType(params){
       this.checkedItem=[]
       this.discheckedItem=[]
      this.dialogFormVisible_add = true
      const {short_name,company,contact,mobile,wechat,mail,media,id,default_rate,agent_mail}=params
      media.map(item=>{
        this.checkedItem.push(item.id)
        this.discheckedItem.push(item.id)
      })
      this.add_form={short_name,company,contact,mobile,wechat,mail,id,media,default_rate,agent_mail}
    },
    // 请求代理
    getAgent() {
      getAgent().then((data) => {
        if (data.error_code === 0) {
          this.agentList = data.data
        }
      })
    },
     // 请求媒体
    getMediaList() {
      getMediaList().then((data) => {
        if (data.error_code === 0) {
          this.mediaList = data.data
          this.mediaOptions=data.data
        }
      })
    },
     // 请求项目
    getProjectList() {
      getProjectList().then((data) => {
        if (data.error_code === 0) {
          this.projectList = data.data
        }
      })
    },
    // 请求数据
    getList() {
      const { pagination, listQuery } = this
      const params = {
        ...pagination,
        ...listQuery
      }
      this.listLoading = true
      getAgentList(params).then((data) => {
        if (data.error_code === 0) {
          this.total = data.meta.total
          this.list = data.data
          this.listLoading = false
        }
      }).catch(() => {
        this.$message({
          message: '加载失败',
          type: 'error'
        })
      })
    },
    // 新增收入源
    open() {
      // this.$router.push({ path: 'income/addIncome' })
      this.dialogFormVisible_add = true
      this.add_form = {
        short_name: '',
        company: '',
        contact:'',
        mobile:'',
        wechat:'',
        mail:'',
        media:[],
        default_rate:process.env.AGENT_RATE,
        agent_mail:''
      }
      this.checkedItem=[]
      this.discheckedItem=[]
    },
    addclick(form) {
          if(form.mobile&&form.mail||form.mobile&&form.wechat||form.wechat&&form.mail||form.mobile&&form.mail&&form.wechat){
          }else{
            this.$message.info("联系方式需填写2个及以上")
            return false
          }
          form.media=this.checkedItem
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(form.id){
            editAgent(form).then((data) => {
            if (data.error_code === 0) {
              this.$message.success(data.error_message?data.error_message:'保存成功')
               this.getList()
            } else {
              this.$message.error(data.error_message?data.error_message:'保存失败')
            }
          })
         }else{
           addAgent(form).then((data) => {
            if (data.error_code === 0) {
              this.$message.success(data.error_message?data.error_message:'保存成功')
              this.getList()
            } else {
              this.$message.error(data.error_message?data.error_message:'保存失败')
            }
           
          })
         }
          this.dialogFormVisible_add = false
        }
      })
    },
    // 分页- pageSize
    handleSizeChange (val) {
      const { pagination } = this
      pagination.pageSize = val
      pagination.page = 1
      this.getList()
    },
    // 分页- page
    handleCurrentChange (val) {
      this.pagination.page = val
      this.getList()
    }
  }
}
</script>
<style>
.el-dialog{
    width:550px;
}
.income_div{
    padding: 10px 20px 20px 20px;
}
.income_header{
  margin-bottom:20px;
}
.incometable{
    border:none;
    border-left:1px solid #ebeef5;
    margin-top:20px;
}
.incometable::before{
    height: 0px;
}
.incometable .el-table__header{
    border-top:1px solid #ebeef5;
}
.incometable .el-table__body-wrapper{
    max-height: 600px;
    overflow-y: auto;
}
.income_div .el-dialog__header{
    border-bottom:1px solid #ebeef5;
}
.income_select{
    width:200px;
    margin-left:10px;
  }
 .adname{
   font-size:14px;
   margin-left:10px;
  }
.select-item{
  width:150px;margin: 10px 20px 0px 0px;
}
.contact-item{
  margin-bottom:5px;
  width:200px;
}
</style>
