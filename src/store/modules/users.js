import Debug from 'debug';
import { isId } from '@/utils';

const debug = Debug('nimtok:store:users');
const state = {
  userCount: 0,
  users: Object.create(null),
  username2Id: Object.create(null),
};

const getters = {
  userCount(state) {
    return state.userCount;
  },

  users(state) {
    return state.users;
  },
};

const actions = {
  async getUser({ state }, idOrUsername) {
    debug('actions.getUser(%O)', idOrUsername);

    if (!isId(idOrUsername)) {
      idOrUsername = state.username2Id[idOrUsername];
    }

    const user = state.users[idOrUsername];
    return user;
  },
};

const mutations = {
  ADD_USER(state, obj) {
    debug('mutations.ADD_USER(%O)', obj);

    // NOTE: updated in this manner to trigger a refresh.
    state.users = {
      ...state.users,
      [obj.id]: obj,
    };

    state.username2Id[obj.username] = obj.id;
    state.userCount = Object.keys(state.users).length;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
