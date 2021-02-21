// TODO: make external project.
import Ipfs from 'ipfs';
import OrbitDB from 'orbit-db';

const IPFSOPTIONS = {
  EXPERIMENTAL: {
    pubsub: true,
  }
}


export default class VueOrbitDB {
  constructor({ store }) {
    this._store = store;
    this._actions = new Map();
    this._callbacks = new Map();
    this.node = null;
    this.odb = null;
  }

  static install() {
    /*const version = Number(Vue.version.split('.')[0]);

    if (version >= 3) {
      Vue.config.globalProperties.$orbitdb = this;
    } else {
      Vue.prototype.$orbitdb = this;
    }*/
  }

  async connect({ IpfsOptions, }, onOpen) {
    const options = {
      ...IPFSOPTIONS,
      ...IpfsOptions,
    }
    this.node = await Ipfs.create(options);
    this.odb = await OrbitDB.createInstance(this.node);
    this.id = await this.node.id();
    this.databases = {};

    // Let caller do some initialization.
    await onOpen(this);
  }

  async shutdown() {
    if (!this.node) {
      return;
    }

    this.odb.disconnect();
    this.node.stop();
    this.node = this.odb = this.id = null;
    this.databases = {};
  }

  add(name, db) {
    if (!this.node) {
      throw new Error('OrbitDB not connected.');
    }

    this.databases[name] = db;
  }

  close(name) {
    if (!this.node) {
      throw new Error('OrbitDB not connected.');
    }

    this.databases[name]
      .close()
      .then(() => {
        delete this.databases[name];
      })
      .catch(console.error);
  }

  _dispatch(message) {
    if (!this.node) {
      throw new Error('OrbitDB not connected.');
    }

    // Skip our own messages.
    if (message.from === this.id.id) {
      return;
    }

    const data = JSON.parse(message.data.toString());
    const args = { data, message, odb: this };

    for (let i in message.topicIDs) {
      const topic = message.topicIDs[i];

      if (this._actions.has(topic)) {
        this._actions.get(topic).forEach((action) => {
          this._store.dispatch(action, args);
        });
      }
      if (this._callbacks.has(topic)) {
        this._callbacks.get(topic).forEach((callback) => {
          try {
            callback(args);
          } catch(e) {
            console.error(e);
          }
        })
      }

    }
  }

  async subscribe(topic, action) {
    if (!this.node) {
      throw new Error('OrbitDB not connected.');
    }

    const registered = (this._callbacks.has(topic) || this._actions.has(topic));
    const map = (typeof action === 'function') ? this._callbacks : this._actions;

    // NOTE: set up routing for messages to vuex actions.
    if (!map.has(topic)) map.set(topic, []);
    map.get(topic).push(action);

    // Set up pubsub subscription, but ensure it is only registered once.
    if (!registered) {
      await this.node.pubsub.subscribe(topic, this._dispatch.bind(this));
    }
  }

  async publish(topic, data) {
    if (!this.node) {
      throw new Error('OrbitDB not connected.');
    }

    data = JSON.stringify(data);
    console.log('publish()', topic, data);
    await this.node.pubsub.publish(topic, data);
  }
}
