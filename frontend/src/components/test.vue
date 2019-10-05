<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-textarea readonly outlined auto-grow
          v-model="queryInput"
          rows="6"
          row-height="16"
          label="Query"
          placeholder="Place query and Execute"
        ></v-textarea>
        <v-btn color="primary" @click="runQuery(queryInput)">
          Run Query
        </v-btn>
        <v-textarea outlined auto-grow
          v-model="queryResponse"
          rows="4"
          row-height="16"
          label="Last query response"
          placeholder="Query response"
        ></v-textarea>
      </v-col>
      <v-col cols="6">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="newRepoID"
              label="New Repo ID"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="newRepoName"
              label="New Repo Name"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-btn color="primary" @click="newRepo(newRepoID, newRepoName)" class="mx-3">
              Create Repo
            </v-btn>
          </v-col>
          <v-col cols="8">
            <v-text-field readonly outlined
              v-model="newRepoResponse"
              label="Response"
              placeholder="Response to the request"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-divider class="my-2"></v-divider>
        <v-row>
          <v-col cols="12" px-2>
            <v-text-field
              v-model="deleteRepoID"
              label="Repo ID"
            ></v-text-field>
          </v-col>
          <v-row>
            <v-btn color="warning" @click="deleteRepo(deleteRepoID)">
              Delete Repo
            </v-btn>
            <v-text-field
              readonly
              v-model="deleteRepoResponse"
              label="Response"
              placeholder="Response to the request"
              outlined
            ></v-text-field>
          </v-row>
        </v-row>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
  import axios from 'axios'
  const rdf4j_port = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT

  export default {
    data: () => ({
      selectedRepo: "Loading Repositories",
      repoSearch: "",
      repoList: undefined,
      queryInput: "",
      queryResponse: "",
      newRepoID: "",
      newRepoName: "",
      newRepoResponse: "",
      deleteRepoID: "",
      deleteRepoResponse: "",
    }),
    mounted: async function (){
      // try{
      //   // var response = await axios.get(rdf4j_port+'/rdf4j-server/repositories');
      //   // this.top5 = response.data.results.bindings
      // }
      // catch(e){
      //   this.repoList = "PEDIDO FALHOU!!! " + alert
      // }
    },
    methods: {
      replaceURL(repo) {
        this.$router.replace({ query: { repo: repo } })
      },
      getRepositories: function () {
        axios.get(rdf4j_port+'/rdf4j-server/repositories')
          .then(response => {
            // this.alert = response.data // debug
            // console.log(response.data.head)

            var repoList = response.data.results.bindings
            console.log(response.data.results.bindings)
            var repoListText = []
            repoList.forEach(elem => {
              repoListText.push(elem.title.value)
            });
            // console.log(response.data) // debug
            this.repoList = repoListText
          })
          .catch(alert => {
            // this.alert = error // debug
            this.selectedRepo = "No Repositories available"
            // this.repoList = "PEDIDO FALHOU!!! " + alert
          })
      },
      newRepo: function (repoID, repoName) {
        const formData = new FormData();
        formData.append('type', "memory");
        formData.append('Repository ID', repoID);
        formData.append('Repository title', repoName);

        axios.post(rdf4j_port+'/rdf4j-workbench/repositories/NONE/create', formData)
          .then(response => {
            // console.log(response.data)
            this.newRepoResponse = "Created " + repoName + " with SUCCESS \n" + response.data
          })
          .catch(alert => {
            this.newRepoResponse = "Criação FALHOU!!!\n" + alert
          })
      },
      deleteRepo: function (repoID) {
        axios.delete(rdf4j_port+'/rdf4j-server/repositories/'+repoID)
          .then(response => {
            this.deleteRepoResponse = "Deleted " + repoID + " with SUCCESS" + response.data
          })
          .catch(alert => {
            this.deleteRepoResponse = "Remoção FALHOU!!! " + alert
          })
      },
      runQuery: function (query) {
        var queryEncoded = encodeURIComponent(query)
        axios.get(rdf4j_port+'/rdf4j-server/repositories/anime?query='+queryEncoded)
          .then(response => {
            console.log(response.data)
            var columnsVars = response.data.head.vars
            var resultsData = response.data.results.bindings
            resultsData = resultsData.slice(0,100)
            this.queryResponse = "Query SUCCESS \n" + columnsVars + "\n" + resultsData
          })
          .catch(alert => {
            this.queryResponse = "Query FALHOU!!!\n" + alert
          })
        // axios.post(rdf4j_port+'/rdf4j-server/repositories/anime', query,
        //   {headers: {"Content-Type": "application/sparql-query"}})
        //   .then(response => {
        //     console.log(response.data)
        //     var columnsVars = response.data.head.vars
        //     var resultsData = response.data.results.bindings
        //     this.queryResponse = "Query SUCCESS \n" + columnsVars + "\n" + resultsData
        //   })
        //   .catch(alert => {
        //     this.queryResponse = "Query FALHOU!!!\n" + alert
        //   })
      },
      // simplifyRepos: function (repo) {
      //   return {
      //     id: repo.id.value,
      //     title: repo.title.value
      //   }
      // }
    }
  }
</script>

<style>

</style>
