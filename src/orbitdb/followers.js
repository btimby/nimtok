import Debug from 'debug';
import { VueOrbitStore } from '@/plugins/orbitdb';

const debug = Debug('nimtok:orbitdb:followers');


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

export default followers;
