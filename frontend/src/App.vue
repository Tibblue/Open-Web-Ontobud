<template>
  <v-app>
    <AppBar/>

    <Sidebar/>

    <v-content>
      <router-view />
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
    // selectedRepo: "hi",
    // update: null,
  }),
  methods: {
    updateRepos() {
      // this.$refs.appBar.getRepositories()
      this.update = ["updateRepos"]
      console.log("emit is gud")
    }
  },
};
</script>
