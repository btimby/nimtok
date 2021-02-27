import Debug from 'debug';
import store from '@/store';
import peers from '@/orbitdb/peers';
import posts from '@/orbitdb/posts';

const debug = Debug('nimtok:orbitdb:sync');

const Sync = {
  ToVuex: {
    postToFeed(orbitdb, obj) {
      debug('postToFeed(%O)', obj);

      const {
        type, hashtags, mentions, posts, cid,
      } = obj.data;
      if (type !== 'post') {
        debug('pubsub:following:%s skipping', obj.message.from);
        return;
      }

      store.dispatch('feed/addPost', {
        user: { id: obj.message.from },
        post: { cid },
        posts,
      });

      store.dispatch('hashtags/incr', hashtags);
      store.dispatch('mentions/incr', mentions);
    },

    users(orbitdb) {
      debug('users(%O)', orbitdb);

      const peerList = peers.db.query(() => true);

      for (const i in peerList) {
        // Transform the object somewhat.
        const peer = { ...peerList[i] };
        peer.id = peer._id;
        peer._srcOrbitDB = true;
        delete peer._id;

        Sync.ToVuex.user(orbitdb, peer);
      }
    },

    user(orbitdb, user) {
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
              store.commit('users/ADD_USER', user);

              profile
                .close()
                .catch(console.error);
            })
            .catch(console.error);
        })
        .catch(console.error);
    },

    hashtags(hashtags) {
      if (hashtags) store.dispatch('hashtags/merge', hashtags);
    },
  },

  ToOrbitDB: {
    peer(orbitdb, peer) {
      debug('Sync.ToOrbitDB.peer(%O)', peer);

      peers.db
        .put({
          _id: peer.id,
          id: peer.id,
          username: peer.username,
          profile: peer.profile,
        })
        .catch(console.error);
    },

    post(orbitdb, post) {
      debug('Sync.ToOrbitDB.post(%O)', post);

      posts.db
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
    },
  },
};

export default Sync;
