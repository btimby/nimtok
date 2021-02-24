<template>
  <img
    ref="img"
    :width="width"
    :height="height"
  />
</template>

<script>
import Debug from 'debug';
import config from '@/config';
import orbitdb from '@/orbitdb';

const debug = Debug('nimtok:Avatar.vue');


export default {
  props: {
    value: Object,

    width: {
      type: Number,
      default: config.AVATAR.WIDTH,
    },
    height: {
      type: Number,
      default: config.AVATAR.HEIGHT,
    },
  },

  mounted() {
    if (this.value.data) {
      this.$refs.img.setAttribute('src', this.value.data);
    } else if (this.value.cid) {
      debug('Loading image from ipfs');
      this
        .loadImage(this.value.cid)
        .catch(console.error);
    }
  },

  methods: {
    async loadImage(cid) {
      const parts = [];

      for await (const chunk of orbitdb.node.cat(cid)) {
        debug('Got chunk of %i bytes', chunk.length)
        parts.push(chunk);
      }
      const blob = new Blob(parts, { type: 'image/png' });
      const reader = new FileReader(blob);
      reader.onload = (e) => {
        this.$refs.img.setAttribute('src', e.target.result);
      }
      reader.readAsDataURL(blob);
    }
  },
}
</script>

<style scoped>

</style>