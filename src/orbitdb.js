import Vue from 'vue';
import { VueOrbitStore, VueOrbitDB } from '@/plugins/orbitdb';
import store from '@/store';
import config from '@/config';

Vue.use(VueOrbitDB);


const profile = new VueOrbitStore({
  name: 'profile',
  type: 'keyvalue',
  beforeOpen() {
    console.log('profile.beforeOpen()');
  },
  afterOpen() {
    console.log('profile.afterOpen()');
  },
});

const posts = new VueOrbitStore({
  name: 'posts',
  type: 'feed',
  beforeOpen() {
    console.log('posts.beforeOpen()');
  },
  afterOpen() {
    console.log('posts.afterOpen()');
  },
});

const following = new VueOrbitStore({
  name: 'following',
  type: 'docstore',
  beforeOpen() {
    console.log('following.beforeOpen()');
  },
  afterOpen() {
    console.log('following.afterOpen()');
  },
});

const peers = new VueOrbitStore({
  name: 'peers',
  type: 'docstore',
  beforeOpen() {
    console.log('peers.beforeOpen()');
  },
  afterOpen() {
    console.log('peers.afterOpen()');
  },
  afterLoad(db) {
    console.log('peers.afterLoad()');
    const peers = db.query(() => true);
  
    for (let i in peers) {
      // Transform the object somewhat.
      const peer = { ...peers[i] };
      peer.id = peer._id;
      delete peer._id;

      store.commit('users/addUser', {
        id: peer.id,
        ...peer,
      });
    }
  }
});

const hashtags = new VueOrbitStore({
  address: config.HASHTAG_DB,
  type: 'keyvalue',
  beforeOpen() {
    console.log('hashtags.beforeOpen()');
  },
  afterOpen() {
    console.log('hashtags.afterOpen()');
  },
});

const inbox = new VueOrbitStore({
  name: 'inbox',
  type: 'feed',
  options: {
    accessController: {
      write: ['*'],
    },
  },
  beforeOpen() {
    console.log('inbox.beforeOpen()');
  },
  afterOpen(db) {
    console.log('inbox.afterOpen()');
    db.events.on('replicated', () => {
      console.log('inbox:replicated');
    });
  },
});

const followers = new VueOrbitStore({
  name: 'followers',
  type: 'docstore',
  options: {
    accessController: {
      write: ['*'],
    },
  },
  beforeOpen() {
    console.log('followers.beforeOpen()');
  },
  afterOpen() {
    console.log('followers.afterOpen()');
  },
});

const orbitdb = new VueOrbitDB({
  store,
  databases: {
    profile,
    posts,
    following,
    followers,
    peers,
    inbox,
    hashtags,
  },
  options: {
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
  },
  afterConnect(db) {
    // Collect node information for discovery.
    const nodeInfo = {
      type: 'discovery',
      data: {
        //username: user.username,
        profile: db.databases.profile.id,
        inbox: db.databases.inbox.id,
        peers: db.databases.peers.id,
        posts: db.databases.posts.id,
        following: db.databases.following.id,
        followers: db.databases.followers.id,
      }
    };

    // Set up pubsub.
    db.subscribe('discovery', 'users/discovery');
    db.subscribe('discovery', ({ message }) => {
      db.publish(message.from, nodeInfo);
    });
    // TODO: other message types may appear here.
    db.subscribe(db.id.id, (obj) => {
      if (obj.data.type === 'discovery') {
        store.dispatch('users/discovery', obj);
      }
    });

    setTimeout(() => {
      db.publish('discovery', nodeInfo);
    }, 10000);  
  },
});


export default orbitdb;
