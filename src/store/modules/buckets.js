import Debug from 'debug';
import { getHourBucket, invert } from '@/utils';
import config from '@/config';

const debug = Debug('nimtok:store:bucket');
const MILLIS_PER_HOUR = 3600000;


function buckets(state) {
  return state.buckets;
}

function getByTag({ state }, tag) {
  debug('actions.getByTag(%s)', tag);

  const stats = {
    total: 0,
    hourly: {},
  };
  const buckets = Object.keys(state.buckets);

  for (let i in buckets) {
    const key = buckets[i];
    const bucket = state.buckets[key];
    const count = bucket[tag];
    stats.total += count;
    stats.hourly[key] = count;
  }

  return stats;
}

function getTopN({ commit, state }, n) {
  debug('actions.getTopN(%i)', n);

  commit('PRUNE');

  const buckets = {};

  for (let hour in state.buckets) {
    const bucket = invert(state.buckets[hour]);
    const topN = Object.keys(bucket).sort().reverse().slice(0, n);

    for (let i in topN) {
      buckets[hour][bucket[topN[i]]] = topN[i];
    }
  }

  return buckets;
}

function incr({ commit, }, tags, n = 1) {
  debug('actions.incr(%O, %i)', tags, n);

  commit('PRUNE');

  for (let i in tags) {
    commit('INCR', tags[i], n);
  }
}

function merge({ commit, state, }, buckets) {
  debug('actions.merge(%O, %i)', buckets);

  for (let hour in buckets) {
    for (let tag in buckets[hour]) {
      const bucket = state.buckets[hour];
      const n = buckets[hour][tag];

      if (!bucket || bucket[tag] < n) {
        commit('SET', hour, tag, n);
      }
    }
  }
}

function INCR(state, tag, n = 1) {
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
}

function SET(state, hour, tag, n) {
  debug('mutations.set(%i, %s, %i)', hour, tag, n);

  tag = tag.toLowerCase();

  let bucket = state.buckets[hour];
  if (!bucket) {
    bucket = state.buckets[hour] = {};
  }

  bucket[tag] = n;
}

function PRUNE(state) {
  debug('mutations.prune()');

  const ttl = getHourBucket() - config.BUCKETS_RETAIN_HOURS * MILLIS_PER_HOUR;

  for (let hour in state.buckets) {
    if (hour <= ttl) {
      delete state.buckets[hour];
    }
  }
}


export {
  buckets,
  getByTag,
  getTopN,
  incr,
  merge,
  INCR,
  SET,
  PRUNE,
};
