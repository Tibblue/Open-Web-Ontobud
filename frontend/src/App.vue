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
import AppBar from '@/components/app/AppBar'
import Sidebar from '@/components/app/Sidebar'
import Footer from '@/components/app/Footer'

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
      this.update = ["updateRepos"]
      console.log("emit is gud")
    }
  },
};
</script>
