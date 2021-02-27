<template>
  <v-container
    id="container"
  >
    <v-row id="row">
      <Avatar
        :value="avatar"
      />
      <span id="username">
        <Identity
          :hash="identity.id"
        />
        <span
          :title="usernameOrDefault"
        >{{ usernameOrDefault | truncate(10) }}</span>
      </span>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import Identity from '@/components/user/Identity';
import Avatar from '@/components/user/Avatar';

export default {
  components: {
    Identity,
    Avatar,
  },

  props: {
    identity: Object,
    avatar: String,
    username: String,

    small: Boolean,
    large: Boolean,
  },

  computed: {
    usernameOrDefault() {
      return this.username || 'Username';
    },
  },

  mounted() {
    if (!this.id) {
      return;
    }

    this
      .getUser(this.id)
      .then((user) => {
        this.user = {
          ...user,
          identity: {
            id: this.id,
          },
        };
      })
      .catch(console.error);
  },

  methods: {
    ...mapActions({ getUser: 'users/getUser' }),
  },
};
</script>

<style scoped>
#container {
  text-align: center;
  padding: 10px 0px 0px 0px;
}

#row {
  display: inline-block;
  white-space: nowrap;
  text-align: center;
}

#username {
  display: flex;
  align-items: center;
  height: 24px;
  font-size: 18px;
  font-weight: bold;
}

#username img {
  float: left;
  margin-right: 3px;
}
</style>
