import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/auth/logout',
      name: 'logout',
      component: () => import('./views/Logout.vue')
    },
    // {
    //   path: '/auth/user',
    //   name: 'user',
    //   component: () => import('./views/User.vue'),
    // },

    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home.vue')
    },
    {
      path: '/repositories',
      name: 'repositories',
      component: () => import('./views/Repositories.vue')
    },
    {
      path: '/manage',
      name: 'manageRepo',
      component: () => import('./views/Manage.vue')
    },
    {
      path: '/info',
      name: 'repoInfo',
      component: () => import('./views/Info.vue')
    },
    {
      path: '/sparql',
      name: 'sparql',
      component: () => import('./views/Sparql.vue')
    },
    {
      path: '/resource',
      name: 'resource',
      component: () => import('./views/Resource.vue')
    },
    // {
    //   path: '/navigation',
    //   name: 'navigation',
    //   component: () => import('./views/Navigation.vue'),
    // },

    {
      path: '/feedback',
      name: 'feedback',
      component: () => import('./views/Feedback.vue')
    }
  ]
})
