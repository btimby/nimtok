import Debug from 'debug';

const debug = Debug('nimtok:store:feed');
const state = {
  feed: [],
  new: {
    posts: 0,
  },
};

const getters = {
  feed: (state) => state.feed,
};

const actions = {
  addItem({ commit }, obj) {
    debug('actions.addItem(%O)', obj);

    commit('ADD_ITEM', obj);
  },
};

const mutations = {
  ADD_ITEM(state, obj) {
    debug('mutations.ADD_ITEM(%O)', obj);

    state.feed.push(obj);
    state.new.posts++;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
