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
                :show-arrows-on-hover="true"
                :show-arrows="this.userNames.length > 1"
                light
                height="140"
              >
                <v-carousel-item>
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
                        :avatar="user.avatar"
                        :identity="{ id: user.id }"
                        :username="user.username"
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
import { mapGetters } from 'vuex';
import User from '@/components/user/User';


export default {
  components: {
    User,
  },

  props: {
    next: null,
  },

  computed: {
    ...mapGetters({ users: 'auth/users' }),

    userNames() {
      return Object.keys(this.users);
    },

    user() {
      return this.users[this.userNames[this.index]];
    },
  },

  data() {
    return {
      show: false,
      index: 0,
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
      this.$store.dispatch('auth/login', {
        next: this.next,
        username: this.user.username,
        password: this.form.password,
      });
      this.display = false;
    },
  },
}
</script>

<style scoped>

</style>