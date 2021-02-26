import Debug from 'debug';
import store from '@/store';
import peers from '@/orbitdb/peers';

const debug = Debug('nimtok:orbitdb:sync');


class ToVuex {
  static postToFeed(orbitdb, obj) {
    debug('postToFeed(%O)', obj);

    const { type, hashtags, mentions, posts, cid } = obj.data;
    if (type !== 'post') {
      debug('pubsub:following:%s skipping', obj.message.from);
      return;
    }

    store.dispatch('feed/addPost', {
      user: { id: obj.message.from },
      post: { cid, },
      posts,
    });

    store.dispatch('hashtags/incr', hashtags);
    store.dispatch('mentions/incr', mentions);
  }

  static users(orbitdb) {
    debug('users(%O)', orbitdb);

    const peerList = peers.db.query(() => true);

    for (let i in peerList) {
      // Transform the object somewhat.
      const peer = { ...peerList[i] };
      peer.id = peer._id;
      peer._srcOrbitDB = true;
      delete peer._id;

      Sync.ToVuex.user(orbitdb, peer);
    }  
  }

  static user(orbitdb, user) {
    debug('user(%O, %O)', orbitdb, user);

    // Get profile data.
    orbitdb.odb
      .open(user.profile)
      .then((profile) => {
        profile
          .load()
          .then(() => {
            debug('addUser() profile %O', profile.all);

            user = {
              ...user,
              ...profile.all,
            };
            store.commit('users/addUser', user);

            profile
              .close()
              .catch(console.error);
          })
          .catch(console.error);
      })
      .catch(console.error);
  }
  
  static hashtags(hashtags) {
    hashtags &&
      store.dispatch('hashtags/merge', hashtags);
  }
}
  
class ToOrbitDB {
  static peer(orbitdb, peer) {
    debug('Sync.ToOrbitDB.peer(%O)', peer);

    orbitdb.databases.peers.db
      .put({
        _id: peer.id,
        id: peer.id,
        username: peer.username,
        profile: peer.profile,
      })
      .catch(console.error);
  }

  static post(orbitdb, post) {
    debug('Sync.ToOrbitDB.post(%O)', post);

    orbitdb.databases.posts.db
      .add(post)
      .then((cid) => {
        orbitdb.publish(orbitdb.id.id, {
          type: 'post',
          cid,
          posts: orbitdb.databases.posts.db.id,
          hashtags: post.hashtags,
          mentions: post.mentions,
        });
      })
      .catch(console.error);
  }  
}

// Just a namespace to contain functions for copying data between vuex and OrbitDB.
const Sync = {
  ToVuex,
  ToOrbitDB,
};

// Sync vuex -> orbitdb.
store.subscribe((mutation, state) => {
  debug('store:subscribe(%O, %O)', mutation, state);

  if (mutation.payload && mutation.payload._srcOrbitDB) {
    debug('Skipping circular %s mutation', mutation.type);
    return;
  }

  switch (mutation.type) {
    case 'users/addUser':
      Sync.ToOrbitDB.peer(mutation.payload);
      break;

    case 'posts/addPost':
      Sync.ToOrbitDB.post(mutation.payload);
      break;

    default:
      debug('Unhandled mutation type: %s', mutation.type);
      break;
  }
});


export default Sync;
