<template>
  <v-menu
    offset-y
  >
    <template v-slot:activator="{ on, attrs}">
      <v-btn
        color="primary"
        dark
        v-bind="attrs"
        v-on="on"
      >
        <Identicon
          :hash="me.id"
        />
        {{ me.username }}
      </v-btn>
    </template>

    <v-list>
      <v-list-item>
        <v-list-item-title>Edit Profile</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
// import Debug from 'debug';
import { mapGetters } from 'vuex';
import Identicon from './Identicon.vue';

// const debug = Debug('nimtok:Account.vue');


export default {
  name: 'Account',

  components: {
    Identicon,
  },

  computed: {
    ...mapGetters({ me: 'auth/me' }),
  },
}
</script>

<style scoped>

</style>