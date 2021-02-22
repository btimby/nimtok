import nacl from 'tweetnacl';
import b58 from 'b58';
import router from '@/router';
import orbitdb from '@/orbitdb';
import config from '@/config';
import { str2arr, arr2str } from '@/utils';


function passwordKey(password) {
  // 64 byte hash:
  const hash = nacl.hash(new Uint8Array(password));
  const key = new Uint8Array(nacl.secretbox.keyLength);
  for (let i = 0; i < hash.length; i += 2) {
    key[i / 2] = hash[i];
  }
  return key;
}

function serializeUser(user) {
  // Serialize the user for storage. The user should consist of public and private fields.
  const key = passwordKey(user.password);
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  const secret = {
    identity: user.identity,
  };
  const obj = {
    ...user,
    id: user.identity.id,
    secret: b58.encode(nacl.secretbox(str2arr(JSON.stringify(secret)), nonce, key)),
    nonce: b58.encode(nonce),
  };
  delete obj.password;

  return obj;
}

function deserializeUser(obj, password) {
  const key = passwordKey(password);
  const nonce = b58.decode(obj.nonce);
  let secret = nacl.secretbox.open(b58.decode(obj.secret), nonce, key);
  if (secret === null) {
    return null;
  }
  secret = JSON.parse(arr2str(secret));
  const user = {
    ...obj,
    ...secret,
  };
  return user;
}

async function initDb(user) {
  const IpfsOptions = {
    repo: user.username,
    privateKey: user.identity.privKey,
    relay: {
      enabled: true,
      hop: {
        enabled: true,
        active: true,
      },
    },
    config: {
      Addresses: {
        Swarm: [
          config.SWARM_ADDR,
        ],
      },
    },
  };

  await orbitdb.connect({ IpfsOptions });

  // Open our databases here.
  orbitdb.add('profile', await orbitdb.odb.keyvalue('profile'));
  // Our posts go here.
  orbitdb.add('posts', await orbitdb.odb.feed('posts'));
  // Whom we follow.
  orbitdb.add('following', await orbitdb.odb.docs('following'));
  // discovered peers.
  orbitdb.add('peers', await orbitdb.odb.docs('peers'));
  // Open global, world writable database.
  orbitdb.add('hashtags', await orbitdb.odb.open(config.HASHTAG_DB, 'keyvalue'));
  // Inbox for direct messages.
  await orbitdb.openOrCreate('inbox', 'feed', {
    accessController: {
      write: ['*'],
    },
  });
  // Other users can write to this database to follow us.
  await orbitdb.openOrCreate('followers', 'docstore', {
    accessController: {
      write: ['*'],
    },
   });

  orbitdb.databases.inbox.events.on('replicated', () => {
    console.log('Received a DM.');
    // TODO: trigger a store action.
  });

  // Collect node information for discovery.
  const nodeInfo = {
    username: user.username,
    profile: orbitdb.databases.profile.id,
    inbox: orbitdb.databases.inbox.id,
    peers: orbitdb.databases.peers.id,
    posts: orbitdb.databases.posts.id,
  };
  
  // Set up pubsub.
  orbitdb.subscribe('discovery', 'peers/discovery');
  orbitdb.subscribe('discovery', ({ message }) => {
    orbitdb.publish(message.from, nodeInfo);
  });
  orbitdb.subscribe(orbitdb.id.id, 'peers/discovery');

  setTimeout(() => {
    orbitdb.publish('discovery', nodeInfo);
  }, 2000);
}

const state = {
  me: null,
  users: {},
};

const getters = {
  me: state => {
    return state.me;
  },

  authenticated: state => {
    return Boolean(state.me);
  },

  users: state => {
    return state.users;
  },
};

const actions = {
  login({ commit }, obj) {
    const { next, username, password } = obj;

    const auth = JSON.parse(localStorage.getItem(`auth:${username}`));
    if (!auth) {
      throw new Error('Invalid username or password');
    }

    const user = deserializeUser(auth, password);

    if (user === null) {
      throw new Error('Invalid username or password');
    }

    initDb(user)
      .then(() => {
        // Don't store sensitive fields in session.
        delete user.nonce;
        delete user.secret;
        commit('setMe', user);
        if (router.currentRoute.path !== next) {
          router.push(next);
        }
      })
      .catch(console.error);
  },

  tryLogin({ commit }) {
    try {
      const savedUser = JSON.parse(sessionStorage.getItem('auth:me'));

      if (savedUser) {
        initDb(savedUser)
          .then(() => {
            commit('setMe', savedUser);
            if (router.currentRoute.push !== '/feed') {
              router.push('/feed');
            }
          })
          .catch(console.error);
      }
    } catch (e) {
      console.error(e);
      console.warn('User not present in sessionStorage');
    }    
  },

  logout({ commit }, obj) {
    const { next } = obj;
    commit('delMe');
    orbitdb.shutdown();
    if (router.currentRoute.path !== next) {
      router.push(next);
    }
  },

  create({ commit }, obj) {
    const { next, user } = obj;

    if (!user.username || !user.password) {
      throw new Error('Invalid user, must have username and password.');
    }

    const auth = serializeUser(user);
    commit('addUser', auth);

    initDb(user)
      .then(() => {
        commit('setMe', auth);
        delete auth.identity;
        localStorage.setItem(`auth:${user.username}`, JSON.stringify(auth));
        router.replace(next);
          if (router.currentRoute.push !== next) {
          router.push(next);
        }
      })
      .catch(console.error);
  }
};

const mutations = {
  setMe(state, obj) {
    sessionStorage.setItem('auth:me', JSON.stringify(obj));
    state.me = obj;
  },

  delMe(state) {
    sessionStorage.clear('auth:me');
    state.me = undefined;
  },

  loadUsers(state) {
    let key;
    const users = {};

    for (let i = 0; (key = localStorage.key(i)); i++) {
      if (!key.startsWith('auth:')) {
        continue;
      }

      const username = key.substr(5);
      users[username] = JSON.parse(localStorage.getItem(key));
    }

    state.users = users;
  },

  addUser(state, obj) {
    state.users[obj.username] = obj;
  },
};


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
