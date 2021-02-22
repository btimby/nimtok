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
    this.node = null;
    this.odb = null;
  }

  static install() {}

  async connect({ IpfsOptions, }) {
    const options = {
      ...IPFSOPTIONS,
      ...IpfsOptions,
    }
    this.node = await Ipfs.create(options);
    this.odb = await OrbitDB.createInstance(this.node);
    this.id = await this.node.id();
    this.databases = {};
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

  // TODO: this should be implemented within orbitdb.
  async addOrCreate(name, type, options) {
    let db;

    try {
      db = await orbitdb.odb.create(name, type, options);
    } catch(e) {
      // If the error is that the database exists, open it.
      if (e.message.indexOf('exists') === -1) {
        throw e;
      }
      db = await orbitdb.odb.open(name);
    }

    this.add('inbox', db);
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
