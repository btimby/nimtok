<template>
  <v-dialog
    v-model="dialog"
    :max-width="400"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        text
      >
        <v-icon>mdi-login</v-icon>
        <span class="mr-2">Login</span>
      </v-btn>
    </template>
    <v-card>
      <v-form
        v-model="valid"
        @submit.prevent="onLogin"
      >
        <v-toolbar
          color="primary"
        >
          <v-toolbar-title>Login</v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-row>
            <v-col>
              <v-carousel
                v-model="index"
                hide-delimiters
                :show-arrows="users.length > 1"
                light
                height="140"
              >
                <v-carousel-item
                  v-for="(user, i) in users"
                  :key="i"
                >
                  <v-sheet
                    height="100%"
                    tile
                  >
                    <v-row
                      class="fill-height"
                      align="center"
                      justify="center"
                    >
                      <User
                        :avatar="avatar"
                        :identity="identity"
                        :username="username"
                      />
                    </v-row>
                  </v-sheet>
                </v-carousel-item>
              </v-carousel>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="form.password"
                :rules="rules.password"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                name="password"
                autofocus
                @click:append="show = !show"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <p>
                Account not listed?
                <a href="">Import</a> an existing account, or <router-link to="/register">register</router-link> a new one.
              </p>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-btn
            :disabled="!valid"
            type="submit"
          >
            Login
          </v-btn>
          <v-btn
            @click="dialog = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import Debug from 'debug';
import User from '@/components/user/User';

const debug = Debug('nimtok:Login.vue');


export default {
  components: {
    User,
  },

  props: {
    next: null,
  },

  computed: {
    avatar() {
      return this.user && this.user.avatar;
    },

    identity() {
      return {
        id: this.user && this.user.id,
      };
    },

    username() {
      return this.user && this.user.username;
    },

    user() {
      return this.users[this.index];
    },
  },

  mounted() {
    let key;

    for (let i = 0; (key = localStorage.key(i)); i++) {
      if (!key.startsWith('auth:')) {
        continue;
      }

      const user = JSON.parse(localStorage.getItem(key));
      // TODO: remove this, it temporarily works around an issue.
      if (user.avatar && user.avatar.data) {
        user.avatar = user.avatar.data;
      }
      this.users.push(user);
    }

    this.tryLogin();
  },

  data() {
    return {
      show: false,
      index: 0,
      users: [],
      dialog: false,
      valid: true,

      form: {
        password: null,
      },

      rules: {
        username: [
          v => !!v || 'Username is required',
        ],
        password: [
          v => !!v || 'Password is required',
        ],
      },
    };
  },

  methods: {
    onLogin() {
      debug('onLogin()');

      this.$store
        .dispatch('auth/login', {
          next: this.next,
          username: this.user.username,
          password: this.form.password,
        })
        .then(this.onAfterLogin)
        .catch(console.error);
    },

    tryLogin() {
      debug('tryLogin()');

      let user;

      try {
        user = JSON.parse(sessionStorage.getItem('auth:me'));

      } catch (e) {
        console.error(e);
        console.warn('User not present in sessionStorage');
      }    

      if (user) {
        this.$store
          .dispatch('auth/login', { user })
          .then(this.onAfterLogin)
          .catch(console.error);
      }
    },

    onAfterLogin(user) {
      debug('setSession(%O)', user);

      sessionStorage.setItem('auth:me', JSON.stringify(user));
      if (this.next && this.$route.path !== this.next) {
        this.$router.push(this.next);
      }
      this.dialog = false;
    }
  },
}
</script>

<style scoped>

</style>