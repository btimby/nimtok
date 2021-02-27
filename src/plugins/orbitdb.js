/* eslint-disable max-classes-per-file */
import _ from 'lodash';
import Debug from 'debug';
import Ipfs from 'ipfs';
import OrbitDB from 'orbit-db';

const debug = Debug('VueOrbitDB');
const DB_ADDR = /'(\/orbitdb\/\w+\/\w+)'/;
const IPFSOPTIONS = {
  EXPERIMENTAL: {
    pubsub: true,
  },
};

class VueOrbitStore {
  constructor(name, type, options) {
    this.name = name;
    this.type = type;
    this.address = options && options.address;
    this.openOptions = options && options.openOptions;
    this.load = options && options.load;
    this.hooks = {
      beforeOpen: options && options.beforeOpen,
      afterOpen: options && options.afterOpen,
      beforeLoad: options && options.beforeLoad,
      afterLoad: options && options.afterLoad,
    };
    this.cn = null;
    this.db = null;
  }

  async open(connection) {
    this.cn = connection;
    if (this.hooks.beforeOpen) this.hooks.beforeOpen(this.cn);
    if (this.address) {
      this.db = await this.cn.odb.open(this.address, this.type);
    } else if (this.name) {
      this.db = await this.cn.openOrCreate(this.name, this.type, this.createOptions);
    } else {
      throw new Error('Cannot open database, no name or address!');
    }
    if (this.hooks.afterOpen) this.hooks.afterOpen(this.cn);
    // Hook can return false to abort load.
    if (this.load || (this.hooks.afterLoad && (
      !this.hooks.beforeLoad || this.hooks.beforeLoad(this.cn) !== false
    ))) {
      this.db
        .load()
        .then(() => {
          if (this.hooks.afterLoad) this.hooks.afterLoad(this.cn);
        })
        .catch(console.error);
    }
  }
}

class VueOrbitDB {
  constructor({
    store, databases, options, beforeConnect, afterConnect, meta,
  }) {
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
    this.meta = {
      ...meta,
    };
  }

  static install() {}

  async connect({ options, meta }) {
    if (this.hooks.beforeConnect) this.hooks.beforeConnect(this);
    this.node = await Ipfs.create({
      ...IPFSOPTIONS,
      ...this.options,
      ...options,
    });
    this.meta = {
      ...this.meta,
      ...meta,
    };
    this.odb = await OrbitDB.createInstance(this.node);
    this.id = await this.node.id();
    const promises = [];
    _.forOwn(this.databases, (db, name) => {
      debug('opening database %s', name);
      promises.push(db.open(this));
    });
    Promise
      .all(promises)
      .then(() => {
        if (this.hooks.afterConnect) this.hooks.afterConnect(this);
      })
      .catch(console.error);
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

    _.each(message.topicIDs, (topic) => {
      _.each(this._actions.get(topic), (action) => {
        if (typeof action === 'string') {
          this._store.dispatch(action, args);
        } else {
          try {
            action(args);
          } catch (e) {
            console.error(e);
          }
        }
      });
    });
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
