<template>
  <v-footer
    color="primary lighten-1"
  >
    <v-row>
      <v-col>
        <v-chip
          class="ma-2"
          color="success"
          :to="{path: '/feed', query: { tab: 'users' }}"
          pill
        >
          <v-icon>mdi-lan-connect</v-icon>
          Users {{ userCount | number('0a') }}
        </v-chip>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      userCount: 'users/userCount',
      authenticated: 'auth/authenticated',
    }),
  },
};
</script>

<style scoped>

</style>
