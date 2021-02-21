<template>
  <div>
    <v-container>
      <v-row
        align="center"
        justify="center"
      >
        <v-img
          :src="`${baseUrl}${avatars.images[avatars.current]}`"
          :width="avatars.dimensions.width"
          :max-width="avatars.dimensions.width"
          :height="avatars.dimensions.height"
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
// TODO: replace / expand these. Can support multiple sets.
const IMG_BASE = 'avatars/avatar-{}.png';
const IMG_COUNT = 15;
const IMG_SIZE = {
  width: 80,
  height: 80
};


export default {
  created() {
    const padding = IMG_COUNT.toString().length;

    for (let i = 0; i <= IMG_COUNT; i++) {
      this.avatars.images.push(IMG_BASE.replace('{}', i.toString().padStart(padding, '0')));
    }
    this.roll();
  },

  data() {

    return {
      baseUrl: process.env.BASE_URL,
      avatars: {
        current: 0,
        images: [],
        dimensions: {
          width: IMG_SIZE.width,
          height: IMG_SIZE.height,
        }
      },
    };
  },

  methods: {
    roll() {
      this.avatars.current = Math.round(Math.random() * IMG_COUNT);
    },

    next() {
      if (++this.avatars.current == this.avatars.images.length) {
        this.avatars.current = 0;
      }
    },

    prev() {
      if (--this.avatars.current < 0) {
        this.avatars.current = this.avatars.images.length - 1;
      }
    },
  }
}
</script>

<style scoped>

</style>