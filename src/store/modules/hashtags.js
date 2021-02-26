import {
  buckets, getByTag, getTopN, incr, merge, INCR, SET, PRUNE,
} from '@/store/modules/buckets';

const state = {
  buckets: {},
};


export default {
  namespaced: true,
  state,
  getters: {
    buckets,
  },
  actions: {
    getByTag,
    getTopN,
    incr,
    merge,
  },
  mutations: {
    INCR,
    SET,
    PRUNE,
  },
};
