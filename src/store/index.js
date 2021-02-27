import Vue from 'vue';
import Vuex from 'vuex';
import auth from '@/store/modules/auth';
import users from '@/store/modules/users';
import posts from '@/store/modules/posts';
import hashtags from '@/store/modules/hashtags';
import mentions from '@/store/modules/mentions';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    auth,
    users,
    posts,
    hashtags,
    mentions,
  },
});

export default store;
