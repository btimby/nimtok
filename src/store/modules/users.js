import mh from 'multihashes';
import b58 from 'b58';
import Debug from 'debug';
import orbitdb from '@/orbitdb';

const debug = Debug('nimtok:store:users');
const state = {
  userCount: 0,
  users: Object.create(null),
  username2Id: Object.create(null),
};

function isId(s) {
  // NOTE: QmViiHeEFRJE1FcN2K5QJnVxCND1bSAq2DZv8R1KeTLQCY
  try {
    mh.decode(b58.decode(s));
    return true;
  } catch (e) {
    return false;
  }
}

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
      commit('addUser', {
        id: user.id,
        username: user.username,
        ...profile.all,
      });
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

    state.users[obj.id] = obj;
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