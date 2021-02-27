<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-spacer></v-spacer>
      <Login
        v-if="!authenticated"
        next="/feed"
      />
      <Account
        v-if="authenticated"
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
import Login from '@/components/user/Login';
import Account from '@/components/user/Account';
import Register from '@/components/register/Register';
import Footer from '@/components/Footer';
import { mapGetters } from 'vuex';

export default {
  name: 'App',

  components: {
    Login,
    Account,
    Register,
    Footer,
  },

  computed: {
    ...mapGetters({
      authenticated: 'auth/authenticated',
      me: 'auth/me',
    }),
  },
};
</script>
