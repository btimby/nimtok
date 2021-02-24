import Debug from 'debug';
import { getHourBucket } from '../../utils';


const debug = Debug('nimtok:store:mentions');
const state = {
  mentions: {},
};

const getters = {
  mentions: state => {
    return state.mentions;
  },
};

const actions = {
  incr({ commit }, mentions, n = 1) {
    // Broadcast hashtags.
    for (let i in mentions) {
      commit('incr', mentions[i], n);
    }
  },

  getByName(name) {
    const stats = {
      total: 0,
      hourly: {},
    };

    const buckets = Object.keys(state.mentions);

    for (let i in buckets) {
      const key = buckets[i];
      const bucket = state.mentions[key];
      const count = bucket[name];
      stats.total += count;
      stats.hourly[key] = count;
    }

    return stats;
  },
};

const mutations = {
  incr(state, name, n = 1) {
    debug('mutations.incr(%s, %i)', name, n);

    const hour = getHourBucket();
    let bucket = state.mentions[hour];
    name = name.toLowerCase();

    if (!bucket) {
        bucket = state.mentions[hour] = {};
    }

    if (!bucket[name]) {
      bucket[name] = n;
      return;
    }
    bucket[name] += n;
  },
};


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
