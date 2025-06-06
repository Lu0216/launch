<template>
  <div>
    <el-dialog :visible="depthbidvisible" :title='title' :before-close="handleClose" width="450">
      <el-table :data="deptableData.data" border style="width: 100%">
        <el-table-column prop="old_price" label="原出价" width="100">
        </el-table-column>
        <el-table-column prop="new_price" label="修改后出价" width="100">
        </el-table-column>
        <el-table-column prop="operation" label="操作人" width="150"> </el-table-column>
        <el-table-column prop="operation_at" label="操作时间" width="180"> </el-table-column>
      </el-table>
      
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "bidtable",
  components: {},
  data() {
    return {
      depthbidvisible: true,
    };
  },
  props: {
    title: {
      type: String,
      default: () => "未知",
    },
    depthbidtablebtnloading: {
      type: Boolean,
      default: () => false,
    },
    deptableData: {
      type: Object,
      default: () => {},
    },
  },
  created() {},
  methods: {
    handleClose() {
      this.$emit("close", false);
    },
  },
};
</script>
