import Vue from 'vue';
import Debug from 'debug';
import { VueOrbitStore, VueOrbitDB } from '@/plugins/orbitdb';
import store from '@/store';
import config from '@/config';

Vue.use(VueOrbitDB);


const debug = Debug('nimtok:orbitdb');
const profile = new VueOrbitStore('profile', 'keyvalue');
const posts = new VueOrbitStore('posts', 'feed');
const following = new VueOrbitStore('following', 'docstore', {
  afterOpen() {
    debug('following.afterOpen');

    // Subscribe to all followed users so we receive notification of their posts.
    following.db.events.on('ready', () => {
      const peerList = following.db.query(() => true);

      for (let i in peerList) {
        const peer = peerList[i];
        const peerId = peer.id || peer._id;

        orbitdb.subscribe(peerId, (obj) => {
          // TODO: move this to the action, see users/discovery.
          debug('pubsub:following:%s(%O)', obj.message.from, obj);

          // NOTE: new post from a followed user.
          const { type, hashtags, mentions, posts, cid } = obj.data;
          // TODO: remove this.
          mentions;
          if (type !== 'post') {
            debug('pubsub:following:%s skipping', obj.message.from);
            return;
          }

          store.dispatch('posts/addPost', {
            user: { id: obj.message.from },
            post: { cid, },
            posts,
          });

          store.dispatch('hashtags/incr', hashtags);
        });
      }
    });
    following.db.load();
  },
});

const peers = new VueOrbitStore('peers', 'docstore', {
  afterLoad() {
    debug('peers:afterLoad');

    const peerList = peers.db.query(() => true);

    for (let i in peerList) {
      // Transform the object somewhat.
      const peer = { ...peerList[i] };
      peer.id = peer._id;
      peer._srcOrbitDB = true;
      delete peer._id;

      store.dispatch('users/addUser', peer);
    }
  }
});

/*const hashtags = new VueOrbitStore('hashtags', 'keyvalue', {
  address: config.HASHTAG_DB,
});*/

const inbox = new VueOrbitStore('inbox', 'feed', {
  createOptions: {
    accessController: {
      write: ['*'],
    },
  },
  afterOpen() {
    debug('inbox:afterOpen');

    inbox.db.events.on('replicated', () => {
      debug('inbox:replicated');
    });
  },
});

const followers = new VueOrbitStore('followers', 'docstore', {
  createOptions: {
    accessController: {
      write: ['*'],
    },
  },
  afterOpen() {
    debug('followers:afterOpen');

    followers.db.events.on('replicated', () => {
      // NOTE: likely a new follower.
      debug('followers:replicated');
    });
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
    // hashtags,
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
  afterConnect() {
    debug('connection:afterConnect');

    // Collect node information for discovery.
    profile.db.set('inbox', inbox.db.id);
    profile.db.set('peers', peers.db.id);
    profile.db.set('posts', posts.db.id);
    profile.db.set('following', following.db.id);
    profile.db.set('followers', followers.db.id);

    const nodeInfo = {
      type: 'discovery',
      username: orbitdb.meta.user.username,
      profile: profile.db.id,
    };

    // Set up pubsub.
    orbitdb.subscribe('discovery', 'users/discovery');
    orbitdb.subscribe('discovery', (obj) => {
      debug('pubsub:discovery(%O)', obj);

      orbitdb.publish(obj.message.from, nodeInfo);
    });
    orbitdb.subscribe(orbitdb.id.id, (obj) => {
      debug(`pubsub:${orbitdb.id.id}(%O)`, obj);

      if (obj.data.type !== 'discovery') {
        debug('pubsub:%s skipping', orbitdb.id.id);
        return;
      }
        store.dispatch('users/discovery', obj);
    });

    setTimeout(() => {
      debug('pubsub.discovery()', nodeInfo);

      orbitdb.publish('discovery', nodeInfo);
    }, 10000);  
  },
});


function addUser(user) {
  debug('addUser(%O)', user);

  peers.db
    .put({
      _id: user.id,
      id: user.id,
      username: user.username,
      profile: user.profile,
    })
    .catch(console.error);
}

function createPost(post) {
  debug('createPost(%O)', post);

  posts.db
    .add(post)
    .then((cid) => {
      orbitdb.publish(orbitdb.id.id, {
        type: 'post',
        cid,
        posts: posts.db.id,
        hashtags: post.hashtags,
        mentions: post.mentions,
      });
    })
    .catch(console.error);
}

// NOTE: Sync orbitdb with vuex.
store.subscribe((mutation, state) => {
  debug('store:subscribe(%O, %O)', mutation, state);

  if (mutation.payload && mutation.payload._srcOrbitDB) {
    debug('Skipping circular %s mutation', mutation.type);
    return;
  }

  switch (mutation.type) {
    case 'users/addUser':
      addUser(mutation.payload);
      break;

    case 'posts/addPost':
      createPost(mutation.payload);
      break;

    default:
      debug('Unhandled mutation type: %s', mutation.type);
      break;
  }
})

export default orbitdb;
