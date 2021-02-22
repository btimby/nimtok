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
import ChooseAvatar from '@/components/register/ChooseAvatar';
import ChooseIdentity from '@/components/register/ChooseIdentity';
import User from '@/components/user/User';


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
      }
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