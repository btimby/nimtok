/* eslint-disable no-shadow */

import Debug from 'debug';

const debug = Debug('nimtok:store:alerts');
const state = {
  alerts: [],
};

const getters = {
  alerts: (state) => state.alerts,
};

const actions = {
  addAlert({ commit }, obj) {
    debug('actions.addAlert(%O)', obj);

    commit('ADD_ALERT', obj);
  },
};

const mutations = {
  ADD_ALERT(state, obj) {
    debug('mutations.addAlert(%O)', obj);

    state.alerts.push(obj);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
