// TODO: make external project.
import Ipfs from 'ipfs';
import OrbitDB from 'orbit-db';

const DB_ADDR = /'(\/orbitdb\/\w+\/\w+)'/;
const IPFSOPTIONS = {
  EXPERIMENTAL: {
    pubsub: true,
  }
}


class VueOrbitStore {
  constructor({ name, type, address, options, load, beforeOpen, afterOpen, beforeLoad, afterLoad, }) {
    this.name = name;
    this.address = address;
    this.type = type;
    this.options = options;
    this.load = load;
    this.hooks = {
      beforeOpen,
      afterOpen,
      beforeLoad,
      afterLoad,
    };
    this.db = null;
  }

  get id() {
    return this._store.id;
  }

  async open(db) {
    this.db = db;
    this.hooks.beforeOpen && this.hooks.beforeOpen();
    if (this.name) {
      this._store = await this.db.openOrCreate(this.name, this.type, this.options);
    } else if (this.address) {
      this._store = await this.db.odb.open(this.address, this.type);
    } else {
      throw new Error('Cannot open database, no name or address!');
    }
    this.hooks.afterOpen && this.hooks.afterOpen(this._store);
    // Hook can return false to abort load.
    if (this.load || this.hooks.afterLoad && (
      !this.hooks.beforeLoad || this.hooks.beforeLoad() !== false
    )) {
      this._store
        .load()
        .then(() => {
          this.hooks.afterLoad && this.hooks.afterLoad(this._store);
        })
        .catch(console.error);
    }
  }
}

class VueOrbitDB {
  constructor({ store, databases, options, beforeConnect, afterConnect, }) {
    this._store = store;
    this._actions = new Map();
    this.node = null;
    this.odb = null;
    this.databases = databases;
    this.options = options;
    this.hooks = {
      beforeConnect,
      afterConnect,
    };
  }

  static install() {}

  async connect(options) {
    this.hooks.beforeConnect && this.hooks.beforeConnect(this);
    this.node = await Ipfs.create({
      ...IPFSOPTIONS,
      ...this.options,
      ...options,
    });
    this.odb = await OrbitDB.createInstance(this.node);
    this.id = await this.node.id();
    for (let key in this.databases) {
      const db = this.databases[key];
      await db.open(this);
    }
    window.$orbitdb = this;
    this.hooks.afterConnect && this.hooks.afterConnect(this);
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

  // TODO: this should be implemented within orbitdb.
  async openOrCreate(name, type, options) {
    let db;

    try {
      db = await this.odb.create(name, type, options);
    } catch (e) {
      if (e.message.indexOf('exists') === -1) {
        throw e;
      }
      const m = DB_ADDR.exec(e.message);
      if (!m) {
        throw new Error('Database exists, could not parse address');
      }
      const address = m[1];
      db = await this.odb.open(address, type);
    }

    return db;
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

      if (!this._actions.has(topic)) {
        continue;
      }

      this._actions.get(topic).forEach((action) => {
        if (typeof action === 'string') {
          this._store.dispatch(action, args);
        } else {
          try {
            action(args);
          } catch(e) {
            console.error(e);
          }
        }
      });
    }
  }

  async subscribe(topic, action) {
    if (!this.node) {
      throw new Error('OrbitDB not connected.');
    }

    // NOTE: set up routing for messages to vuex actions.
    if (!this._actions.has(topic)) {
      this._actions.set(topic, []);
      // Set up pubsub subscription, but ensure it is only registered once.
      await this.node.pubsub.subscribe(topic, this._dispatch.bind(this));
    }

    this._actions.get(topic).push(action);
  }

  async publish(topic, data) {
    if (!this.node) {
      throw new Error('OrbitDB not connected.');
    }

    data = JSON.stringify(data);
    await this.node.pubsub.publish(topic, data);
  }
}


export {
  VueOrbitStore,
  VueOrbitDB,
};
