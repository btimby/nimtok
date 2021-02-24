import Vue from 'vue';
import Vuex from 'vuex';
import auth from '@/store/modules/auth';
import users from '@/store/modules/users';
import posts from '@/store/modules/posts';
import hashtags from '@/store/modules/hashtags';


Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    auth,
    users,
    posts,
    hashtags,
  }
});


export default store;
