import Debug from 'debug';
import store from '@/store';


const debug = Debug('nimtok:store:posts');
const state = {
  posts: {},
};

const getters = {
  posts: state => {
    return state.posts;
  },
};

const actions = {
  post({ commit}, obj) {
    debug('actions.post(%O)', obj);

    store.dispatch('hashtags/incr', obj.hashtags);

    const me = store.getters['auth/me'];
    commit('addPost', {
      user: { id: me.id, },
      body: obj.body,
      hashtags: obj.hashtags,
      mentions: obj.mentions,
    });
  },
};

const mutations = {
  addPost(state, obj) {
    debug('mutations.addPost(%O)', obj);

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
