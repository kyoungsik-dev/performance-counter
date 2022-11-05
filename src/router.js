import Vue from 'vue'
import Router from 'vue-router';

import Intro from './pages/Intro.vue'

Vue.use(Router);

const routes = [
  { path: '/', component: Intro }
]

const router = new Router({
  mode: 'history',
  routes
})

export default router;