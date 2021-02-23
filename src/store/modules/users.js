import orbitdb from '@/orbitdb';


const state = {
  userCount: 0,
  users: Object.create(null),
  username2Id: Object.create(null),
};

function isId(s) {
  // NOTE: QmViiHeEFRJE1FcN2K5QJnVxCND1bSAq2DZv8R1KeTLQCY
  return s.startsWith('Qm') && s.length == 46;
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
  discovery({ commit }, obj) {
    commit('addUser', {
      id: obj.message.from,
      ...obj.data.data,
    });

    let db;
    if ((db = orbitdb.databases.peers)) {
      db
        .put({
          _id: obj.message.from,
          ...obj.data.data,
        })
        .catch(console.error);
    }
  },

  loadUsers({ commit }) {
    let key;

    for (let i = 0; (key = localStorage.key(i)); i++) {
      if (!key.startsWith('auth:')) {
        continue;
      }

      const user = JSON.parse(localStorage.getItem(key));
      commit('addUser', user);
    }
  },

  async getUser({ commit, state }, idOrUsername) {
    if (!isId(idOrUsername)) {
      idOrUsername = state.username2Id[idOrUsername];
    }
    let user = state.users[idOrUsername];

    if (!user) {
      // Get the user from OrbitDB.
      let db;
      if ((db = orbitdb.databases.peers)) {
        user = db.get(idOrUsername);
      }

      if (user) {
        commit('addUser', {
          id: idOrUsername,
          ...user,
        });
      }
    }

    if (user && user.profile) {
      // Get profile...
      const db = await orbitdb.odb.open(user.profile);
      db.events.on('ready', () => {
        console.log(db.all);
      })
      await db.load();
    }

    return user;
  },
};

const mutations = {
  addUser(state, obj) {
    if (state.users[obj.username]) {
      console.warn('Skipping addUser, user exists. Perhaps you need updateUser()?');
      return;
    }

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
