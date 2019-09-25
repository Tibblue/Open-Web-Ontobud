<template>
  <v-app>
    <v-app-bar app>
      <!--
      <v-toolbar-title class="headline text-uppercase">
        <span>Temporary</span>
        <span class="font-weight-light">stuff</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="goToHome()">
        <h2>Home</h2>
      </v-btn>
      <v-btn flat @click="goToTable('animes')">
        <h3>Anime</h3>
      </v-btn>
       -->
    </v-app-bar>

    <Sidebar/>

    <v-content>
      <router-view/>
    </v-content>

    <Footer/>

  </v-app>
</template>

<script>
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'

export default {
  name: 'App',
  components: {
    Sidebar,
    Footer,
  },
  data: () => ({
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
    goToTable: function (table) {
      this.$router.push('/'+table)
    }
  }
};
</script>
