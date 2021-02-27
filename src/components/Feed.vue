<template>
  <div>
    <v-tabs
      value="selected"
      centered
    >
      <v-tab
        href="#feed"
      >
        Feed
      </v-tab>
      <v-tab
        href="#publish"
      >
        Publish
      </v-tab>
      <v-tab
        href="#private"
      >
        Private
      </v-tab>
      <v-tab
        href="#users"
      >
        Users
      </v-tab>

      <v-tab-item
        value="feed"
      ></v-tab-item>
      <v-tab-item
        value="publish"
      >
        <Publish/>
      </v-tab-item>
      <v-tab-item
        value="private"
      ></v-tab-item>
      <v-tab-item
        value="users"
      >
        <UserList/>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import Publish from '@/components/message/Publish';
import UserList from '@/components/user/List';

export default {
  components: {
    Publish,
    UserList,
  },

  props: {
    tab: String,
  },

  data() {
    return {
      selected: this.tab,
    };
  },
};
</script>

<style scoped>

</style>
