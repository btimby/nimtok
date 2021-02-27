<template>
  <span>
    <v-btn
      small
      @click="roll"
      title="Your avatar can be changed at any time."
    >
      <v-icon>mdi-dice-3-outline</v-icon>
      Avatar
    </v-btn>
    <ImageUploader
      id="fileInput"
      ref="uploader"
      :preview="false"
      :maxWidth="80"
      :maxHeight="80"
      outputFormat="string"
      className="fileInput"
      @input="onUpload"
    >
      <label for="fileInput" slot="upload-label">
        <v-btn
          small
          @click="onClickUpload"
          title="Your avatar can be changed at any time."
        >
          <v-icon>mdi-upload</v-icon>
          Avatar
        </v-btn>
      </label>
    </ImageUploader>
  </span>
</template>

<script>
// TODO: replace / expand avatar libraries. Can support multiple sets.
import config from '@/config';
import ImageUploader from 'vue-image-upload-resize';

const PADDING = config.AVATAR.IMG_COUNT.toString().length;
const BASE_URL = `${process.env.BASE_URL}${config.AVATAR.IMG_BASE}`;

function urlToDataUrl(url) {
  /*
  Load an image off-screen and extract it as a data url.
  */
  const image = document.createElement('img');
  image.src = url;

  return new Promise((resolve, reject) => {
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0);

        const data = canvas.toDataURL('image/png');
        resolve(data);
      } catch (e) {
        reject(e);
      }
    };
  });
}

export default {
  components: {
    ImageUploader,
  },

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

  data() {
    return {
      index: 0,
    };
  },

  mounted() {
    // NOTE: This is an ugly hack. CSS does not have a parent selector, and the div is buried
    // in a component. Luckily it is the root element of said component. Thus I can access it.
    this.$refs.uploader.$el.style = 'display: inline-block;';
    this.roll();
  },

  methods: {
    update() {
      const name = config.AVATAR.IMG_NAME.replace('{}', this.index.toString().padStart(PADDING, '0'));
      const url = `${BASE_URL}${name}`;
      urlToDataUrl(url)
        .then((data) => {
          this.$emit('input', data);
        });
    },

    roll() {
      let random;
      // Ensure we don't pick the same number...
      do {
        random = Math.round(Math.random() * config.AVATAR.IMG_COUNT);
      } while (this.index == random);
      this.index = random;
      this.update();
    },

    next() {
      if (++this.index > config.AVATAR.IMG_COUNT) {
        this.index = 0;
      }
      this.update();
    },

    prev() {
      if (--this.index < 0) {
        this.index = config.AVATAR.IMG_COUNT;
      }
      this.update();
    },

    onClickUpload() {
      // Pass click along to file input field.
      document.getElementById('fileInput').click();
    },

    onUpload(data) {
      this.$emit('input', data);
    },
  },
};
</script>

<style>
#fileInput {
  display: none;
}
</style>
