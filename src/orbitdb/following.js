import Debug from 'debug';
import { VueOrbitStore } from '@/plugins/orbitdb';

const debug = Debug('nimtok:orbitdb:following');

const following = new VueOrbitStore('following', 'docstore', {
  afterOpen(orbitdb) {
    debug('following.afterOpen');

    // Subscribe to all followed users so we receive notification of their posts.
    following.db.events.on('ready', () => {
      const peerList = following.db.query(() => true);

      for (const i in peerList) {
        const peer = peerList[i];
        const peerId = peer.id || peer._id;

        orbitdb.subscribe(peerId, (obj) => {
          debug('pubsub:following:%s(%O)', obj.message.from, obj);
          orbitdb.meta.Sync.ToVuex.postToFeed(orbitdb, obj);
        });
      }
    });
    following.db.load();
  },
});

export default following;
