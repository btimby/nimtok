import Debug from 'debug';
import store from '@/store';

const debug = Debug('nimtok:store:posts');
const state = {
  posts: {},
};

const getters = {
  posts: (state) => state.posts,
};

const actions = {
  post({ commit }, obj) {
    debug('actions.post(%O)', obj);

    store.dispatch('hashtags/incr', obj.hashtags);
    store.dispatch('mentions/incr', obj.mentions);

    const me = store.getters['auth/me'];
    commit('ADD_POST', {
      user: { id: me.id },
      body: obj.body,
      hashtags: obj.hashtags,
      mentions: obj.mentions,
    });
  },
};

const mutations = {
  ADD_POST(state, obj) {
    debug('mutations.ADD_POST(%O)', obj);

    let posts = state.posts[obj.user.id];
    if (!posts) {
      posts = state.posts[obj.user.id] = [];
    }
    posts.push(obj.body);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
