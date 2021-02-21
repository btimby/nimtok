
const state = {
  peers: {
    count: 0,
    usernames: new Map(),
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
    commit('addPeer', {
      id: obj.message.from,
      username: obj.data.username
    });
  },
};

const mutations = {
  addFollowing(state, obj) {
    state.following.push(obj);
  },

  addPeer(state, obj) {
    if (state.peers.usernames.has(obj.id)) {
      return;
    }

    state.peers.usernames.set(obj.id, obj.username);
    state.peers.count++;
  }
};


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
