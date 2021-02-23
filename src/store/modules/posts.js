
const state = {
  posts: [],
};

const getters = {
  posts: state => {
    return state.posts;
  },
};

const actions = {
  /*create({ commit }, obj) {
    // Broadcast hashtags.

  }*/
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
