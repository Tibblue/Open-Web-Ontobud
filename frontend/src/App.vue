<template>
  <v-app>
    <AppBar @toggleSidebarON="toggleSidebarON"/>
    <Sidebar ref="refSidebar"/>

    <v-main>
      <router-view />
    </v-main>

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
    Footer
  },
  // data: () => ({
  // }),
  // mounted: async function (){
  // },
  methods: {
    toggleSidebarON () {
      this.$refs.refSidebar.sidebarVisible = true
    }
  }
}
</script>
