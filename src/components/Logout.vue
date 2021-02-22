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
      this.$store.dispatch('auth/logout', { next: this.next });
    }
  }
}
</script>

<style scoped>

</style>