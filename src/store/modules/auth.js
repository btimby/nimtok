import nacl from 'tweetnacl';
import b58 from 'b58';
import Debug from 'debug';
import orbitdb from '@/orbitdb';
import { str2arr, arr2str } from '@/utils';

const debug = Debug('nimtok:store:auth');
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

function getImageData(dataUri) {
  let dataStr = atob(dataUri.split(',')[1]);
  const dataArr = new Uint8Array(dataStr.length);

  for (let i = 0; i < dataStr.length; i++) {
      dataArr[i] = dataStr.charCodeAt(i);
  }

  return new Blob([dataArr]);
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
    debug('actions.login(%O)', obj);

    let { user, username, password } = obj;

    if (!user) {
      const auth = JSON.parse(localStorage.getItem(`auth:${username}`));
      if (!auth) {
        throw new Error('Invalid username or password');
      }
  
      user = deserializeUser(auth, password);
  
      if (user === null) {
        throw new Error('Invalid username or password');
      }
    }

    // TODO: move this to orbitdb.js, into the mutation subscription (auth/setMe).
    return new Promise((resolve, reject) => {
      orbitdb
        .connect({
          options: {
            repo: user.username,
            privateKey: user.identity.privKey,
          },
          meta: {
            user,
          }
        })
        .then(() => {
          // Don't store sensitive fields in session.
          delete user.nonce;
          delete user.secret;
          commit('setMe', user);
          resolve(user);
        })
        .catch(reject);
    });
  },

  logout({ commit }, obj) {
    debug('actions.logout(%O)', obj);

    return new Promise((resolve, reject) => {
      try {
        commit('delMe');
        orbitdb.shutdown();
      } catch (e) {
        reject(e);
        return;
      }
      resolve();
    });
  },

  create({ commit }, obj) {
    debug('actions.create(%O)', obj);

    const { user } = obj;

    return new Promise((resolve, reject) => {
      if (!user.username || !user.password) {
        throw new Error('Invalid user, must have username and password.');
      }
  
      const auth = serializeUser(user);
  
      debug('actions.create() - connecting.');
      orbitdb.connect({
          options: {
            repo: user.username,
            privateKey: user.identity.privKey,
          },
          meta: {
            user,
          },
        })
        .then(() => {
          debug('actions.create() - uploading avatar.');

          // Upload avatar image to ipfs.
          const prom1 = new Promise((resolve, reject) => {
            let blob;
            try {
              blob = getImageData(user.avatar);
            } catch(e) {
              reject(e);
              return;
            }

            orbitdb.node
              .add(blob)
              .then(resolve)
              .catch(reject);
          });
          // Open the profile database for writing.
          const prom2 = new Promise((resolve, reject) => {
            try {
              const profile = orbitdb.databases.profile;
              profile.db.events.on('ready', () => {
                resolve(profile);
              });
              profile.db.load();
            } catch (e) {
              reject(e);
            }
          });

          Promise
            .all([prom1, prom2])
            .then(([avatar, profile]) => {
              debug('auth.create() - setting up profile.');

              profile.db.set('avatar', avatar.path);
              profile.db.set('bio', user.bio);
              auth.profile = profile.db.id;

              // Save user to session (for persistent login).
              commit('setMe', auth);
              resolve(auth);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }
};

const mutations = {
  setMe(state, obj) {
    debug('mutations.setMe(%O)', obj);

    state.me = obj;
  },

  delMe(state) {
    debug('mutations.delMe()');

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
