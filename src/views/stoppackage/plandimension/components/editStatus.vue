<template>
  <div>
    <el-dialog
      :visible="statusvisible"
      :title="title"
      :before-close="handleClose"
      width="500px"
    >
      <el-form ref="form" :model="form" :rules="rule" label-width="100px">
        <el-form-item label="项目" prop="proj_id">
          <el-select
            placeholder="请选择项目"
            @change="projChange(form.proj_id)"
            v-model="form.proj_id"
          >
            <el-option
              v-for="item in batData"
              :key="item.id"
              :label="item.app_name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1" border>开启</el-radio>
            <el-radio :label="2" border>停投</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="计划id" prop="ids">
          <div style="margin-bottom:10px;">
            <el-upload
              action=""
              accept=".xls,.xlsx"
              :limit="1"
              :on-change="changeFile"
              :on-remove="handleRemove"
              :file-list="fileList"
              :auto-upload="false"
              :disabled="form.ids !== ''"
            >
              <el-button
                slot="trigger"
                type="primary"
                v-if="fileList.length < 1"
                >上传计划id</el-button
              >
              <div
                class="
                  el-button el-button--primary el-button--medium
                  is-disabled
                "
                @click.stop
                v-else
              >
                <span>上传计划id</span>
              </div>
            </el-upload>
          </div>
          <el-input
            v-model="form.ids"
            placeholder="请输入计划id，多个计划id以英文,逗号隔开"
            @blur="changeSrc"
            :disabled="fileList.length > 0"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit" :loading="loading">保存</el-button>
        <!-- <el-button @click="onchange">取消</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "EditStatus",
  components: {},
  data() {
    return {
      statusvisible: true,
      form: {
        proj_id: "",
        status: "",
        ids:'',
      },
      fileList:[],
      rule: {
        proj_id: [{ required: true, message: "请选择项目", trigger: "change" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
      loading:false,
    };
  },
  props: {
    title: {
      type: String,
      default: () => "未知",
    },
    statusbtnloading: {
      type: Boolean,
      default: () => false,
    },
    batData: {
      type: Array,
      default: () => {},
    },
  },
  created() {},
  methods: {
    onchange() {
      this.$emit("close", false);
    },
    handleClose() {
      this.onchange();
    },
    // 选择项目
    projChange(id) {
      this.batData.map((item) => {
        if (item.id == id) {
          this.form.proj_id = item.id;
        }
      });
    },
    // 填写计划id
    changeSrc(e) {
      if (e.target.value != "") {
        this.form.ids = e.target.value;
      }
    },
    // 删除已上传
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    changeFile(file, fileList) {
      this.fileList = fileList;
    },
    onSubmit() {
      let params = this.form;
      const fileList = this.fileList;
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(fileList.length === 0 && params.ids == ""){
            this.$message({
              message: '请填写或上传计划id！',
              type: 'error'
            })
            return;
          }
          const formData = new FormData();
          formData.append('proj_id',params.proj_id)
          formData.append('status',params.status)
          if(fileList.length == 0) {
            formData.append('ids',params.ids)
          }else {
            formData.append('file',fileList[0].raw)
          }
          this.loading = true;
          this.$emit('ok', formData)
        }
      })
    },
  },
};
</script>
