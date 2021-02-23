<template>
  <v-btn
    @click="onLogout"
    text
  >
    <v-icon>mdi-logout</v-icon>
    <span class="mr-2">Logout</span>
  </v-btn>
</template>

<script>
import Debug from 'debug';

const debug = Debug('nimtok:Logout.vue');


export default {
  props: {
    next: null,
  },

  methods: {
    onLogout() {
      debug('onLogout()');

      // NOTE: this is done first to avoid racing with Login.vue.tryLogin().
      sessionStorage.removeItem('auth:me');

      this.$store
        .dispatch('auth/logout', { next: this.next })
        .then(() => {
          if (this.next && this.$route.path !== this.next) {
            this.$router.push(this.next);
          }
        })
        .catch(console.error);
    }
  }
}
</script>

<style scoped>

</style>