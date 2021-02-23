<template>
  <v-dialog
    v-model="dialog"
    max-width="800"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        text
      >
        <v-icon>mdi-account-plus</v-icon>
        <span class="mr-2">Register</span>
      </v-btn>
    </template>
    <v-card>
      <v-form
        v-model="valid"
        @submit.prevent="onRegister"
      >
        <v-toolbar
          color="primary"
        >
          <v-toolbar-title>Register</v-toolbar-title>
        </v-toolbar>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                v-model="form.email"
                :rules="rules.email"
                label="email"
                autofocus
                required
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="form.username"
                :rules="rules.username"
                label="username"
                counter
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="form.password"
                :rules="rules.password"
                label="password"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                counter
                @click:append="show = !show"
              />
              <v-textarea
                v-model="form.bio"
                label="bio"
              />
            </v-col>
            <v-col>
              <v-card>
                <v-list-item>
                  <v-list-item-avatar color="gray"></v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="headline">How the world will see you.</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <User
                  :identity="form.identity"
                  :username="form.username"
                  :avatar="form.avatar"
                />
                <v-card-actions>
                  <ChooseAvatar
                    v-model="form.avatar"
                  />
                  <ChooseIdentity
                    v-model="form.identity"
                  />
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-btn
            :disabled="!valid"
            type="submit"
          >
            Register
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
import ChooseAvatar from '@/components/register/ChooseAvatar';
import ChooseIdentity from '@/components/register/ChooseIdentity';
import User from '@/components/user/User';
import config from '@/config';


export default {
  components: {
    ChooseAvatar,
    ChooseIdentity,
    User,
  },

  props: {
    next: null,
  },

  computed: {
    ...mapGetters({users: 'users/users'}),
  },

  data() {
    return {
      show: false,
      dialog: false,
      valid: true,

      form: {
        username: null,
        email: null,
        password: null,
        avatar: null,
        identity: {},
        bio: null,
      },

      rules: {
        username: [
          v => this.users && !this.users[v] || 'Username already used',
          v => !!v || 'Username is required',
          v => (v && v.length >= config.USERNAME.MIN_LENGTH && v.length <= config.USERNAME.MAX_LENGTH) || 'User must be between 8 and 32 chars',
          v => config.PATTERN_USERNAME.test(v) || 'Username contains invalid chars.',
        ],
        email: [
          v => !!v || 'Email is required',
          v => config.PATTERN_EMAIL.test(v) || 'E-mail must be valid',
        ],
        password: [
          v => !!v || 'Password is required',
          v => (v && v.length >= 8) || 'Password must be at least 8 chars.',
          v => config.PATTERN_PASSWORD.test(v) || 'Password must contain at least lowercase letter, one number, a special character and one uppercase letter',
        ],
      },

    };
  },

  methods: {
    onRegister() {
      this.$store
        .dispatch('auth/create', {
          user: this.form,
        })
        .then((auth) => {
          // Save user to localstorage (for Login).
          delete auth.identity;
          localStorage.setItem(`auth:${auth.username}`, JSON.stringify(auth));
          this.dialog = false;
          if (this.next && this.$route.push !== this.next) {
            this.$router.push(this.next);
          }
        })
        .catch(console.error);
    },
  },
}
</script>

<style scoped>

</style>