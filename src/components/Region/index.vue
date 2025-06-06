<template>
  <div style="width:798px;border:1px solid #DDDDDD;">
    <!-- 四个直辖市 start-->
    <div style="overflow:hidden;">
      <div style="margin: 0px 0px 10px 0px;background: #F6F6F6;line-height:30px;">
        <el-checkbox :indeterminate="isIndeterminate_municipalities" v-model="checkAll_municipalities" @change="handleCheckAllChange_shi">直辖市</el-checkbox>
      </div>
      <el-checkbox-group v-model="municipalities" @change="handleCheckedCitiesChange_shi">
        <el-checkbox v-for="city in cities_municipalities" :label="city.n" :key="city.n">{{ city.n }}</el-checkbox>
      </el-checkbox-group>
    </div>
    <!-- 四个直辖市 end-->

    <div id="city">
      <div style="margin: 0px 0px 10px 0px;background: #F6F6F6;line-height:30px;">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">省级地区</el-checkbox>
      </div>
      <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
        <Section id="emit" :messagedata="messagedata" :cities="cities"/>
      </el-checkbox-group>
    </div>

    <!-- 其他地区 start-->
    <div style="overflow:hidden;clear:both;">
      <div style="margin: 0px 0px 10px 0px;background: #F6F6F6;line-height:30px;">
        <el-checkbox :indeterminate="isIndeterminate_other" v-model="checkAll_other" @change="handleCheckAllChange_other">其他地区</el-checkbox>
      </div>
      <el-checkbox-group v-model="other" @change="handleCheckedCitiesChange_other">
        <el-checkbox v-for="city in cities_other" :label="city.n" :key="city.n">{{ city.n }}</el-checkbox>
      </el-checkbox-group>
    </div>
    <!-- 其他地区 end-->

  </div>

</template>
<script>
import Section from './section'
import Bus from './section/bus.js'
import CityData from './section/city.js'
export default {
  name: 'Region',
  components: { Section },
  props: {
    initCity: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      cityData: '',
      checkAll: false,
      checkAll_municipalities: false,
      checkAll_other: false,
      checkedCities: [], // 省级地区的默认选中
      municipalities: [], // 直辖市的默认选中
      other: [], // 其他的默认选中
      cities: CityData.cityOptions, // 地区的数组
      cities_municipalities: CityData.municipalities_Options, // 直辖市数组
      cities_other: CityData.other_Options, // 其他地区数组
      isIndeterminate: false,
      isIndeterminate_municipalities: false,
      isIndeterminate_other: false,
      messagedata: false,
      city_arr: [], // 所有的省级地区名
      datasrccity_mini: [],
      datasrccity_other: [],
      datasrccity: [], // 要传给后端的地区数组
      datasrccity1: [], // 全选
      datasrccity2: []// 选中一些

    }
  },
  watch: {
    datasrccity(item) {
      var city = []
      item.map((v) => {
        if (v.arr.length > 0) {
          v.arr.map((i) => {
            city.push(i)
          })
        }
      })
      this.$emit('input', city.join(','))
    }
  },
  mounted() {
    this.city_arr = this.changeCityOptions(this.cities)
    var all_obj = []
    for (var i = 0; i < this.cities.length; i++) {
      var all_cities = []
      this.cities[i].cities.map((o) => {
        all_cities.push(o.n)
      })
      all_obj.push({
        name: this.cities[i].n,
        arr: all_cities
      })
    }
    var other_arr = this.changeCityOptions(this.cities_other)
    var cities_municipalities = this.changeCityOptions(this.cities_municipalities)
    var cities = []
    var data = {}
    this.cityData = this.initCity.split(',')
    this.cityData.map((val) => {
      if (other_arr.indexOf(val) > -1) {
        this.other.push(val)
        if (this.other.length < other_arr.length) {
          this.isIndeterminate_other = true
        } else {
          this.isIndeterminate_other = false
          this.checkAll_other = true
        }
        this.datasrccity_other.push({
          name: val,
          arr: [val]
        })
      } else if (cities_municipalities.indexOf(val) > -1) {
        this.municipalities.push(val)
        this.datasrccity_mini.push({
          name: val,
          arr: [val]
        })
        if (this.municipalities.length < cities_municipalities.length) {
          this.isIndeterminate_municipalities = true
        } else {
          this.isIndeterminate_municipalities = false
          this.checkAll_municipalities = true
        }
      } else if (this.judgeArr(all_obj, val) > -1) {
        var k = all_obj[this.judgeArr(all_obj, val)].name
        if (k in data) {
          data[k].arr.push(val)
        } else {
          data[k] = {
            name: k,
            arr: [val]
          }
        }
        cities.push(val)
      }
    })
    for (var key in data) {
      all_obj.map((a) => {
        if (a.name === key && a.arr.length === data[key].arr.length) {
          this.checkedCities.push(key)
          this.isIndeterminate = true
          if (this.checkedCities.length === all_obj.length) {
            this.checkAll = true
            this.isIndeterminate = false
          }
        }
      })

      this.datasrccity2.push(data[key])
    }
    this.sendChild(cities)
    this.datasrccity = this.datasrccity_mini.concat(this.datasrccity1.concat(this.datasrccity2)).concat(this.datasrccity_other)
    Bus.$on('city_null', (e) => {
      if (e) {
        this.datasrccity1.map((i) => {
          if (i.name === e.city.n) {
            this.removeAaary(this.datasrccity1, i)
          }
        })
        this.datasrccity1.push({ name: e.city.n, arr: e.arr })

        this.datasrccity1.map((e) => {
          this.datasrccity2.map((c) => {
            if (e.name === c.name) {
              this.removeAaary(this.datasrccity2, c)
            }
          })
        })
        this.datasrccity = this.datasrccity_mini.concat(this.datasrccity1.concat(this.datasrccity2)).concat(this.datasrccity_other)
      }
    })

    Bus.$on('city_arr', (e) => {
      if (e) {
        if (e.checkbox) {
          this.checkedCities.push(e.city.n)
        } else {
          // this.checkedCities.remove(e.city.n)
          this.removeAaary(this.checkedCities, e.city.n)
        }
        if (this.checkedCities.length === this.city_arr.length) {
          this.checkAll = true
          this.isIndeterminate = false
        } else if (this.checkedCities.length > 0) {
          this.checkAll = false
          this.isIndeterminate = true
        } else {
          this.isIndeterminate = false
        }
        this.datasrccity2.map((i) => {
          if (i.name === e.city.n) {
            this.removeAaary(this.datasrccity2, i)
          }
        })
        this.datasrccity2.push({ name: e.city.n, arr: e.arr })

        this.datasrccity2.map((e) => {
          this.datasrccity1.map((c) => {
            if (e.name === c.name) {
              this.removeAaary(this.datasrccity1, c)
            }
          })
        })
        this.datasrccity = this.datasrccity_mini.concat(this.datasrccity1.concat(this.datasrccity2)).concat(this.datasrccity_other)
      }
    })
  },
  methods: {
    // 判断这个字符是否在一个数组的对象里
    judgeArr(arr, val) {
      var a = -1
      arr.map((i, index) => {
        if (i.arr.indexOf(val) > -1) {
          a = index
        }
      })
      return a
    },
    // 取得城市字符数组
    changeCityOptions(val) {
      var arr = []
      if (val) {
        val.map((val) => {
          arr.push(val.n)
        })
        return arr
      }
    },
    bus(a) {
      Bus.$emit('msg', a)
    },
    // 发送数据到城市组件
    sendChild(val) {
      Bus.$emit('sendCity', val)
    },
    removeAaary(_arr, _obj) {
      var length = _arr.length
      for (var i = 0; i < length; i++) {
        if (_arr[i] === _obj) {
          if (i === 0) {
            _arr.shift() // 删除并返回数组的第一个元素
            return _arr
          } else if (i === length - 1) {
            _arr.pop() // 删除并返回数组的最后一个元素
            return _arr
          } else {
            _arr.splice(i, 1) // 删除下标为i的元素
            return _arr
          }
        }
      }
    },
    handleCheckAllChange_shi(val) {
      var d = []
      var datasrc = []
      CityData.municipalities_Options.map((v) => {
        d.push(v.n)
        datasrc.push({
          name: v.n,
          arr: [v.n]
        })
      })
      this.municipalities = val ? d : []
      this.isIndeterminate_municipalities = false
      this.datasrccity_mini = val ? datasrc : []
      this.datasrccity = this.datasrccity_mini.concat(this.datasrccity1.concat(this.datasrccity2)).concat(this.datasrccity_other)
    },
    handleCheckedCitiesChange_shi(value) {
      const checkedCount = value.length
      this.checkAll_municipalities = checkedCount === this.cities_municipalities.length
      this.isIndeterminate_municipalities = checkedCount > 0 && checkedCount < this.cities_municipalities.length
      var datasrc = []
      value.map((v) => {
        datasrc.push({
          name: v,
          arr: [v]
        })
      })
      this.datasrccity_mini = value.length > 0 ? datasrc : []
      this.datasrccity = this.datasrccity_mini.concat(this.datasrccity1.concat(this.datasrccity2)).concat(this.datasrccity_other)
    },
    handleCheckAllChange_other(val) {
      var d = []
      var datasrc = []
      CityData.other_Options.map((v) => {
        d.push(v.n)
        datasrc.push({
          name: v.n,
          arr: [v.n]
        })
      })
      this.other = val ? d : []
      this.datasrccity_other = val ? datasrc : []
      this.isIndeterminate_other = false

      this.datasrccity = this.datasrccity_mini.concat(this.datasrccity1.concat(this.datasrccity2)).concat(this.datasrccity_other)
    },
    handleCheckedCitiesChange_other(value) {
      const checkedCount = value.length
      this.checkAll_other = checkedCount === this.cities_other.length
      this.isIndeterminate_other = checkedCount > 0 && checkedCount < this.cities_other.length
      var datasrc = []
      value.map((v) => {
        datasrc.push({
          name: v,
          arr: [v]
        })
      })
      this.datasrccity_other = value.length > 0 ? datasrc : []
      this.datasrccity = this.datasrccity_mini.concat(this.datasrccity1.concat(this.datasrccity2)).concat(this.datasrccity_other)
    },
    handleCheckAllChange(val) {
      var d = []
      d = this.changeCityOptions(this.cities)
      this.checkedCities = val ? d : []
      this.isIndeterminate = false
      this.messagedata = !!val
      this.bus(this.messagedata)
      this.datasrccity = this.datasrccity_mini.concat(this.datasrccity1.concat(this.datasrccity2)).concat(this.datasrccity_other)
    },
    handleCheckedCitiesChange(value) {
      this.datasrccity1 = []
      value.map((v) => {
        this.cities.map((i) => {
          if (v === i.n) {
            var arr = []
            i.cities.map((j) => {
              arr.push(j.n)
            })
            this.datasrccity1.push({ name: v, arr: arr })
          }
        })
      })
      this.datasrccity1.map((e) => {
        this.datasrccity2.map((c) => {
          if (e.name === c.name) {
            this.removeAaary(this.datasrccity2, c)
          }
        })
      })

      this.datasrccity = this.datasrccity_mini.concat(this.datasrccity1.concat(this.datasrccity2)).concat(this.datasrccity_other)
      this.checkedCities = value
      const checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    }
  }

}
</script>
<style>
    #city{
        width:798px;
    }
</style>
