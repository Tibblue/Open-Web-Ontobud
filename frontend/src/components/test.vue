<template>
  <v-container>
    <v-toolbar dark color="indigo darken-2" flat>
      <v-flex text-xs-center><h1>Temporary</h1></v-flex>
    </v-toolbar>


    <v-layout>
      <v-flex xs6 pa-2>
        <v-btn @click="runQuery()">
          Run Query
        </v-btn>
        <v-textarea
          v-model="text"
          outlined
          auto-grow
          rows="10"
          row-height="16"
          label="Last request response"
          placeholder="Run Query"
          hint="HINT: Run Query"
          :persistent-hint="false"
        ></v-textarea>
      </v-flex>

      <v-flex xs6 pa-2>
        <v-layout wrap>
          <v-btn @click="getRepositories()">
            Get Repositories
          </v-btn>
          <v-flex xs12 pa-2>
            <v-textarea
              readonly
              v-model="repoList"
              outlined
              auto-grow
              rows="2"
              row-height="16"
              label="Repositories List"
              placeholder="Run Get Repositories"
            ></v-textarea>
          </v-flex>
        </v-layout>
        <v-layout wrap>
          <v-layout>
            <v-btn @click="newRepo(newRepoID, newRepoName)">
              Create Repo
            </v-btn>
            <v-text-field
              readonly
              v-model="newRepoResponse"
              label="Response"
            ></v-text-field>
          </v-layout>
          <v-flex px-3>
            <v-text-field
              v-model="newRepoID"
              label="New Repo ID"
            ></v-text-field>
          </v-flex>
          <v-flex px-3>
            <v-text-field
              v-model="newRepoName"
              label="New Repo Name"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
  import axios from 'axios'
  const rdf4j_port = "http://localhost:8080"

  export default {
    data: () => ({
      text: "",
      repoList: "",
      newRepoID: "",
      newRepoName: "",
      newRepoResponse: "",
      deleteRepoID: "",
      deleteRepoResponse: "",
    }),
    mounted: async function (){
      // try{
      //   // // top5 list
      //   var response = await axios.get(rdf4j_port+'/rdf4j-server/repositories');
      //   this.top5 = response.data.results.bindings
      // }
      // catch(e){
      //   return(e);
      // }
    },
    methods: {
      cardClicked: function (id) {
        this.$router.push('/animes/'+id)
      },
      getRepositories: function () {
        axios.get(rdf4j_port+'/rdf4j-server/repositories')
          .then(response => {
            // this.alert = response.data // debug
            // console.log(response.data.head)

            var repoList = response.data.results.bindings
            var repoListText = "Lista de Repositorios: \n(ID: Name)\n"
            repoList.forEach(elem => {
              repoListText += elem.id.value + ": " + elem.title.value + "\n"
            });
            // console.log(response.data) // debug
            this.repoList = repoListText
          })
          .catch(alert => {
            // this.alert = error // debug
            this.repoList = "PEDIDO FALHOU!!! " + alert
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
            // this.alert = error // debug
            this.newRepoResponse = "Criação FALHOU!!!\n" + alert
          })
      },
      deleteRepo: function (repoID) {
        axios.delete(rdf4j_port+'/rdf4j-server/repositories/'+repoID)
          .then(response => {
            // console.log(response.data)
            this.deleteRepoResponse = "Deleted " + repoID + " with SUCCESS" + response.data
          })
          .catch(alert => {
            // this.alert = error // debug
            this.deleteRepoResponse = "Remoção FALHOU!!! " + alert
          })
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
