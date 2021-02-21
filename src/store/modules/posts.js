
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
    return new Promise((resolve, reject) => {
      Net.onready(async () => {
        let hash;

        try {
          hash = await Net.addPost(obj);
          console.log(`Added post: ${hash}`);
          commit('addPost', obj);
        } catch (e) {
          reject(e);
          return;
        }

        resolve(hash);
      });
    });
  },*/
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
