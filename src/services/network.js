import EventEmitter from 'events';
import Ipfs from 'ipfs';
import OrbitDB from 'orbit-db';

// const APP_UUID = '{3277a5cd-9f9e-4d3d-8efd-bf27174367f4}';
const IPFSOPTS = {
  repo: './ipfs',
  EXPERIMENTAL: {
    pubsub: true,
  },
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
        '/ip4/127.0.0.1/tcp/9090/ws/p2p-webrtc-star'
      ],
    },
  },
};


// This class is used a a singleton to access the P2P network. It is initialized during login.
class P2PNetwork extends EventEmitter {
  constructor() {
    super();
    this._store = null;
    this._node = null;
    this._peerId = null;
    this._odb = null;
    this._posts = null;
    this._ready = false;
  }

  // We want to push data into the vuex store using actions and mutations, so we need a reference
  // to the store. The store modules also interact with this instance, so we cannot access the
  // store at import time. Therefore, in main.js, we need to call this once the store is
  // instantiated.
  useStore(store) {
    this._store = store;
  }

  async _init(user) {
    const options = {
      ...IPFSOPTS,
      // Store keys, settings etc by user.
      repo: user.username,
    }
    this._node = await Ipfs.create(options);
    this._peerId = await this._node.id();
    this._odb = await OrbitDB.createInstance(this._node);
  
    // Database to hold our provile.
    this._profile = await this._odb.keyvalue('profile');
    // Database to hold our posts.
    this._posts = await this._odb.feed('posts');
    // await this._posts.load();
    // Database to hold followed users.
    this._following = await this._odb.docs('following');
    // Database to hold peers.
    this._peers = await this._odb.docs('peers', {
      indexBy: 'username',
    });
    // await this._peers.load();
    // Database for hash tags.
    this._hashtags = await this._odb.keyvalue('hashtags');
    // await this._hashtags.load();

    this._nodeInfo = {
      id: this._peerId.id,
      username: user.username,
      profile: this._profile.id,
      peers: this._peers.id,
      posts: this._posts.id,
    };

    // Subscribe to "our" topic.
    this.subscribe(this._peerId.id.toString(), async (data) => {
      await this.addPeers(data);
    });
    this.subscribe('announce', async (data) => {
      // A new node connected and announced themself. Reply with our details, and merge their
      // databases into ours.
      this.publish(data.id, this._nodeInfo);
      await this.addPeers(data);
    });
    setTimeout(() => {
      this.publish('announce', this._nodeInfo);
    }, 2000);
  }

  async addPeers(data) {
    // Add the peer.
    console.log('Adding peer', data.id, data.username);
    await this._peers.put({
      _id: data.id,
      username: data.username,
      profile: data.profile,
      peers: data.peers,
      posts: data.posts,
    });
  }

  async getPeers() {
    // TODO: allow querying, by _id or a given field.
    if (!this._peers) {
      return 0;
    }
    return await this._peers.query(() => true);
  }

  init(user, commit, dispatch) {
    this
      ._init(user, commit, dispatch)
      .catch(console.error);
  }

  async _shutdown() {
    this._odb.disconnect();
    this._node.stop();
    this._posts = null;
    this._odb = null;
    this._node = null;
    this._ready = false;
  }

  shutdown() {
    if (!this._node) {
      return;
    }

    this
      ._shutdown()
      .catch(console.error);
  }

  onready(cb) {
    // If ready callback immediately.
    if (this._ready) {
      setTimeout(cb, 0);
      return;
    }
    // Otherwise defer until ready.
    this.once('ready', cb);
  }

  _onMessage(message) {
    if (this._peerId.id === message.from) {
      // Ignore our own messages.
      return;
    }

    const data = JSON.parse(message.data.toString());

    for (let i in message.topicIDs) {
      this.emit(`topic:${message.topicIDs[i]}`, data, message);
    }
  }

  subscribe(topic, cb) {
    this._node.pubsub
      .subscribe(topic, this._onMessage.bind(this))
      .then(() => {
        if (typeof cb === 'function') {
          this.on(`topic:${topic}`, cb);
        }
      });
  }

  async publish(topic, message) {
    const data = JSON.stringify(message);
    this._node.pubsub
      .publish(topic, data)
      .catch(console.error);
  }

  async addPost(post) {
    if (!this._posts) {
      throw new Error('Database not available.');
    }

    return await this._posts.add(post);
  }
}

export default new P2PNetwork();
