<template>
  <v-avatar
    left
    :size="width"
    class="rounded-0"
  >
    <img
      :src="identicon"
      :title="title"
      :width="width"
      :height="height"
    />
  </v-avatar>
</template>

<script>
import mh from 'multihashes';
import b58 from 'b58';
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
    hex() {
      return mh.toHexString(b58.decode(this.hash));
    },

    identicon() {
      if (!this.hash) {
        return;
      }

      const base64 = new Identicon(this.hex, {
        size: config.IDENTICON.WIDTH,
        background: [0, 0, 0, 0],
      }).toString();

      return `data:image/png;base64,${base64}`;
    },
  },
};
</script>

<style scoped>

</style>
