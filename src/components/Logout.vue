<template>
  <v-btn
    @click="onLogout"
    text
  >
    <span class="mr-2">Logout</span>
    <v-icon>mdi-logout</v-icon>
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