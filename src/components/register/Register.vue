<template>
  <v-dialog
    v-model="dialog"
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
                v-model="user.email"
                :rules="rules.email"
                label="email"
                autofocus
                required
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="user.username"
                :rules="rules.username"
                label="username"
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="user.password"
                :rules="rules.password"
                label="password"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                counter
                @click:append="show = !show"
              />
              <v-textarea
                v-model="user.bio"
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
                  :identity="user.identity"
                  :username="user.username"
                  :avatar="user.avatar"
                />
                <v-card-actions>
                  <ChooseAvatar
                    v-model="user.avatar"
                  />
                  <ChooseIdentity
                    v-model="user.identity"
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
            @click.prevent="onRegister"
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

  data() {
    return {
      show: false,
      dialog: false,
      valid: true,

      user: {
        username: null,
        confirm: null,
        email: null,
        password: null,
        avatar: null,
        identity: {
          id: null,
        },
        bio: null,
      },

      rules: {
        username: [
          v => !!v || 'Username is required',
          v => (v && 8 <= v.length <= 32) || 'User must be between 8 and 32 chars',
        ],
        email: [
          v => !!v || 'Email is required',
          v => config.PATTERN_EMAIL.test(v) || 'E-mail must be valid',
        ],
        password: [
          v => !!v || 'Password is required',
          v => (v && v.length <= 8) || 'Password must be at least 8 chars.',
          v => config.PATTERN_USERNAME.test(v) || 'Password must contain at least lowercase letter, one number, a special character and one uppercase letter',
        ],
      },

    };
  },

  methods: {
    onRegister() {
      this.$store.dispatch('auth/create', { next: this.next, user: this.user });
      this.dialog = false;
    },
  },
}
</script>

<style scoped>

</style>