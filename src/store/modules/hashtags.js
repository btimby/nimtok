import { getters, actions, mutations, } from '@/store/modules/buckets';

const state = {
  buckets: {},
};


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
