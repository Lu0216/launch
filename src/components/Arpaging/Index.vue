<template>
  <div>
    <div v-if="show" class="krry-main">
      <krry-box
        ref="noSelect"
        :title="boxTitle[0]"
        :operate-id="0"
        :data-show-list="dataListNoCheck"
        :page-size="pageSize"
        @check-district="noCheckSelect"
        @search-word="searchWord"
        @check-disable="checkDisable"
      />
      <div class="opera">
        <el-button
          :disabled="disablePre"
          class="el-transfer__button"
          icon="el-icon-arrow-left"
          type="primary"
          circle
          @click="deleteData"
        />
        <el-button
          :disabled="disableNex"
          class="el-transfer__button"
          icon="el-icon-arrow-right"
          type="primary"
          circle
          @click="addData"
        />
      </div>
      <krry-box
        ref="hasSelect"
        :title="boxTitle[1]"
        :operate-id="1"
        :data-show-list="selectListCheck"
        :page-size="pageSize"
        @check-district="hasCheckSelect"
        @search-word="searchWord"
        @check-disable="checkDisable"
      />
    </div>
  </div>
</template>

<script>
import krryBox from './models/box'
export default {
  name: 'Arpaging',
  components: {
    krryBox
  },
  props: {
    boxTitle: {
      type: Array,
      default: () => ['待选区', '已选中']
    },
    pageSize: {
      type: Number,
      default: 160
    },
    dataList: {
      type: Array,
      default: () => []
    },
    selectedData: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      notSelectDataList: [], // 未选中（已过滤出已选)的数据
      checkedData: [], // 已选中的数据

      dataListNoCheck: [], // 未选中的（或已搜索）传递到子组件的数据
      selectListCheck: [], // 已选中的（或已搜索）传递到子组件的数据

      noCheckData: [], // 未选中区域的已勾选的数据（待添加到已选区域)
      hasCheckData: [], // 已选中区域的已勾选的数据（从未选区域中待删除)

      noSelectkeyword: '',
      haSelectkeyword: '',

      disablePre: true,
      disableNex: true,
      show: false
    }
  },
  computed: {
    // 传递到后台保存的数据（已选中的数据的 id 数组）
    selectIdList() {
      return this.checkedData.map(item => item.id)
    }
  },
  watch: {
    selectIdList(newVal) {
      // 获取已选数据的监听事件
      this.$emit('onChange', newVal)
    },
  },
  
  created() {
    this.initData(this.selectedData)
  },
  methods: {
    // 分页数据，初始化数据
    initData(arr) {
      this.checkedData = JSON.parse(JSON.stringify(arr))
      this.selectListCheck = this.checkedData
      console.log(this.dataList, this.selectListCheck)
      this.notSelectDataList = this.dataList.filter(item1 => {
        return this.selectListCheck.every(
          item2 => String(item2.id) !== String(item1.id)
        )
      })
      this.dataListNoCheck = this.notSelectDataList
      // console.log('选中的数据', this.selectListCheck)
      // console.log('未选中的数据', this.dataListNoCheck)
      this.show = true
    },
    searchWord(keyword, titleId) {
      // 过滤掉数据，保留搜索的数据
      if (titleId === 0) {
        this.noSelectkeyword = keyword
        this.dataListNoCheck = this.notSelectDataList.filter(val =>
          val.label.includes(keyword)
        )
      } else {
        this.haSelectkeyword = keyword
        this.selectListCheck = this.checkedData.filter(val =>
          val.label.includes(keyword)
        )
      }
      const refsName = titleId === 0 ? 'noSelect' : 'hasSelect'
      // 延迟执行
      setTimeout(() => {
        this.$refs[refsName].initData()
      }, 0)
    },
    // 检查左右按钮可用性
    checkDisable(data, operateId) {
      // console.log('检查左右按钮可用性', data, operateId)
      if (operateId === 0) {
        this.disableNex = !(data.length > 0)
      } else {
        this.disablePre = !(data.length > 0)
      }
    },
    // 未选中区域的选泽
    noCheckSelect(val) {
      this.noCheckData = val
      // console.log('未选中区域的选泽', val)
    },
    // 已选中区域的选泽
    hasCheckSelect(val) {
      this.hasCheckData = val
      // console.log('已选中区域的选泽', val)
    },
    // 关键：把未选择的数据当做已选择的过滤数组，把已选择的数据当做未选择的过滤数组，在全局data进行过滤，最后进行一次搜索
    // 添加至已选
    addData() {
      this.notSelectDataList = this.notSelectDataList.filter(item1 => {
        return this.noCheckData.every(
          item2 => String(item2.id) !== String(item1.id)
        )
      })

      // 为了排序，选择这种复杂方法，从固定不变的所有数据 dataList 中过滤，顺序就不会乱
      // this.checkedData = this.dataList.filter(item1 => {
      //   return this.notSelectDataList.every(
      //     item2 => String(item2.id) !== String(item1.id)
      //   )
      // })
      // this.dataList.filter(item1 => {
      //   return this.noCheckData.every(
      //     item2 => String(item2.id) !== String(item1.id)
      //   )
      // })
      this.checkedData = this.checkedData.concat(this.noCheckData)
      // 为了排序，舍弃这种效率更高的方法，从而选择上面那种方式
      // this.checkedData = Array.from(this.notSelectDataList);
      // 搜索一次
      this.searchWord(this.noSelectkeyword, 0)
      this.searchWord(this.haSelectkeyword, 1)
    },
    // 从已选中删除
    deleteData() {
      this.checkedData = this.checkedData.filter(item1 => {
        return this.hasCheckData.every(
          item2 => String(item2.id) !== String(item1.id)
        )
      })
      // this.dataList.filter(item1 => {
      //   return this.checkedData.every(
      //     item2 => String(item2.id) !== String(item1.id)
      //   )
      // })
      this.notSelectDataList = this.notSelectDataList.concat(this.hasCheckData)
      // this.notSelectDataList = this.dataList.filter(item1 => {
      //   return this.checkedData.every(
      //     item2 => String(item2.id) !== String(item1.id)
      //   )
      // })
      // 搜索一次
      this.searchWord(this.noSelectkeyword, 0)
      this.searchWord(this.haSelectkeyword, 1)
    },
    // 提供获取已选数据的钩子
    getSelectedData() {
      return this.selectIdList
    }
  }
}
</script>

<style lang='scss' scoped>
.krry-main {
  min-width: 600px;
}
.inner-center {
  margin: 0 5px;
}
.opera {
  position: relative;
  width: 100px;
  display: inline-block;
  vertical-align: middle;

  .el-button.is-circle {
    border-radius: 50%;
    padding: 12px;
    display: block;
    margin: 25px auto;
  }
}
</style>
