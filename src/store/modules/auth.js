import nacl from 'tweetnacl';
import b58 from 'b58';


function passwordKey(password) {
  // 64 byte hash:
  const hash = nacl.hash(new Uint8Array(password));
  const key = new Uint8Array(nacl.secretbox.keyLength);
  for (let i = 0; i < hash.length; i += 2) {
    key[i / 2] = hash[i];
  }
  return key;
}

var me = null;
try {
  me = JSON.parse(sessionStorage.getItem('auth:me'));
} catch (e) {
  console.warn('User not present in sessionStorage');
}

const state = {
  me,
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
    if (!obj.username || !obj.password) {
      throw new Error('Invalid user object, must have username and password.');
    }

    const key = passwordKey(obj.password);
    const auth = JSON.parse(localStorage.getItem(`auth:${obj.username}`));
    if (!auth) {
      throw new Error('Invalid username or password');
    }

    const msg = b58.decode(auth.msg);
    const nonce = b58.decode(auth.nonce);

    obj = nacl.secretbox.open(msg, nonce, key);

    if (obj === null) {
      throw new Error('Invalid username or password');
    }

    commit('setMe', obj);
  },

  logout({ commit }) {
    commit('delMe');
  },

  create({ commit }, obj) {
    if (!obj.username || !obj.password) {
      throw new Error('Invalid user object, must have username and password.');
    }

    const key = passwordKey(obj.password);
    delete obj.password;

    const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
    const auth = {
      msg: b58.encode(nacl.secretbox(new Uint8Array(JSON.stringify(obj)), nonce, key)),
      nonce: b58.encode(nonce),
    }

    localStorage.setItem(`auth:${obj.username}`, JSON.stringify(auth));
    commit('setMe', obj);
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
