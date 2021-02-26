import Vue from 'vue';
import Debug from 'debug';
import { VueOrbitDB } from '@/plugins/orbitdb';
import store from '@/store';
import config from '@/config';
import Sync from '@/orbitdb/sync';
import following from '@/orbitdb/following';
import inbox from '@/orbitdb/inbox';
import followers from '@/orbitdb/followers';
import peers from '@/orbitdb/peers';
import profile from '@/orbitdb/profile';
import posts from '@/orbitdb/posts';
import feed from '@/orbitdb/feed';

Vue.use(VueOrbitDB);

const debug = Debug('nimtok:orbitdb');


const orbitdb = new VueOrbitDB({
  store,
  databases: {
    profile,
    posts,
    feed,
    following,
    followers,
    peers,
    inbox,
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
  meta: {
    Sync: Sync,
  },
  afterConnect(orbitdb) {
    debug('connection:afterConnect(%O)', orbitdb);

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

      orbitdb.publish(obj.message.from, {
        ...nodeInfo,
        hashtags: store.actions['hashtags/getTopN'](config.HASHTAG_TRADE_COUNT),
      });
    });
    orbitdb.subscribe(orbitdb.id.id, (obj) => {
      debug(`pubsub:${orbitdb.id.id}(%O)`, obj);

      if (obj.data.type !== 'discovery') {
        debug('pubsub:%s skipping', orbitdb.id.id);
        return;
      }

      Sync.ToVuex.user(orbitdb, {
        id: obj.message.from,
        username: obj.data.username,
        profile: obj.data.profile,
      });

      Sync.ToVuex.hashtags(obj.hashtags);
    });

    setTimeout(() => {
      debug('pubsub.discovery()', nodeInfo);

      // We don't include hashtags since we just started up.
      orbitdb.publish('discovery', nodeInfo);
    }, config.DISCOVERY_WAIT);  
  },
});

// Sync vuex -> orbitdb.
store.subscribe((mutation, state) => {
  debug('store:subscribe(%O, %O)', mutation, state);

  if (mutation.payload && mutation.payload._srcOrbitDB) {
    debug('Skipping circular %s mutation', mutation.type);
    return;
  }

  switch (mutation.type) {
    case 'users/addUser':
      Sync.ToOrbitDB.peer(orbitdb, mutation.payload);
      break;

    case 'posts/addPost':
      Sync.ToOrbitDB.post(orbitdb, mutation.payload);
      break;

    default:
      debug('Unhandled mutation type: %s', mutation.type);
      break;
  }
});


export default orbitdb;
