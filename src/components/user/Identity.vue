<template>
    <Identicon
      :hash="hash"
      :width="width"
      :height="height"
      :title="shortCode"
    />
</template>

<script>
import Identicon from '@/components/user/Identicon';
import config from '@/config';

export default {
  components: {
    Identicon,
  },

  props: {
    hash: String,
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
    shortCode() {
      if (!this.hash) {
        return null;
      }

      return this.hash.slice(-8).split('').reverse().join('');
    },
  },
};
</script>

<style scoped>

</style>
