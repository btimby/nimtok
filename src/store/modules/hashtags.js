import Debug from 'debug';
import { getHourBucket } from '@/utils';


const debug = Debug('nimtok:store:hashtags');
const state = {
  hashtags: {},
};

const getters = {
  hashtags: state => {
    return state.hashtags;
  },
};

const actions = {
  incr({ commit }, hashtags, n = 1) {
    // Broadcast hashtags.
    for (let i in hashtags) {
      commit('incr', hashtags[i], n);
    }
  },

  getByTag(tag) {
    const stats = {
      total: 0,
      hourly: {},
    };
    const buckets = Object.keys(state.hashtags);

    for (let i in buckets) {
      const key = buckets[i];
      const bucket = state.hashtags[key];
      const count = bucket[tag];
      stats.total += count;
      stats.hourly[key] = count;
    }

    return stats;
  },
};

const mutations = {
  incr(state, tag, n = 1) {
    debug('mutations.incr(%s, %i)', tag, n);

    const hour = getHourBucket();
    let bucket = state.hashtags[hour];
    tag = tag.toLowerCase();

    if (!bucket) {
      bucket = state.hashtags[hour] = {};
    }

    if (!bucket[tag]) {
      bucket[tag] = n;
      return;
    }
    bucket[tag] += n;
  },
};


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
