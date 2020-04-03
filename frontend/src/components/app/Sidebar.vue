<template>
  <v-navigation-drawer app permanent
    :mini-variant="sidebar_mini"
  >
    <v-list-item link to="/">
      <v-list-item-icon>
        <v-icon>mdi-graph</v-icon>
        <!-- <v-icon>fas fa-flag</v-icon> -->
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="title">
          OntoWorks
        </v-list-item-title>
        <v-list-item-subtitle>
          a RDF4J Frontend
          <!-- {{this.$vuetify.breakpoint.name}} -->
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item @click="goToBackend()">
      <v-list-item-icon>
        <v-icon>mdi-api</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="title">
          Backend API&nbsp;
          <v-icon>mdi-open-in-new</v-icon>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list-item @click="sidebar_mini = !sidebar_mini">
      <v-list-item-icon>
        <v-icon v-if="!sidebar_mini">fas fa-chevron-left</v-icon>
        <v-icon v-else>fas fa-chevron-right</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="title">
          Minimize Sidebar
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item @click="swapDarkMode()">
      <v-list-item-icon>
        <v-icon v-if="!this.$vuetify.theme.dark">fas fa-sun</v-icon>
        <v-icon v-else>fas fa-moon</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="title">
          Light/Dark Mode
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list-item
      v-for="item in sidebar_items"
      :key="item.text"
      link :to="item.link"
    >
      <v-list-item-icon>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="title">
          {{ item.text }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

  </v-navigation-drawer>
</template>

<script>
import axios from 'axios'
const qs = require('querystring')
const backend_url = "http://"+process.env.VUE_APP_BACKEND_HOST+":"+process.env.VUE_APP_BACKEND_PORT

export default {
  data: () => ({
    model: 1,
    sidebar_mini: false,
    sidebar_items: [
      // Auth related
      // { text: 'Login', icon: 'fas fa-sign-in-alt', link: '/auth/login'},
      // { text: 'Sign Up', icon: 'fas fa-user-plus', link: '/auth/signup'},
      // { text: 'Logout', icon: 'fas fa-sign-out-alt', link: '/auth/logout'},
      // { text: 'TODO User Settings', icon: 'fas fa-user-cog', link: '/auth/usersettings'},

      // Navigation
      { text: 'Home', icon: 'fas fa-home', link: '/'}, //FIXME: tirar??
      { text: 'Manage Repositories', icon: 'fas fa-boxes', link: '/repositories'},
      { text: 'Manage Repo', icon: 'fas fa-archive', link: '/manage'},
      { text: 'Repository Info', icon: 'fas fa-info-circle', link: '/info'},
      { text: 'SPARQL', icon: 'fas fa-pen', link: '/sparql'},
      { text: 'Resource', icon: 'fas fa-project-diagram', link: '/resource'},
      // { text: 'TODO Navigation', icon: 'fas fa-project-diagram', link: '/navigation'},
      { text: 'TODO Admin', icon: 'fas fa-user-shield', link: '/admin'},
      // { text: 'TODO Settings', icon: 'fas fa-cog', link: '/settings'},
    ],
  }),
  mounted: async function (){
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
      case 'sm':
        this.sidebar_mini = true
        break;
      case 'md':
      case 'lg':
      case 'xl':
        this.sidebar_mini = false
        break;
    }
  },
  methods: {
    goTo: function (id) {
      this.$router.push(id)
    },
    goToBackend: function () {
      window.open("http://epl.di.uminho.pt:8001");
    },
    swapDarkMode: function () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    },
  }
}
</script>

<style>

</style>
