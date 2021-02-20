<template>
  <v-dialog
    v-model="dialog"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        text
      >
        <span class="mr-2">Register</span>
        <v-icon>mdi-account-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar
        color="primary"
      >
        <v-toolbar-title>Register</v-toolbar-title>
      </v-toolbar>
      <v-form>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                v-model="user.email"
                label="email"
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="user.username"
                label="username"
                required
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="user.password"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                counter
                @click:append="show = !show"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <v-card-actions>
        <v-btn
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
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      dialog: false,

      user: {
        username: null,
        email: null,
        password: null,
      }
    };
  },

  methods: {
    onRegister() {
      this.$store.dispatch('auth/create', this.user);
      this.dialog = false;
    },
  },
}
</script>

<style scoped>

</style>