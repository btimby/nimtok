<template>
  <img
      :src="url"
      :width="width"
      :height="height"
  />
</template>

<script>
import config from '@/config';


export default {
  props: {
    src: String,
    cid: String,
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
    url() {
      // TODO: support ipfs CID.
      return this.src;
    }
  },
}
</script>

<style scoped>

</style>