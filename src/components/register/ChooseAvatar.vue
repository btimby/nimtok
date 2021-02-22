<template>
      <v-btn
        small
        @click="roll"
      >
        <v-icon
          small
          left
        >mdi-dice-5</v-icon>
        Avatar
      </v-btn>
</template>

<script>
// TODO: replace / expand avatar libraries. Can support multiple sets.
import config from '@/config';

const PADDING = config.AVATAR.IMG_COUNT.toString().length;
const BASE_URL = `${process.env.BASE_URL}${config.AVATAR.IMG_BASE}`

export default {
  props: {
    width: {
      type: Number,
      default: config.AVATAR.WIDTH,
    },
    height: {
      type: Number,
      default: config.AVATAR.HEIGHT,
    },
  },

  data() {
    return {
      index: 0,
    };
  },

  mounted() {
    this.roll();
  },

  computed: {
    url() {
      const name = config.AVATAR.IMG_NAME.replace('{}', this.index.toString().padStart(PADDING, '0'));
      const url = `${BASE_URL}${name}`;
      return url;
    },
  },

  methods: {
    roll() {
      let random;
      // Ensure we don't pick the same number...
      do {
        random = Math.round(Math.random() * config.AVATAR.IMG_COUNT);
      } while (this.index == random);
      this.index = random;
      this.$emit('input', this.url);
    },

    next() {
      if (++this.index > config.AVATAR.IMG_COUNT) {
        this.index = 0;
      }
      this.$emit('input', this.url);
    },

    prev() {
      if (--this.index < 0) {
        this.index = config.AVATAR.IMG_COUNT;
      }
      this.$emit('input', this.url);
    },
  }
}
</script>

<style scoped>

</style>