import Debug from 'debug';
import { VueOrbitStore } from '@/plugins/orbitdb';

const debug = Debug('nimtok:orbitdb:peers');


const peers = new VueOrbitStore('peers', 'docstore', {
  afterLoad(orbitdb) {
    debug('peers:afterLoad');
    orbitdb.meta.Sync.ToVuex.users(orbitdb);
  }
});


export default peers;
