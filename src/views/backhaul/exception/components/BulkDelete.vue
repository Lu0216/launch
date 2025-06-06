<template>
    <!-- Form -->
    <div class="eldialog">
      <el-dialog
        :visible="dialogFormVisible"
        :title="this.title"
        :before-close="handleCancel"
      >
     <p style="text-align: center;"> 确定删除所选记录？</p>
        <div slot="footer" class="dialog-footer" >
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="addclick">确 定</el-button>
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
      title: {
        type: String,
        default: () => "未知",
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
        dialogFormVisible: true,
        formLabelWidth: "150px",
      };
    },
    methods: {
      addclick() {
          this.$emit("deleteActivate")
      },
      handleCancel() {
        this.$emit("updateAddvisible", false);
        console.log('cancel');
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