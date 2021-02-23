import Debug from 'debug';


const debug = Debug('nimtok:store:posts');
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
    debug('mutations.addPost(%O)', obj);

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
