import net from '@/services/network';


net;

const state = {
  global: [],
  following: [],
};

const getters = {
  following: state => {
    return state.following;
  },
};

const actions = {
  follow({ commit }, obj) {
    // TODO: store in database etc.
    commit('addFollowing', obj);
  },
};

const mutations = {
  addFollowing(state, obj) {
    state.following.push(obj);
  },
};


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
