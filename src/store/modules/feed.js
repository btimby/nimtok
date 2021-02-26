import Debug from 'debug';


const debug = Debug('nimtok:store:feed');
const state = {
  feed: [],
  new: {
    posts: 0,
  }
};

const getters = {
  feed: state => {
    return state.feed;
  },
};

const actions = {
  addItem({ commit }, obj) {
    debug('actions.addItem(%O)', obj);

    commit('addItem', obj);
  },
};

const mutations = {
  addItem(state, obj) {
    debug('mutations.addItem(%O)', obj);

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
