<template>
  <v-btn
    small
    @click="roll"
    title="Your identity cannot be changed."
  >
    <v-icon>mdi-dice-3-outline</v-icon>
    Identity
  </v-btn>
</template>

<script>
// We could support different identicon styles or libraries, robots, mosters etc.
// and let the user choose.
import PeerId from 'peer-id';
import config from '@/config';


export default {
  components: {
  },

  props: {
    value: Object,
  },

  mounted() {
    this.roll();
  },

  methods: {
    roll() {
      // TODO: this needs to generate a key pair for js-ipfs and use the public key for the identicon.
      // This key must then be used when connecting to the network.
      PeerId.create(config.PEER_KEY_OPTS).then((id) => {
        this.$emit('input', id.toJSON());
      });
    },
  }
}
</script>

<style scoped>

</style>