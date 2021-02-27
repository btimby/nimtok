import Vue from 'vue';
import Vue2Filters from 'vue2-filters';
import VueAsyncComputed from 'vue-async-computed';
import VTooltip from 'v-tooltip';
import App from '@/App.vue';
import router from '@/router';
import orbitdb from '@/orbitdb';
import store from '@/store';
import vuetify from '@/vuetify';

Vue.config.productionTip = false;
// TODO: remove logging...
// window.LOG = 'orbit*';
// localStorage.setItem('debug', 'ipfs:*');
localStorage.setItem('debug', 'nimtok:*');
// localStorage.removeItem('debug');

Vue.use(Vue2Filters);
Vue.use(VueAsyncComputed);
Vue.use(VTooltip);

new Vue({
  vuetify,
  store,
  router,
  orbitdb,
  render: (h) => h(App),
}).$mount('#app');
