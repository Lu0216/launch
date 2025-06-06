<template>
  <div>
    <div v-for="(city,index) in cities" :key="index" class="city_item">
      <Cityitem :message="message" :city="city"/>
    </div>
  </div>
</template>
<script>
import Cityitem from './cityitem'
export default {
  name: 'Section',
  components: { Cityitem },
  props: {
    // 所有广告位
    cities: {
      type: Array,
      default: () => Array
    },
    messagedata: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      message: ''
    }
  },
  methods: {
    send_message(val) {
      console.log(val)
      this
    }
  }
}
</script>
