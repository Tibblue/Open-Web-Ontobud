<template>
  <v-app-bar app color="primary">
    <!-- <v-toolbar-title v-bind:selectedRepo.sync="selectedRepo">
      {{selectedRepo}}
    </v-toolbar-title> -->
    <div class="flex-grow-1"></div>
    <v-btn :loading="loadingRepos" icon @click="getRepositories()">
      <v-icon>fas fa-sync</v-icon>
    </v-btn>
    <v-col cols="4">
      <v-combobox dense hide-details
        v-model="selectedRepo"
        no-data-text="No Repositories available"
        :items="repoList"
        label="Selected Repositoy"
        v-on:change="repoChange(getRepoID(selectedRepo),getRepoName(selectedRepo))"
      ></v-combobox>
    </v-col>
  </v-app-bar>
</template>

<script>
import Vuex from 'vuex'
import axios from 'axios'
// const rdf4j_url = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT
const backend_url = "http://"+process.env.VUE_APP_BACKEND_HOST+":"+process.env.VUE_APP_BACKEND_PORT

export default {
  // props: ['update'],
  data: () => ({
    loadingRepos: false,
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
      this.$router.go(0)
    },
    getRepositories() {
      this.loadingRepos = true
      axios.get(backend_url+'/api/rdf4j/management/listRepos')
        .then(response => {
          // console.log(response.data) // debug
          var repoList = response.data
          var repoListText = []
          repoList.forEach(elem => {
            repoListText.push(elem.title.value+" ID:"+elem.id.value)
          });
          this.repoList = repoListText
          if(this.$session.has("repoName")){
            this.selectedRepo = this.$session.get("repoName")+" ID:"+this.$session.get("repoID")
            this.$repo = {
              id: this.$session.get("repoID"),
              name: this.$session.get("repoName"),
            }
          }
          else{
          // if(this.selectedRepo==="Loading Repositories"){
            this.selectedRepo = repoListText[0]
            this.$session.set("repoID",this.getRepoID(repoListText[0]))
            this.$session.set("repoName",this.getRepoName(repoListText[0]))
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
        .finally(() => {
          this.loadingRepos = false
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
