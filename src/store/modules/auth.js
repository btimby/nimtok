import nacl from 'tweetnacl';
import b58 from 'b58';
import router from '@/router';
import orbitdb from '@/orbitdb';
import config from '@/config';


function passwordKey(password) {
  // 64 byte hash:
  const hash = nacl.hash(new Uint8Array(password));
  const key = new Uint8Array(nacl.secretbox.keyLength);
  for (let i = 0; i < hash.length; i += 2) {
    key[i / 2] = hash[i];
  }
  return key;
}

async function initDb(user) {
  const IpfsOptions = {
    repo: user.username,
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
  orbitdb.add('posts', await orbitdb.odb.feed('posts'));
  orbitdb.add('following', await orbitdb.odb.docs('following'));
  orbitdb.add('peers', await orbitdb.odb.docs('peers'));
  orbitdb.add('hashtags', await orbitdb.odb.keyvalue('hashtags'));

  // Collect node information for discovery.
  const nodeInfo = {
    username: user.username,
    profile: orbitdb.databases.profile.id,
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
};

const getters = {
  me: state => {
    return state.me;
  },

  authenticated: state => {
    return Boolean(state.me);
  }
};

const actions = {
  login({ commit }, obj) {
    const { next, user } = obj;

    if (!user.username || !user.password) {
      throw new Error('Invalid user, must have username and password.');
    }

    const key = passwordKey(user.password);
    delete user.password;

    const auth = JSON.parse(localStorage.getItem(`auth:${user.username}`));
    if (!auth) {
      throw new Error('Invalid username or password');
    }

    const msg = b58.decode(auth.msg);
    const nonce = b58.decode(auth.nonce);

    obj = nacl.secretbox.open(msg, nonce, key);

    if (obj === null) {
      throw new Error('Invalid username or password');
    }

    initDb(user)
      .then(() => {
        commit('setMe', user);
        router.replace(next);
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
            router.replace('/feed');
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
    // Net.shutdown();
    router.replace(next);
  },

  create({ commit }, obj) {
    const { next, user } = obj;

    if (!user.username || !user.password) {
      throw new Error('Invalid user object, must have username and password.');
    }

    const key = passwordKey(user.password);
    delete obj.password;

    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
    const auth = {
      msg: b58.encode(nacl.secretbox(new Uint8Array(JSON.stringify(user)), nonce, key)),
      nonce: b58.encode(nonce),
    }

    localStorage.setItem(`auth:${user.username}`, JSON.stringify(auth));
    commit('setMe', obj);
    router.replace(next);
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
  }
};


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
