import Debug from 'debug';
import { VueOrbitStore } from '@/plugins/orbitdb';

const debug = Debug('nimtok:orbitdb:inbox');

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

export default inbox;
