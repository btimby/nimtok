<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
      </div>

      <v-spacer></v-spacer>

      <Login
        v-if="!authenticated"
        next="/feed"
      />
      <Logout
        v-else
        next="/"
      />
      <Register
        v-if="!authenticated"
        next="/feed"
      />
      <Publish
        v-if="authenticated"
      />
    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
    <Footer/>
  </v-app>
</template>

<script>
import Login from '@/components/Login';
import Logout from '@/components/Logout';
import Register from '@/components/Register';
import Publish from '@/components/Publish';
import Footer from '@/components/Footer';
import { mapGetters } from 'vuex';


export default {
  name: 'App',

  components: {
    Login,
    Logout,
    Register,
    Publish,
    Footer,
  },

  computed: {
    ...mapGetters({
      authenticated: 'auth/authenticated',
      me: 'auth/me',
    }),
  },

  data: () => ({
  }),

  methods: {
  },
};
</script>
