<template>
  <v-app>
    <AppBar @repoChanged="selectedRepo=$event"/>

    <Sidebar/>

    <v-content>
      <router-view selectedRepo="selectedRepo"/>
    </v-content>

    <Footer/>
  </v-app>
</template>

<script>
import AppBar from './components/AppBar'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'

export default {
  name: 'App',
  components: {
    AppBar,
    Sidebar,
    Footer,
  },
  data: () => ({
    selectedRepo: "a",
    footer_icons: [
      // ['home','http://localhost:8080'],
      ['fab fa-github','http://www.github.com/Tibblue'],
      ['fab fa-linkedin','https://www.linkedin.com/in/kiko-oliveira/'],
      ['fas fa-university','https://www.uminho.pt'],
    ]
  }),
  methods: {
    goTo: function (link) {
      // window.location = link; // opens in same tab
      window.open(link); // opens another tab
    },
    goToHome: function () {
      this.$router.push('/')
    },
  }
};
</script>
