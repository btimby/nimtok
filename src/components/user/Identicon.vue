<template>
  <img
    :src="`data:image/png;base64,${identicon}`"
    :title="title"
    :width="width"
    :height="height"
  />
</template>

<script>
import Identicon from 'identicon.js';
import config from '@/config';


export default {
  props: {
    hash: String,
    title: String,
    width: {
      type: Number,
      default: config.IDENTICON.WIDTH,
    },
    height: {
      type: Number,
      default: config.IDENTICON.HEIGHT,
    },
  },

  computed: {
    identicon() {
      if (!this.hash) {
        return;
      }

      return new Identicon(this.hash, {
        size: config.IDENTICON.WIDTH,
        background: [0, 0, 0, 0],
      }).toString();
    },
  },
}
</script>

<style scoped>

</style>