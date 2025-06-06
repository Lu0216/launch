<template>
  <div
    id="_8d44950"
    style=""
    tabindex="0"
    data-ctrl-id="esui8785927"
    data-ctrl-view-context="default"
    class="ui-ctrl ui-schedule"
    @mouseup="onDivMouseUp()"
    @mouseleave="onDivMouseUp()">
    <input
      id="ctrl-default-esui8785927-value-input"
      :value="value"
      type="hidden"
      name="">
    <div id="ctrl-default-esui8785927-body" class="ui-schedule-body">
      <div id="ctrl-undefined" class="ui-schedule-time-line">
        <div id="ctrl-default-esui8785927-time-head0" class="ui-schedule-time-head" data-time="0">0:00</div>
        <div id="ctrl-default-esui8785927-time-head2" class="ui-schedule-time-head" data-time="2">2:00</div>
        <div id="ctrl-default-esui8785927-time-head4" class="ui-schedule-time-head" data-time="4">4:00</div>
        <div id="ctrl-default-esui8785927-time-head6" class="ui-schedule-time-head" data-time="6">6:00</div>
        <div id="ctrl-default-esui8785927-time-head8" class="ui-schedule-time-head" data-time="8">8:00</div>
        <div id="ctrl-default-esui8785927-time-head10" class="ui-schedule-time-head" data-time="10">10:00</div>
        <div id="ctrl-default-esui8785927-time-head12" class="ui-schedule-time-head" data-time="12">12:00</div>
        <div id="ctrl-default-esui8785927-time-head14" class="ui-schedule-time-head" data-time="14">14:00</div>
        <div id="ctrl-default-esui8785927-time-head16" class="ui-schedule-time-head" data-time="16">16:00</div>
        <div id="ctrl-default-esui8785927-time-head18" class="ui-schedule-time-head" data-time="18">18:00</div>
        <div id="ctrl-default-esui8785927-time-head20" class="ui-schedule-time-head" data-time="20">20:00</div>
        <div id="ctrl-default-esui8785927-time-head22" class="ui-schedule-time-head" data-time="22">22:00</div>
        <div id="ctrl-default-esui8785927-time-head24" class="ui-schedule-time-head" data-time="24">24:00</div>
      </div>
      <div id="ctrl-default-esui8785927-day-head" class="ui-schedule-day-head">
        <div v-for="(index, key) in week" :key="key" class="ui-schedule-day">
          <input
            :id="'ctrl-default-esui8785927-line-state' + key"
            :key="key"
            v-model="index.status"
            type="checkbox"
            @change="onClickDay(key,index.status)">
          <label :for="'ctrl-default-esui8785927-line-state' + key">{{ index.name }}</label>
        </div>
      </div>
      <div id="ctrl-default-esui8785927-time-body" class="ui-schedule-time-body">
        <div v-for="(index,n) in selected" :id="'ctrl-default-esui8785927-line'+n" :key="n" class="ui-schedule-line">
          <div v-for="(item,m) in index" :key="m">
            <div
              :id="'ctrl-default-esui8785927-time_'+ n +'_'+ m"
              :class="{ 'ui-schedule-time-hover' : item.hover ,'ui-schedule-time-selected' : item.selected , 'ui-schedule-time-active-hover' : item.hover1}"
              :data-day="n"
              :data-time-item="m"
              class="ui-schedule-time"
              @click="onClickSelected(n,m)"
              @mouseout="onMouseOut(n,m)"
              @mousedown="onMouseDown(n,m)"
              @mouseup="onMouseUp()"
              @mouseover="onMouseOver(n ,m)"/>
          </div>
        </div>
      </div>
    </div>
    <div class="ui-schedule-head">
      <div class="ui-schedule-help">
        <div class="ui-schedule-help-selected"/>
        <div class="ui-schedule-help-text">投放时间段</div>
        <div class="ui-schedule-help-unselected"/>
        <div class="ui-schedule-help-text">暂停时间段</div>
      </div>
      <div id="ctrl-default-esui8785927-shortcut" class="ui-schedule-shortcut">
        <span class="ui-schedule-shortcut-text-item">快速设定：</span>
        <span class="ui-schedule-shortcut-item" data-item="0" @click="onClickquickSetting(0)">全周投放</span>
        <span class="ui-schedule-shortcut-item" data-item="1" @click="onClickquickSetting(1)">周一到周五投放</span>
        <span class="ui-schedule-shortcut-item" data-item="2" @click="onClickquickSetting(2)">周末投放</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Timeinterval',

  props: {
    initValue: {
      type: String,
      default: () => '0'
    }
  },

  data() {
    return {
      week: {
        0: { 'name': '星期一', 'status': false },
        1: { 'name': '星期二', 'status': false },
        2: { 'name': '星期三', 'status': false },
        3: { 'name': '星期四', 'status': false },
        4: { 'name': '星期五', 'status': false },
        5: { 'name': '星期六', 'status': false },
        6: { 'name': '星期日', 'status': false }
      },
      selected: [],
      activeSelected: {},
      clickEl: '',
      flag: false
    }
  },
  computed: {
    value() {
      var val = ''
      for (var i = 0, len = this.selected.length; i < len; i++) {
        for (var j in this.selected[i]) {
          val += this.selected[i][j].value
        }
      }
      return val
    }
  },
  watch: {
    // 监听广告位
    value(curval) {
      for (var i = 0; i < this.value.length; i++) {
        if (this.value[i] === '1') {
          return this.$emit('input', curval)
        }
      }
      return this.$emit('input', '')
    }
  },
  beforeMount() {
    for (var n in this.week) {
      var status = 0
      this.selected[n] = []
      for (var m = 0; m < 24; m++) {
        this.selected[n][m] = {
          'selected': this.initValue[24 * n + m] === '1',
          'hover': false,
          'value': this.initValue[24 * n + m] === '1' ? this.initValue[24 * n + m] : '0'
        }
        if (this.initValue[24 * n + m] === '1') {
          status += 1
        }
        if (status === 24) {
          this.week[n].status = true
        } else {
          this.week[n].status = false
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    onClickSelected(n, m) {
      // 单个点击
      if (this.selected[n][m].selected === false) {
        this.selected[n][m].selected = true
        this.selected[n][m].value = '1'
      } else {
        this.selected[n][m].selected = false
        this.selected[n][m].value = '0'
      }
      this.selected.splice(n, 1, this.selected[n])
      // 全天点击后 星期被选中
      var status = 0
      for (m in this.selected[n]) {
        if (this.selected[n][m].value === '1') {
          status += 1
        }
      }
      if (status === 24) {
        this.week[n].status = true
      } else {
        this.week[n].status = false
      }
    },
    onMouseOver(n, m) {
      // 鼠标经过
      this.selected[n][m].hover = true
      this.selected.splice(n, 1, this.selected[n])
      let deltaN = 0
      let deltaM = 0
      this.activeSelected = {}
      this.clearHover()
      if (this.flag) {
        const startArr = this.clickEl.split(',')
        for (let i = 0; i <= Math.abs(n - startArr[0]); i++) {
          deltaN = (n - startArr[0] < 0) ? -i : i
          for (let j = 0; j <= Math.abs(m - startArr[1]); j++) {
            deltaM = (m - startArr[1] < 0) ? -j : j
            var newN = parseInt(startArr[0]) + parseInt(deltaN)
            var newM = parseInt(startArr[1]) + parseInt(deltaM)
            var key = newN + '_' + newM
            this.activeSelected[key] = true
            this.selected[newN][newM].hover1 = true
          }
        }
      }
    },
    onMouseOut(n, m) {
      // 鼠标移出
      this.selected[n][m].hover = false
      this.selected.splice(n, 1, this.selected[n])
    },
    // 当日
    onClickDay(n, status) {
      for (var m in this.selected[n]) {
        this.selected[n][m].selected = status
        this.selected[n][m].value = status ? '1' : '0'
      }
      this.selected.splice(n, 1, this.selected[n])
    },
    onClickquickSetting(val) {
      if (val === 0) {
        // 全周投放
        for (var n = 0, len = 7; n < len; n++) {
          this.week[n].status = true
          for (var m in this.selected[n]) {
            this.selected[n][m].selected = true
            this.selected[n][m].value = '1'
          }
          this.selected.splice(n, 1, this.selected[n])
        }
      } else if (val === 1) {
        // 周一到周五
        for (n = 0, len = 7; n < len; n++) {
          if (n < 5) {
            this.week[n].status = true
            for (m in this.selected[n]) {
              this.selected[n][m].selected = true
              this.selected[n][m].value = '1'
            }
          } else {
            this.week[n].status = false
            for (m in this.selected[n]) {
              this.selected[n][m].selected = false
              this.selected[n][m].value = '0'
            }
          }
          this.selected.splice(n, 1, this.selected[n])
        }
      } else {
        // 周末选择
        for (n = 0, len = 7; n < len; n++) {
          if (n > 4) {
            this.week[n].status = true
            for (m in this.selected[n]) {
              this.selected[n][m].selected = true
              this.selected[n][m].value = '1'
            }
          } else {
            this.week[n].status = false
            for (m in this.selected[n]) {
              this.selected[n][m].selected = false
              this.selected[n][m].value = '0'
            }
          }
          this.selected.splice(n, 1, this.selected[n])
        }
      }
    },

    // 鼠标点下
    onMouseDown(n, m) {
      this.clickEl = n + ',' + m
      this.flag = true
    },
    // 鼠标松开
    onMouseUp() {
      this.clickEl = ''
      for (var item in this.activeSelected) {
        var arr = item.split('_')
        if (this.selected[arr[0]][arr[1]].hover1 === true) {
          this.selected[arr[0]][arr[1]].selected = !this.selected[arr[0]][arr[1]].selected
          this.selected[arr[0]][arr[1]].value = this.selected[arr[0]][arr[1]].value === '1' ? '0' : '1'
        }
      }
      this.activeSelected = {}
      this.clearHover()
      this.flag = false
    },
    clearHover() {
      for (var i = 0; i < this.selected.length; i++) {
        for (var j = 0; j < this.selected[i].length; j++) {
          this.selected[i][j].hover1 = false
        }
      }
    },
    onDivMouseUp() {
      this.onMouseUp()
    }
  }
}
</script>
<style scoped>
  html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td {
    padding: 0;
    margin: 0;
    border: 0;
    outline: 0;
    font-weight: inherit;
    font-style: inherit;
    font-family: inherit;
    font-size: 100%;
    vertical-align: baseline;
    box-sizing: content-box;
  }

  .ui-ctrl {
    margin: 0;
    padding: 0;
    text-align: left;
  }

  .ui-schedule {
    font-size: 12px;
    width: 710px;
    height: 236px;
    padding: 6px 0 8px 0;
    background: #F7F7F7;
    border: 1px solid #CDCDCD;
    position: relative;
  }

  .ui-schedule-body {
    height: 200px;
  }

  .ui-schedule-time-line {
    height: 23px;
    padding: 0 0 0 40px;
  }

  .ui-schedule-time-head {
    border: 0;
    width: 50px;
    text-align: center;
    position: relative;
    color: #000;
    float: left;
    font-size: 12px;
    height: 23px;
    line-height: 23px;
    -moz-user-select: none;
    -webkit-user-select: none;
  }

  .ui-schedule-day-head {
    float: left;
    width: 65px;
    margin: 0;
  }

  .ui-schedule-day {
    line-height: 25px;
    padding-right: 5px;
    height: 25px;
    text-align: right;
  }

  /*input[type=checkbox]:checked:before {*/
  /*top: 1.5px;*/
  /*left: 1px;*/
  /*width: 8px;*/
  /*height: 4px;*/
  /*content: '';*/
  /*color: #fff;*/
  /*position: absolute;*/
  /*border-bottom: solid 2px currentColor;*/
  /*border-left: solid 2px currentColor;*/
  /*-webkit-transform: rotate(-45deg);*/
  /*transform: rotate(-45deg);*/
  /*}*/

  input[type=checkbox] {
    /*position: relative;*/
    margin: 0;
    padding: 0;
    width: 14px;
    height: 14px;
    outline: none;
    cursor: pointer;
    /*vertical-align: -3px;*/
    border: 1px solid #999999;
    /*-webkit-appearance: none;*/
    -moz-appearance: none;
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    -ms-transition: all 0.3s;
    -o-transition: all 0.3s;
    transition: all 0.3s;
  }

  .ui-schedule-time-body {
    float: left;
    margin: 0;
    padding: 0;
    width: 600px;
    border-top: 1px solid #dcdcdc;
    position: relative;
  }

  .ui-schedule-line {
    height: 25px;
    padding: 0;
    position: relative;
    overflow: hidden;
  }

  .ui-schedule-head {
    height: 28px;
    width: 710px;
    line-height: 28px;
    padding-top: 10px;
    position: relative;
  }

  .ui-schedule-help {
    float: right;
    width: 200px;
  }

  .ui-schedule-help div {
    float: left;
    cursor: default;
  }

  .ui-schedule-time, .ui-schedule-help-selected, .ui-schedule-help-unselected {
    background: #fff;
    border: 1px solid #dcdcdc;
    color: #E6E6E6;
    cursor: pointer;
    float: left;
    font-size: 12px;
    height: 23px;
    line-height: 23px;
    text-align: center;
    width: 23px;
    -moz-user-select: none;
    -webkit-user-select: none;
    position: relative;
  }

  .ui-schedule-time-selected, .ui-schedule-help-selected {
    background: #dcfacf;
    border: 1px solid #c2e8a6;
    color: #fff;
  }

  .ui-schedule-time-hover {
    border: 1px solid #f7de41;
    cursor: pointer;
    background: #fff6bd;
  }
  .ui-schedule-time-active-hover {
    border: 1px solid #f7de41;
    cursor: pointer;
    background: #fff6bd;
  }

  .ui-schedule-help div {
    float: left;
    cursor: default;
  }

  .ui-schedule-help-text {
    line-height: 16px;
    padding: 2px 8px 0 3px;
  }

  .ui-schedule-shortcut {
    float: left;
    padding: 2px 0 0 10px;
    line-height: 16px;
  }

  .ui-schedule-shortcut-text-item {
    color: #333;
    display: block;
    float: left;
    width: 60px;
    height: 20px;
    line-height: 20px;
    margin-right: 0;
  }

  .ui-schedule-shortcut-item {
    cursor: pointer;
    color: #333;
    display: block;
    float: left;
    padding: 0 10px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    margin-right: 10px;
    border: 1px solid #A8ADB6;
    -webkit-border-radius: 2px;
    -moz-border-radius: 2px;
    -o-border-radius: 2px;
    -ms-border-radius: 2px;
    border-radius: 2px;
  }

</style>

