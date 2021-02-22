<template>
  <v-container
    id="container"
  >
    <v-row id="chosen">
      <Avatar
        :src="avatar"
      />
      <span id="username">
        <Identity
          :hash="identity.id"
          :width="24"
          :height="24"
        />
        <span
          :title="usernameOrDefault"
        >{{ usernameOrDefault | truncate(10) }}</span>
      </span>
    </v-row>
  </v-container>
</template>

<script>
import Identity from '@/components/user/Identity';
import Avatar from '@/components/user/Avatar';


export default {
  components: {
    Identity,
    Avatar,
  },

  props: {
    avatar: String,
    username: String,
    identity: Object,

    small: Boolean,
    large: Boolean,
  },

  computed: {
    usernameOrDefault() {
      return this.username || "Username";
    }
  }
}
</script>

<style scoped>
#container {
  text-align: center;
  padding: 10px 0px 0px 0px;
}

#chosen {
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