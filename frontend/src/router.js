import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('./views/Login.vue'),
    },
    {
      path: '/auth/logout',
      name: 'logout',
      component: () => import('./views/Logout.vue'),
    },
    {
      path: '/',
      name: 'homepage',
      component: () => import('./views/Home.vue'),
    },
    {
      path: '/manage',
      name: 'manageRepo',
      component: () => import('./views/Manage.vue'),
    },
    {
      path: '/info',
      name: 'repoInfo',
      component: () => import('./views/Info.vue'),
    },
    {
      path: '/sparql',
      name: 'sparql',
      component: () => import('./views/Sparql.vue'),
    },
    {
      path: '/sparql/resource',
      name: 'resource',
      component: () => import('./views/Resource.vue'),
    },
    {
      path: '/repositories',
      name: 'repositories',
      component: () => import('./views/Repositories.vue'),
    },
  ]
})
