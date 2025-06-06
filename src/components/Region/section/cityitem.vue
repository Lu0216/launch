<template>
  <div id="on" class="city">
    <el-checkbox :indeterminate="isIndeterminate_Item" :checked="checkAll_abc" v-model="checkAll_Item" :label="city.n" :key="city.n" @change="handleCheckAllChange_Item">{{ city.n }}</el-checkbox>
    <div v-if="city.cities" class="city_item_box">
      <div id="emit" class="city_item" >
        <el-checkbox-group v-model="checkedCity_Item" @change="handleCheckedCitiesChange_Item">
          <el-checkbox v-for="citya in city.cities" :label="citya.n" :key="citya.n">{{ citya.n }}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>
<script>
import Bus from './bus.js'
export default {
  name: 'Cityitem',
  props: {
    // 所有广告位
    city: {
      type: Object,
      default: () => Object
    }
    /* message: {
        type: Boolean,
        default: false
        } */
  },
  data() {
    return {
      checkAll_Item: false,
      checkAll_abc: false,
      checkedCity_Item: [],
      citys: this.city.cities ? this.city.cities : [],
      isIndeterminate_Item: false,
      message: true
    }
  },
  mounted() {
    Bus.$on('msg', (e) => {
      if (e) {
        this.handleCheckAllChange_Item(true)
      } else {
        this.handleCheckAllChange_Item(false)
        this.checkedCity_Item = []
        this.isIndeterminate_Item = false
      }
    })
    var arr = []
    this.citys.map((v) => {
      arr.push(v.n)
    })
    Bus.$on('sendCity', (e) => {
      if (e) {
        e.map((i) => {
          if (arr.indexOf(i) > -1) {
            this.checkedCity_Item.push(i)
            this.isIndeterminate_Item = this.checkedCity_Item.length > 0 && this.checkedCity_Item.length < this.citys.length
          }
        })
      }
    })
  },
  methods: {
    bus(a) {
      // this.message(a)
      Bus.$emit('city_arr', a)
    },
    busa(a) {
      // this.message(a)
      Bus.$emit('city_null', a)
    },
    handleCheckAllChange_Item(val) {
      var d = []
      this.city.cities.map((v) => {
        d.push(v.n)
      })
      this.checkedCity_Item = val ? d : []
      this.isIndeterminate_Item = false
      if (val) {
        this.busa({ city: this.city, checkbox: true, arr: d })
        // this.handleCheckAllChange_Item(true)
      } else {
        this.busa({ city: this.city, checkbox: false, arr: [] })
      }
    },
    handleCheckedCitiesChange_Item(value) {
      const checkedCount = value.length

      this.checkAll_abc = true
      this.isIndeterminate_Item = checkedCount > 0 && checkedCount < this.citys.length
      this.checkedCity_Item = value
      this.checkAll_Item = checkedCount === this.citys.length
      if (this.checkAll_Item) {
        this.bus({ city: this.city, checkbox: true, arr: value })
        // this.handleCheckAllChange_Item(true)
      } else {
        this.bus({ city: this.city, checkbox: false, arr: value })
      }
    }

  }

}
</script>
<style>
.city .el-checkbox{
    width:100px;
    height:30px;
    position:relative;
}
.city_item{
    position:relative;
    float:left;
}
.city_item .el-checkbox{
    width:100px;
    height:30px;
    float:left;
    position:relative;
    line-height: 30px;
    margin: 8px 0;
}
.city_item_box{
    width:200px;
    left:0px;
    top:29px;
    position:absolute;
    z-index:2;
    display:none;
    border: 1px solid pink;
    box-sizing: content-box;
    background: #eaf6fe;
}
.city .el-checkbox+.el-checkbox{
    margin-left:0px;
}
.city_item:hover{

}
.city_item:hover .city_item_box{
    display:block;
}
</style>
