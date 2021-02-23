import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/components/Home';
import Feed from '@/components/Feed';


Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/feed',
      name: 'feed',
      component: Feed,
      props: route => ({ selected: route.query.tab }),
    }
  ],
});


export default router;
