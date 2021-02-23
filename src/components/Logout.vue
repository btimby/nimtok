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
export default {
  props: {
    next: null,
  },

  methods: {
    onLogout() {
      this.$store
        .dispatch('auth/logout', { next: this.next })
        .then(() => {
          sessionStorage.clear('auth:me');
          if (this.next && this.$router.currentRoute.path !== this.next) {
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