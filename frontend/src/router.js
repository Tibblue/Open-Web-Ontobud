import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'homepage',
      component: () => import('./views/Home.vue'),
      props: true,
    },
    {
      path: '/manage',
      name: 'manageRepo',
      component: () => import('./views/Manage.vue'),
      props: true,
    },
    {
      path: '/info',
      name: 'repoInfo',
      component: () => import('./views/Info.vue'),
      props: true,
    },
    {
      path: '/sparql',
      name: 'sparql',
      component: () => import('./views/Sparql.vue'),
      props: true,
    },
    {
      path: '/repositories',
      name: 'repositories',
      component: () => import('./views/Repositories.vue'),
      props: true,
    },
  ]
})
