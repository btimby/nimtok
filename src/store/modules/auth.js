import nacl from 'tweetnacl';
import b58 from 'b58';
import router from '@/router';
import orbitdb from '@/orbitdb';
import { str2arr, arr2str } from '@/utils';


const state = {
  me: null,
};

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

const getters = {
  me: state => {
    return state.me;
  },

  authenticated: state => {
    return Boolean(state.me);
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

    orbitdb
      .connect({
        repo: user.username,
        privateKey: user.identity.privKey,
      })
      .then(() => {
        // Don't store sensitive fields in session.
        delete user.nonce;
        delete user.secret;
        commit('setMe', user);
        if (next && router.currentRoute.path !== next) {
          router.push(next);
        }
      })
      .catch(console.error);
  },

  tryLogin({ commit }) {
    try {
      const user = JSON.parse(sessionStorage.getItem('auth:me'));

      if (user) {
        orbitdb
          .connect({
            repo: user.username,
            privateKey: user.identity.privKey,
          })
          .then(() => {
            commit('setMe', user);
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
    commit('delMe');
    orbitdb.shutdown();

    const { next } = obj;
    if (next && router.currentRoute.path !== next) {
      router.push(next);
    }
  },

  create({ commit }, obj) {
    const { next, user } = obj;

    if (!user.username || !user.password) {
      throw new Error('Invalid user, must have username and password.');
    }

    const auth = serializeUser(user);

    orbitdb.connect({
        repo: user.username,
        privateKey: user.identity.privKey,
      })
      .then(() => {
        commit('setMe', auth);
        delete auth.identity;
        localStorage.setItem(`auth:${user.username}`, JSON.stringify(auth));
        router.replace(next);
          if (next && router.currentRoute.push !== next) {
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
};


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
