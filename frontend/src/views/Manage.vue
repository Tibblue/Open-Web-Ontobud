<template>
  <v-container>
        <div class="text-center"> <!-- DEBUG -->
          <v-btn color="info" @click="snackbarDEBUG=true">
            Confirm current repo (DEBUG)
          </v-btn>
          <v-snackbar top v-model="snackbarDEBUG">
            {{ this.$session.get("repoName") }} - {{ this.$session.get("repoID") }}
            <v-btn @click="snackbarDEBUG=false">Close</v-btn>
          </v-snackbar>
        </div>
    <v-row>
      <v-col cols="6">
        <!-- <createRepo/> -->
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
// // import createRepo from '@/components/createRepo'
import clearRepoStatements from '@/components/clearRepoStatements'
import deleteCurrentRepo from '@/components/deleteCurrentRepo'
import axios from 'axios'
const rdf4j_url = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT

export default {
  components: {
    // createRepo,
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
