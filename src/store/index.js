import Vue from 'vue';
import Vuex from 'vuex';
import auth from '@/store/modules/auth';
import peers from '@/store/modules/peers';
import posts from '@/store/modules/posts';


Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    auth,
    peers,
    posts,
  }
});


export default store;
