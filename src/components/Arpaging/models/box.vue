<template>
  <div class="el-transfer-panel district-panel">
    <div class="el-transfer-panel__header">
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
      >{{ title }}</el-checkbox>
      <span class="check-number">{{ checkedData.length }}/{{ districtListMock.length }}</span>
    </div>
    <div class="el-transfer-panel__body">
      <div class="el-transfer-panel__filter el-input el-input--small el-input--prefix">
        <input
          v-model="searchWord"
          type="text"
          autocomplete="off"
          placeholder="请输入(在全局中搜索)"
          class="el-input__inner"
        >
        <span class="el-input__prefix" style="left: 0px;">
          <i class="el-input__icon el-icon-search"/>
        </span>
      </div>
      <el-checkbox-group
        v-if="districtListMock.length > 0"
        v-model="checkedData"
        @change="handleCheckedChange"
      >
        <el-checkbox
          v-for="item in districtListMock"
          :label="item"
          :key="item.id"
          class="el-transfer-panel__item"
        >{{ item.label }}</el-checkbox>
      </el-checkbox-group>
      <p v-else class="no-data">无数据</p>
    </div>
    <div class="vip-footer">
      <el-button :disabled="disabledPre" class="v-page" plain @click="prev">上一页</el-button>
      <el-button :disabled="disabledNex" class="v-page" plain @click="next">下一页</el-button>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    title: {
      type: String
    },
    operateId: {
      type: Number
    },
    dataShowList: {
      type: Array
    },
    pageSize: {
      type: Number
    }
  },
  data() {
    return {
      districtListMock: [], // 展示的数据 （搜索和分页会自动修改这个数组）
      checkedData: [], // 已选择，数据格式：[id,id,id...]
      isIndeterminate: false,
      checkAll: false,
      searchWord: '',
      len: 0,
      total: 0,
      pageIndex: 0,
      disabledPre: true,
      disabledNex: false
    }
  },
  watch: {
    // 搜索框的监听器
    searchWord(newWord) {
      this.$emit('search-word', newWord, this.operateId)
    },
    // districtListMock 和 checkAll 的监听器
    districtListMock() {
      // 当方框中无已选择的数据时，不能勾选checkBox
      if (this.checkedData.length === 0) {
        this.checkAll = false
        this.isIndeterminate = false
      }
    },
    checkedData(newWord) {
      this.$emit('check-disable', newWord, this.operateId)
    },
    // 当列表中无数据时，不能勾选checkBox
    checkAll() {
      this.checkAll = this.districtListMock.length === 0 ? false : this.checkAll
    }
  },
  created() {
    this.initData()
  },
  methods: {
    // 分页数据
    initData() {
      this.len = this.dataShowList.length
      this.total = Math.ceil(this.len / this.pageSize)
      this.pageIndex = 0
      this.pageData()
    },
    pageData() {
      this.checkedData = []
      if (this.total > 1 && this.pageIndex < this.total - 1) {
        this.pageIndex === 0
          ? (this.disabledPre = true)
          : (this.disabledPre = false)
        this.disabledNex = false
        this.districtListMock = this.dataShowList.slice(
          this.pageIndex * this.pageSize,
          this.pageIndex * this.pageSize + this.pageSize
        )
      } else {
        this.total > 1 ? (this.disabledPre = false) : (this.disabledPre = true)
        this.disabledNex = true
        this.districtListMock = this.dataShowList.slice(
          this.pageIndex * this.pageSize,
          this.len
        )
      }
    },
    // 上一页
    prev() {
      this.pageIndex > 0 && --this.pageIndex
      this.pageData()
    },
    // 下一页
    next() {
      this.pageIndex <= this.total - 1 && ++this.pageIndex
      this.pageData()
    },
    // 单选
    handleCheckedChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.districtListMock.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.districtListMock.length
      // 子传父
      this.$emit('check-district', value)
    },
    // 全选
    handleCheckAllChange(val) {
      this.checkedData = val ? this.districtListMock.map(val => val) : []
      this.isIndeterminate = false
      // 子传父
      this.$emit('check-district', this.checkedData)
    }
  }
}
</script>

<style lang="scss" scoped>
.district-panel {
  width: 240px;

  .el-transfer-panel__header {
    .el-checkbox {
      display: inline-block;
    }
  }
  .el-transfer-panel__body {
    height: 292px;

    .el-transfer-panel__filter {
      line-height: 0;
    }
  }
  .el-checkbox-group {
    height: 240px;
    overflow: auto;
    .el-transfer-panel__item {
      display: block;
    }
  }
  .check-number {
    position: absolute;
    right: 15px;
    top: 0;
    color: #909399;
    font-size: 12px;
    font-weight: 400;
  }
  .no-data {
    margin: 0;
    height: 30px;
    line-height: 30px;
    padding: 6px 15px 0;
    color: #909399;
    text-align: center;
  }
  .vip-footer {
    position: relative;
    margin: 0;
    text-align: center;
    border-top: 1px solid #ebeef5;

    .v-page {
      float: left;
      width: 50%;
      border: none;
      margin: 0;
      border-radius: 0;
    }
  }
}
</style>
