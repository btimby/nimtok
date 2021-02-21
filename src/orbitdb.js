import Vue from 'vue';
import VueOrbitDB from '@/plugins/orbitdb';
import store from '@/store';

Vue.use(VueOrbitDB);


const orbitdb = new VueOrbitDB({
  store,
});


export default orbitdb;
