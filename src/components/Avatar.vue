<template>
  <div>
    <v-container>
      <v-row
        align="center"
        justify="center"
      >
        <v-img
          :src="`${baseUrl}${current}`"
          :width="dimensions.width"
          :max-width="dimensions.width"
          :height="dimensions.height"
        ></v-img>
      </v-row>
      <v-row
        align="center"
        justify="center"
      >
        <v-btn
          small
          icon
          @click="prev"
        >
          <v-icon small>mdi-arrow-left</v-icon>
        </v-btn>
        <v-btn
          small
          icon
          @click="roll"
        >
          <v-icon small>mdi-dice-5</v-icon>
        </v-btn>
        <v-btn
          small
          icon
          @click="next"
        >
          <v-icon small>mdi-arrow-right</v-icon>
        </v-btn>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// TODO: replace / expand avatar libraries. Can support multiple sets.
import config from '@/config';

const PADDING = config.AVATAR.IMG_COUNT.toString().length;


export default {
  data() {
    return {
      baseUrl: `${process.env.BASE_URL}${config.AVATAR.IMG_BASE}`,
      index: 0,
      dimensions: {
        width: config.AVATAR.WIDTH,
        height: config.AVATAR.HEIGHT,
      }
    };
  },

  computed: {
    current() {
      return config.AVATAR.IMG_NAME.replace('{}', this.index.toString().padStart(PADDING, '0'));
    },
  },

  methods: {
    roll() {
      this.index = Math.round(Math.random() * config.AVATAR.IMG_COUNT);
    },

    next() {
      if (++this.index > config.AVATAR.IMG_COUNT) {
        this.index = 0;
      }
    },

    prev() {
      if (--this.index < 0) {
        this.index = config.AVATAR.IMG_COUNT;
      }
    },
  }
}
</script>

<style scoped>

</style>