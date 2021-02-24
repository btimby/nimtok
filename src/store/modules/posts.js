import Debug from 'debug';
import orbitdb from '@/orbitdb';
import store from '@/store';


const debug = Debug('nimtok:store:posts');
const state = {
  posts: {},
};

const getters = {
  posts: state => {
    return state.posts;
  },
};

const actions = {
  post({ commit}, obj) {
    debug('actions.post(%O)', obj);

    store.dispatch('hashtags/incr', obj.hashtags);

    const me = store.getters['auth/me'];
    commit('addPost', {
      user: { id: me.id, },
      body: obj.body,
      hashtags: obj.hashtags,
      mentions: obj.mentions,
    });
  },

  async addPost({ commit }, obj) {
    debug('actions.addPost(%O)', obj);

    // Look up post in remote user db.
    const posts = await orbitdb.open(obj.posts);
    posts.db.events.on('ready', async () => {
      const post = posts.db.get(obj.post.cid);
      commit('addPost', post);
      await posts.close();
    });
    await posts.load();

    commit('addPost', obj);
  },
};

const mutations = {
  addPost(state, obj) {
    debug('mutations.addPost(%O)', obj);

    let posts = state.posts[obj.user.id];
    if (!posts) {
      posts = state.posts[obj.user.id] = [];
    }
    posts.push(obj.body);
  },
};


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
