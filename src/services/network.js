import EventEmitter from 'events';
import Ipfs from 'ipfs';
import OrbitDB from 'orbit-db';

const IPFSOPTS = {
  EXPERIMENTAL: {
    pubsub: true,
  },
};

class P2PNetwork extends EventEmitter {
  constructor() {
    super();
    this._ipfs = null;
    this._odb = null;
    this._posts = null;
    this._ready = false;

    Ipfs
      .create(IPFSOPTS)
      .then((ipfs) => {
        this._ipfs = ipfs;

        OrbitDB
          .createInstance(this._ipfs)
          .then((odb) => {
            this._odb = odb;

            this._odb
              .feed('posts')
              .then((posts) => {
                this._posts = posts;

                this._ready = true;
                this.emit('ready');
              })
              .catch(console.error);
          })
          .catch(console.error);
      })
      .catch(console.error);
  }

  onready(cb) {
    if (this._ready) {
      setTimeout(cb, 0);
      return;
    }
    this.once('ready', cb);
  }

  addPost(post) {
    if (!this._posts) {
      throw new Error('Database not available.');
    }

    this._posts.add(post);
  }
}


export default new P2PNetwork();
