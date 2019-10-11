<template>
  <v-app-bar app color="primary">
    <v-btn icon @click="getRepositories()">
      <v-icon>fas fa-sync</v-icon>
    </v-btn>
    <v-toolbar-title v-bind:selectedRepo.sync="selectedRepo">
      {{selectedRepo}}
    </v-toolbar-title>

    <div class="flex-grow-1"></div>
    <v-combobox dense hide-details
      v-model="selectedRepo"
      no-data-text="No Repositories available"
      :items="repoList"
      label="Selected Repositoy"
      v-on:change="repoChange(getRepoName(selectedRepo),getRepoID(selectedRepo))"
    >
    </v-combobox>
  </v-app-bar>
</template>

<script>
import axios from 'axios'
const rdf4j_url = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT

export default {
  data: () => ({
    selectedRepo: "Loading Repositories",
    repoList: undefined,
  }),
  mounted: async function (){
    // console.log(process.env) # debug
    this.getRepositories()
  },
  methods: {
    repoChange(name, id) {
      this.$session.set("repoName",name)
      this.$session.set("repoID",id)
      // this.$emit('repoChanged',name) # NOTE: isto funcionou
      // this.$router.replace({
      //   query: {
      //     repoID: id,
      //     repoName: name,
      //   }
      // })
      // location.reload()
    },
    getRepositories() {
      // TODO: Consider adding a loading bar on Repo Reload
      axios.get(rdf4j_url+'/rdf4j-server/repositories')
        .then(response => {
          // this.alert = response.data // debug
          // console.log(response.data.head) // debug column names
          // console.log(response.data.results.bindings) // debug results
          var repoList = response.data.results.bindings
          var repoListText = []
          repoList.forEach(elem => {
            repoListText.push(elem.title.value+" ID:"+elem.id.value)
          });
          // console.log(response.data) // debug
          this.repoList = repoListText
          if(this.$session.has("repoName"))
            this.selectedRepo = this.$session.get("repoName")+" ID:"+this.$session.get("repoID")
          if(this.selectedRepo==="Loading Repositories")
            this.selectedRepo = repoListText[0]
        })
        .catch(alert => {
          // this.alert = error // debug
          // this.selectedRepo = "PEDIDO FALHOU!!! " + alert
          this.selectedRepo = "No Repositories available"
        })
    },
    getRepoName(string) {
      return string.split(" ID:")[0]
    },
    getRepoID(string) {
      return string.split(" ID:")[1]
    },
  },
};
</script>
