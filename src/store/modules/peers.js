
const state = {
  peers: {
    count: 0,
  },
  global: [],
  following: [],
};

const getters = {
  following: state => {
    return state.following;
  },

  peerCount: state => {
    return state.peers.count;
  },
};

const actions = {
  follow({ commit }, obj) {
    // TODO: store in database etc.
    commit('addFollowing', obj);
  },

  discovery({ commit }, obj) {
    console.log('peers/discovery');
    obj;
    commit('incrPeers', 1);
  },

  /*countUsers({ commit }) {
    net
      .getPeers()
      .then((users) => {
        if (users) {
          commit('updateCount', users.length);
        }
      })
      .catch(console.error);
  }*/
};

const mutations = {
  addFollowing(state, obj) {
    state.following.push(obj);
  },

  incrPeers(state, count) {
    state.peers.count += count;
  }
};


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
