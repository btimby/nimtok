import Debug from 'debug';
import { getHourBucket, invert } from '@/utils';
import config from '@/config';

const MILLIS_PER_HOUR = 3600000;

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
  getByTag({ state }, tag) {
    debug('actions.getByTag(%s)', tag);

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

  getTopN({ commit, state }, n) {
    debug('actions.getTopN(%i)', n);

    commit('prune');

    const hashtags = {};

    for (let hour in state.hashtags) {
      const bucket = invert(state.hashtags[hour]);
      const topN = Object.keys(bucket).sort().reverse().slice(0, n);

      for (let i in topN) {
        hashtags[hour][bucket[topN[i]]] = topN[i];
      }
    }

    return hashtags;
  },

  incr({ commit, }, tags, n = 1) {
    debug('actions.incr(%O, %i)', tags, n);
    commit('purge');

    for (let i in tags) {
      commit('incr', tags[i], n);
    }
  },

  merge({ commit, state, }, hashtags) {
    debug('actions.merge(%O, %i)', hashtags);

    for (let hour in hashtags) {
      for (let tag in hashtags[hour]) {
        const bucket = state.hashtags[hour];
        const n = hashtags[hour][tag];

        if (!bucket || bucket[tag] < n) {
          commit('set', hour, tag, n);
        }
      }
    }
  },
};

const mutations = {
  incr(state, tag, n = 1) {
    debug('mutations.incr(%s, %i)', tag, n);

    const hour = getHourBucket();
    tag = tag.toLowerCase();

    let bucket = state.hashtags[hour];
    if (!bucket) {
      bucket = state.hashtags[hour] = {};
    }

    if (!bucket[tag]) {
      bucket[tag] = n;
      return;
    }
    bucket[tag] += n;
  },

  set(state, hour, tag, n) {
    debug('mutations.set(%i, %s, %i)', hour, tag, n);

    tag = tag.toLowerCase();

    let bucket = state.hashtags[hour];
    if (!bucket) {
      bucket = state.hashtags[hour] = {};
    }

    bucket[tag] = n;
  },

  prune(state) {
    debug('mutations.prune()');

    const ttl = getHourBucket() - config.HASHTAG_RETAIN_HOURS * MILLIS_PER_HOUR;

    for (let hour in state.buckets) {
      if (hour <= ttl) {
        delete state.buckets[hour];
      }
    }
  },
};


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
