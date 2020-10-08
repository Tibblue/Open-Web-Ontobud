<template>
  <v-app>
    <AppBar ref="refAppbar"
      @toggleSidebarON="toggleSidebarON"
      @changedRepoList="updateRepoList"
      @changedCurrentRepo="updateCurrentRepo"
    />
    <Sidebar ref="refSidebar"/>

    <v-main>
      <router-view ref="refMain" v-bind="myProps"
        @changedCurrentRepo="refreshCurrentRepo"
      />
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
  data: () => ({
    currentRepo: {},
    repoList: []
  }),
  // mounted: async function () {
  // },
  methods: {
    toggleSidebarON () {
      this.$refs.refSidebar.sidebarVisible = true
    },
    updateRepoList (list) {
      // console.log('update REPOLIST')
      // console.log(list)
      this.repoList = list
    },
    updateCurrentRepo (repo) {
      // console.log('update CURRENT')
      // console.log(repo)
      this.currentRepo = repo
    },
    refreshCurrentRepo (id, name) {
      // console.log('refresh CURRENT')
      // console.log(id, name)
      this.$refs.refAppbar.getRepositories()
    }
  },
  computed: {
    myProps () {
      // console.log(this.$route.name)
      if (this.$route.name === 'home') {
        return {
          currentRepo: this.currentRepo,
          repoList: this.repoList
        }
      // } else if (this.$route.name === 'b') {
      //   return { repoList: this.repoList }
      } else {
        return {}
      }
    }
  }
}
</script>
