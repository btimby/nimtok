<template>
  <img
      :src="src"
      :width="width"
      :height="height"
  />
</template>

<script>
import config from '@/config';


export default {
  props: {
    value: String,

    width: {
      type: Number,
      default: config.AVATAR.WIDTH,
    },
    height: {
      type: Number,
      default: config.AVATAR.HEIGHT,
    },
  },
  
  computed: {
    src() {
      if (this.value) {
        return this.value;
      }
      return null;
    },
  },
}
</script>

<style scoped>

</style>