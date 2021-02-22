<template>
  <v-dialog
    v-model="dialog"
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
              <v-text-field
                v-model="user.username"
                :rules="rules.username"
                label="username"
                counter
                autofocus
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="user.password"
                :rules="rules.password"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                counter
                @click:append="show = !show"
              />
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-btn
            :disabled="!valid"
            type="submit"
            @click="onLogin"
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
export default {
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
        password: null,
      },

      rules: {
        username: [
          v => !!v || 'Username is required',
        ],
        password: [
          v => !!v || 'Password is required',
          v => (v && v.length <= 8) || 'Password must be at least 8 chars.',
        ],
      },
    };
  },

  methods: {
    onLogin() {
      this.$store.dispatch('auth/login', { next: this.next, user: this.user });
      this.display = false;
    },
  },
}
</script>

<style scoped>

</style>