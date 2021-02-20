import net from '@/services/network';


net;

const state = {
  posts: [],
};

const getters = {
  posts: state => {
    return state.posts;
  },
};

const actions = {
  create({ commit }, obj) {
    // TODO: store in database etc.
    net.onready(() => {
      net._posts
        .add(obj)
        .then((hash) => {
          console.log(`Added post: ${hash}`);
          commit('addPost', obj);
        })
        .catch(console.error);
    });
  },
};

const mutations = {
  addPost(state, obj) {
    state.posts.push(obj);
  },
};


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
