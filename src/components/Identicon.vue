<template>
  <div>
    <v-container>
      <v-row
        align="center"
        justify="center"
      >
        <v-img
          :src="`data:image/png;base64,${identicon}`"
          :maxWidth="dimensions.width"
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
          @click="roll"
        >
          <v-icon small>mdi-dice-5</v-icon>
        </v-btn>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import nacl from 'tweetnacl';
import Identicon from 'identicon.js';


const IMG_SIZE = {
  width: 80,
  height: 80
};


export default {
  created() {
    this.roll();
  },

  data() {
    return {
      dimensions: {
        width: IMG_SIZE.width,
        height: IMG_SIZE.height,
      },
      identity: null,
    };
  },

  computed: {
    identicon() {
      return new Identicon(this.identity, IMG_SIZE.width).toString();
    }
  },

  methods: {
    roll() {
      // TODO: this needs to generate a key pair for js-ipfs and use the public key for the identicon.
      // This key must then be used when connecting to the network.
      const random = nacl.randomBytes(32);
      this.identity = btoa(nacl.hash(random));
    },
  }
}
</script>

<style scoped>

</style>