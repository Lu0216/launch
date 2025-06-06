<template>
  <div>
    <el-dialog :visible="operavisible" :title='title' :before-close="handleClose" width="450">
      <el-table :data="opearData.data" border style="width: 100%">
        <el-table-column prop="before" label="原预算" width="100">
        </el-table-column>
        <el-table-column prop="after" label="修改后预算" width="100">
        </el-table-column>
        <el-table-column prop="operator" label="操作人" width="150"> </el-table-column>
        <el-table-column prop="operation_at" label="操作时间" width="180"> </el-table-column>
      </el-table>
      
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "Operationtable",
  components: {},
  data() {
    return {
      operavisible: true,
    };
  },
  props: {
    title: {
      type: String,
      default: () => "未知",
    },
    operabtnloading: {
      type: Boolean,
      default: () => false,
    },
    opearData: {
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
