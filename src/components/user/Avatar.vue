<template>
  <img
    :src="src"
    :width="width"
    :height="height"
  />
</template>

<script>
import Debug from 'debug';
import config from '@/config';
import orbitdb from '@/orbitdb';
import { isId } from '@/utils';

const debug = Debug('nimtok:Avatar.vue');


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

  asyncComputed: {
    async src() {
      if (this.value.startsWith('data:image/png;base64,')) {
        return this.value;
      } else if (isId(this.value)) {
        if (config.AVATAR_USE_GATEWAY) {
          return `${config.IPFS_GATEWAY_URL}ipfs/${this.value}`;
        } else {
          return await this.loadImage(this.value);
        }
      } else {
        debug('Could not determine image type');
      }
    },
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

      return new Promise((resolve, reject) => {
        try {
          reader.onload = (e) => {
            resolve(e.target.result);
          }
          reader.readAsDataURL(blob);
        } catch(e) {
          reject(e);
        }
      });
    }
  },
}
</script>

<style scoped>

</style>