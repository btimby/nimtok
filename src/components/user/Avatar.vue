<template>
  <v-avatar
    :size="width"
    class=".rounded-xl"
  >
    <img
      :src="src"
      :width="width"
      :height="height"
    />
  </v-avatar>
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
      if (!this.value) {
        return null;
      }

      if (this.value.startsWith('data:image/png;base64,')) {
        // Data URI
        return this.value;
      } if (this.value.startsWith('http') || this.value.startsWith('//')) {
        // Actual http(s) URL.
        return this.value;
      } if (isId(this.value)) {
        // The image is a CID, so the file is store in ipfs.
        if (config.AVATAR_USE_GATEWAY) {
          // Let a gateway fetch it for us.
          return `${config.IPFS_GATEWAY_URL}ipfs/${this.value}`;
        }
        // Fetch it directly from ipfs.
        return await this.loadImage(this.value);
      }
      debug('Could not determine image type');
      return null;
    },
  },

  methods: {
    async loadImage(cid) {
      const parts = [];

      for await (const chunk of orbitdb.node.cat(cid)) {
        debug('Got chunk of %i bytes', chunk.length);
        parts.push(chunk);
      }

      const blob = new Blob(parts, { type: 'image/png' });
      const reader = new FileReader(blob);

      return new Promise((resolve, reject) => {
        try {
          reader.onload = (e) => {
            resolve(e.target.result);
          };
          reader.readAsDataURL(blob);
        } catch (e) {
          reject(e);
        }
      });
    },
  },
};
</script>

<style scoped>

</style>
