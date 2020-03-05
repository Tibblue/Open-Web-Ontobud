import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    // { // not used
    //   path: '/auth/login',
    //   name: 'login',
    //   component: () => import('./views/Login.vue'),
    // },
    // { // not used
    //   path: '/auth/signin',
    //   name: 'signin',
    //   component: () => import('./views/SignIn.vue'),
    // },
    {
      path: '/auth/logout',
      name: 'logout',
      component: () => import('./views/Logout.vue'),
    },
    // {
    //   path: '/auth/userSettings',
    //   name: 'userSettings',
    //   component: () => import('./views/UserSettings.vue'),
    // },


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
      path: '/resource',
      name: 'resource',
      component: () => import('./views/Resource.vue'),
    },
    // {
    //   path: '/navigation',
    //   name: 'navigation',
    //   component: () => import('./views/Navigation.vue'),
    // },
    {
      path: '/repositories',
      name: 'repositories',
      component: () => import('./views/Repositories.vue'),
    },
  ]
})
