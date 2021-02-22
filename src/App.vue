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
    </v-app-bar>
    <v-main>
      <v-container>
        <v-row>
          <v-col offset="3" cols="6">
            <router-view/>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <Footer/>
  </v-app>
</template>

<script>
import Login from '@/components/Login';
import Logout from '@/components/Logout';
import Register from '@/components/register/Register';
import Footer from '@/components/Footer';
import { mapGetters } from 'vuex';


export default {
  name: 'App',

  components: {
    Login,
    Logout,
    Register,
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
