<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-spacer></v-spacer>
      <Login
        v-if="!authenticated && userCount"
        next="/feed"
      />
      <Logout
        v-if="authenticated"
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
          <v-col offset="2" cols="8">
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
      userCount: 'users/userCount',
      authenticated: 'auth/authenticated',
      me: 'auth/me',
    }),
  },
};
</script>
