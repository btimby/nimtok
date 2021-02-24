import Debug from 'debug';
import orbitdb from '@/orbitdb';
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
  // This action is called by pubsub when a new user announces themself.
  discovery({ dispatch }, obj) {
    debug('actions.discovery(%O)', obj);

    dispatch('addUser', {
        id: obj.message.from,
        username: obj.data.username,
        profile: obj.data.profile,
      })
      .catch(console.error);
  },

  async addUser({ commit }, user) {
    debug('actions.addUser(%O)', user);
    // Get profile data.
    const profile = await orbitdb.odb.open(user.profile);

    profile.events.on('ready', () => {
      debug('actions.addUser():profile %O', profile.all);
      const attrs = profile.all;
      attrs.id = user.id;
      attrs.username = user.username;
      attrs.profile = profile.id;
      commit('addUser', attrs);
    });
    await profile.load();
  },

  async getUser({ state }, idOrUsername) {
    debug('actions.getUser(%O)', idOrUsername);

    if (!isId(idOrUsername)) {
      idOrUsername = state.username2Id[idOrUsername];
    }

    let user = state.users[idOrUsername];
    return user;
  },
};

const mutations = {
  addUser(state, obj) {
    debug('mutations.addUser(%O)', obj);

    // NOTE: updated in this manner to trigger a refresh.
    state.users = {
      ...state.users,
      [obj.id]: obj,
    }

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
