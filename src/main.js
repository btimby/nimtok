import Vue from 'vue';
import Vue2Filters from 'vue2-filters';
import App from '@/App.vue';
import router from '@/router';
import orbitdb from '@/orbitdb';
import store from '@/store';
import vuetify from '@/vuetify';

Vue.config.productionTip = false
// TODO: remove logging...
// window.LOG = 'orbit*'; 
// localStorage.setItem('debug', 'ipfs:*');
localStorage.setItem('debug', 'nimtok:*');
// localStorage.removeItem('debug');

Vue.use(Vue2Filters);


new Vue({
  vuetify,
  store,
  router,
  orbitdb,
  render: h => h(App),
}).$mount('#app');

// TODO: eventually remove this.
store.dispatch('auth/tryLogin');
