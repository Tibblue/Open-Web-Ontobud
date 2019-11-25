<template>
  <v-navigation-drawer app permanent
    :mini-variant="sidebar_mini"
  >
    <v-list-item>
      <v-list-item-icon>
        <v-icon>fas fa-flag</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="title">
          RDF4J Frontend
        </v-list-item-title>
        <!-- <v-list-item-subtitle>
          subtitle
        </v-list-item-subtitle> -->
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


    <v-list nav v-if="!this.$session.get('userToken')">
      <v-list-item @click="login()" link to="/auth/login">
        <v-list-item-icon>
          <v-icon>fas fa-sign-in-alt</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="title">
            Login
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item @click="login()" link to="/auth/signup">
        <v-list-item-icon>
          <v-icon>fas fa-user-plus</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="title">
            TODO Sign Up
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list nav v-else>
      <v-list-item @click="logout()">
        <v-list-item-icon>
          <v-icon>fas fa-sign-out-alt</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="title">
            Logout
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link to="/auth/userSettings">
        <v-list-item-icon>
          <v-icon>fas fa-user-cog</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="title">
            TODO User Settings
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list nav>
      <v-list-item
        v-for="item in sidebar_items"
        :key="item.text"
        link :to="item.link"
        color="accent"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="title">{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
    model: 1,
    sidebar_mini: false,
    sidebar_items: [
      // { text: 'Login', icon: 'fas fa-sign-in-alt', link: '/auth/login'},
      // { text: 'Sign Up', icon: 'fas fa-user-plus', link: '/auth/signup'},
      // { text: 'Logout', icon: 'fas fa-sign-out-alt', link: '/auth/logout'},
      // { text: 'TODO User Settings', icon: 'fas fa-user-cog', link: '/auth/usersettings'},
      { text: 'Home', icon: 'fas fa-home', link: '/'},
      { text: 'Manage Repository', icon: 'fas fa-archive', link: '/manage'},
      { text: 'Repository Info', icon: 'fas fa-info-circle', link: '/info'},
      { text: 'SPARQL', icon: 'fas fa-pen', link: '/sparql'},
      { text: 'All Repositories', icon: 'fas fa-boxes', link: '/repositories'},
      { text: 'TODO Settings', icon: 'fas fa-cog', link: '/settings'},
      { text: 'TODO Admin', icon: 'fas fa-user-shield', link: '/admin'},
      // { text: 'Settings', icon: 'fas fa-cog',
      //   subgroup: [
      //     { text: 'Repositories', icon: 'fas fa-chevron_right', link: '/testing/button1/repos'},
      //     { text: 'My Settings', icon: 'fas fa-chevron_right', link: '/testing/button2/settings'}
      //   ]
      // },
    ],
  }),
  // mounted: async function (){
  //   // console.log(process.env) # debug
  // },
  methods: {
    goTo: function (id) {
      this.$router.push(id)
    },
    swapDarkMode: function () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    },
    login: function () {
      // TODO
    },
    logout: function () {
      this.$session.remove("userToken")
      this.$session.remove("userEmail")
      this.$router.go()
      // this.$forceUpdate()
    },
  }
}
</script>

<style>

</style>
