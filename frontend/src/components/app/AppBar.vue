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
      v-on:change="repoChange(getRepoID(selectedRepo),getRepoName(selectedRepo))"
    >
    </v-combobox>
  </v-app-bar>
</template>

<script>
import Vuex from 'vuex'
import axios from 'axios'
const rdf4j_url = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT

export default {
  // props: ['update'],
  data: () => ({
    selectedRepo: "Loading Repositories",
    repoList: undefined,
  }),
  mounted: async function (){
    // console.log(process.env) // debug
    this.getRepositories()
  },
  computed: {
    $repo: {
      get: Vuex.mapState(['$repo']).$repo,
      set: Vuex.mapMutations(['update$repo']).update$repo,
    },
  },
  methods: {
    repoChange(id, name) {
      this.$repo = {id: id, name: name}
      // this.$repo.id = id
      // this.$repo.name = name
      // console.log(this.$store.state.$repo) // debug
      this.$session.set("repoID",id)
      this.$session.set("repoName",name)
      // this.$emit('repoChanged',name) # NOTE: isto funcionou
      // location.reload()
    },
    getRepositories() {
      // TODO: Consider adding a loading bar on Repo Reload
      axios.get(rdf4j_url+'/rdf4j-server/repositories')
        .then(response => {
          // console.log(response.data.head) // debug column names
          // console.log(response.data.results.bindings) // debug results
          var repoList = response.data.results.bindings
          var repoListText = []
          repoList.forEach(elem => {
            repoListText.push(elem.title.value+" ID:"+elem.id.value)
          });
          // console.log(response.data) // debug
          this.repoList = repoListText
          if(this.$session.has("repoName")){
            this.selectedRepo = this.$session.get("repoName")+" ID:"+this.$session.get("repoID")
            this.$repo = {
              id: this.$session.get("repoID"),
              name: this.$session.get("repoName"),
            }
          }
          if(this.selectedRepo==="Loading Repositories"){
            this.selectedRepo = repoListText[0]
            this.$repo = {
              id: this.getRepoID(repoListText[0]),
              name: this.getRepoName(repoListText[0]),
            }
          }
        })
        .catch(alert => {
          // this.alert = error // debug
          this.selectedRepo = "No Repositories available" + alert
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
