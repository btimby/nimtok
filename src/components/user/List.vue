<template>
  <v-container>
    <User
      v-for="(user, i) in users"
      :key="i"
      :identity="{ id: user.id }"
      :avatar="user.avatar"
      :username="user.username"
    />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';
import User from '@/components/user/User.vue'


export default {
  name: 'List',

  components: {
    User,
  },

  computed: {
    ...mapGetters({ users: 'users/users' }),
  }
}
</script>

<style scoped>

</style>