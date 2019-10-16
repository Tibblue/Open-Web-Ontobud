<template>
  <v-container>
    <debug/>
    <v-row>
      <v-col cols="6">
        <importRepo/>
        <v-divider></v-divider>
        <exportRepo/>
      </v-col>
      <v-col cols="6">
        <clearRepoStatements/>
        <v-divider class="ma-1"></v-divider>
        <deleteCurrentRepo/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import debug from '@/components/debug'
import importRepo from '@/components/importRepo'
import exportRepo from '@/components/exportRepo'
import clearRepoStatements from '@/components/clearRepoStatements'
import deleteCurrentRepo from '@/components/deleteCurrentRepo'
import axios from 'axios'
const rdf4j_url = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT

export default {
  components: {
    debug,
    importRepo,
    exportRepo,
    clearRepoStatements,
    deleteCurrentRepo,
  },
  data: () => ({
    snackbarDEBUG: false,
  }),
  // mounted: async function (){
  //   console.log(this.$props)
  //   console.log(process.env)
  // },
  methods: {
    // simplifyRepos: function (repo) {
    //   return {
    //     id: repo.id.value,
    //     title: repo.title.value
    //   }
    // }
  }
}
</script>
