import Debug from 'debug';


const debug = Debug('nimtok:store:hashtags');
const state = {
  hashtags: {},
};

const getters = {
  hashtags: state => {
    return state.hashtags;
  },
};

const actions = {
  incr({ commit }, hashtags, n = 1) {
    // Broadcast hashtags.
    for (let i in hashtags) {
      commit('incr', hashtags[i], n);
    }
  }
};

const mutations = {
  incr(state, tag, n = 1) {
    debug('mutations.incr(%s, %i)', tag, n);

    if (!state.hashtags[tag]) {
      state.hashtags[tag] = n;
      return;
    }
    state.hashtags[tag] += n;
  },
};


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
