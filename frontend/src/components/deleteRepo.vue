<template>
  <v-row>
    <v-col cols="9" px-2>
      <v-text-field hide-details class="mt-0 pt-0"
        v-model="deleteRepoID"
        label="Repo ID"
      ></v-text-field>
    </v-col>
    <v-col cols="3">
      <v-btn color="warning" @click="deleteRepo(deleteRepoID)">
        Delete Repo
      </v-btn>
    </v-col>
    <v-col cols="12">
      <v-text-field readonly outlined hide-details
        v-model="deleteRepoResponse"
        label="Response"
        placeholder="Response to the request"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
const rdf4j_url = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT

export default {
  data: () => ({
    // selectedRepo: "Loading Repositories",
    // repoSearch: "",
    // repoList: undefined,
    deleteRepoID: "",
    deleteRepoResponse: "",
  }),
  mounted: async function (){
    // console.log(process.env) # debug
    // this.getRepositories()
  },
  methods: {
    deleteRepo(repoID) {
      axios.delete(rdf4j_url+'/rdf4j-server/repositories/'+repoID)
        .then(response => {
          this.deleteRepoResponse = "Deleted " + repoID + " with SUCCESS" + response.data
        })
        .catch(alert => {
          this.deleteRepoResponse = "Remoção FALHOU!!! " + alert
        })
    },
    // getRepositories() {
    //   // TODO: Consider adding a loading bar on Repo Reload
    //   axios.get(rdf4j_url+'/rdf4j-server/repositories')
    //     .then(response => {
    //       // this.alert = response.data // debug
    //       // console.log(response.data.head) // debug column names
    //       // console.log(response.data.results.bindings) // debug results
    //       var repoList = response.data.results.bindings
    //       var repoListText = []
    //       repoList.forEach(elem => {
    //         repoListText.push(elem.title.value+" ID:"+elem.id.value)
    //       });
    //       // console.log(response.data) // debug
    //       this.repoList = repoListText
    //       if(this.$session.has("repoName"))
    //         this.selectedRepo = this.$session.get("repoName")+" ID:"+this.$session.get("repoID")
    //       if(this.selectedRepo==="Loading Repositories")
    //         this.selectedRepo = repoListText[0]
    //     })
    //     .catch(alert => {
    //       // this.alert = error // debug
    //       // this.selectedRepo = "PEDIDO FALHOU!!! " + alert
    //       this.selectedRepo = "No Repositories available"
    //     })
    // },
  },
};
</script>
