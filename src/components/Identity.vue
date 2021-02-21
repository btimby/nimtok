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
// We could support different identicon styles or libraries, robots, mosters etc.
// and let the user choose.
import PeerId from 'peer-id';
import Identicon from 'identicon.js';
import config from '@/config';


export default {
  props: {
    value: Object,
  },

  created() {
    this.roll();
  },

  data() {
    return {
      dimensions: {
        width: config.IDENTICON.WIDTH,
        height: config.IDENTICON.HEIGHT,
      },
    };
  },

  computed: {
    identicon() {
      if (!this.value.id) {
        return;
      }
      return new Identicon(this.value.id, config.IDENTICON.WIDTH).toString();
    }
  },

  methods: {
    roll() {
      // TODO: this needs to generate a key pair for js-ipfs and use the public key for the identicon.
      // This key must then be used when connecting to the network.
      PeerId.create(config.PEER_KEY_OPTS).then((id) => {
        const value = id.toJSON();
        value.id = id.toHexString();
        this.$emit('input', value);
      });
    },
  }
}
</script>

<style scoped>

</style>