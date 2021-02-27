import Debug from 'debug';
import { getHourBucket, invert } from '@/utils';
import config from '@/config';

const debug = Debug('nimtok:store:bucket');
const MILLIS_PER_HOUR = 3600000;

const getters = {
  buckets(state) {
    return state.buckets;
  },
};

const actions = {
  getByTag({ state }, tag) {
    debug('actions.getByTag(%s)', tag);

    const stats = {
      total: 0,
      hourly: {},
    };
    const buckets = Object.keys(state.buckets);

    for (const i in buckets) {
      const key = buckets[i];
      const bucket = state.buckets[key];
      const count = bucket[tag];
      stats.total += count;
      stats.hourly[key] = count;
    }

    return stats;
  },

  getTopN({ commit, state }, n) {
    debug('actions.getTopN(%i)', n);

    commit('PRUNE');

    const buckets = {};

    for (const hour in state.buckets) {
      const bucket = invert(state.buckets[hour]);
      const topN = Object.keys(bucket).sort().reverse().slice(0, n);

      for (const i in topN) {
        buckets[hour][bucket[topN[i]]] = topN[i];
      }
    }

    return buckets;
  },

  incr({ commit }, tags, n = 1) {
    debug('actions.incr(%O, %i)', tags, n);

    commit('PRUNE');

    for (const i in tags) {
      commit('INCR', tags[i], n);
    }
  },

  merge({ commit, state }, buckets) {
    debug('actions.merge(%O, %i)', buckets);

    for (const hour in buckets) {
      for (const tag in buckets[hour]) {
        const bucket = state.buckets[hour];
        const n = buckets[hour][tag];

        if (!bucket || bucket[tag] < n) {
          commit('SET', hour, tag, n);
        }
      }
    }
  },
};

const mutations = {
  INCR(state, tag, n = 1) {
    debug('mutations.incr(%s, %i)', tag, n);

    const hour = getHourBucket();
    tag = tag.toLowerCase();

    let bucket = state.buckets[hour];
    if (!bucket) {
      bucket = state.buckets[hour] = {};
    }

    if (!bucket[tag]) {
      bucket[tag] = n;
      return;
    }
    bucket[tag] += n;
  },

  SET(state, hour, tag, n) {
    debug('mutations.set(%i, %s, %i)', hour, tag, n);

    tag = tag.toLowerCase();

    let bucket = state.buckets[hour];
    if (!bucket) {
      bucket = state.buckets[hour] = {};
    }

    bucket[tag] = n;
  },

  PRUNE(state) {
    debug('mutations.prune()');

    const ttl = getHourBucket() - config.BUCKETS_RETAIN_HOURS * MILLIS_PER_HOUR;

    for (const hour in state.buckets) {
      if (hour <= ttl) {
        delete state.buckets[hour];
      }
    }
  },
};

export {
  getters,
  actions,
  mutations,
};
