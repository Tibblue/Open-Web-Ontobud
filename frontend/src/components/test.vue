<template>
  <v-container>
        <!-- <v-btn color="primary" >
          {{this.$props}}
        </v-btn> -->
        <v-btn color="primary">
          {{this.$route.query}}
        </v-btn>
    <v-row>
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
          <v-col cols="3">
            <v-btn color="primary" @click="newRepo(newRepoID, newRepoName)">
              Create Repo
            </v-btn>
          </v-col>
          <v-col cols="9">
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
          <v-col cols="3">
            <v-btn color="warning" @click="deleteRepo(deleteRepoID)">
              Delete Repo
            </v-btn>
          </v-col>
          <v-col cols="9">
            <v-text-field
              readonly
              v-model="deleteRepoResponse"
              label="Response"
              placeholder="Response to the request"
              outlined
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
  import axios from 'axios'
  const rdf4j_url = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT

  export default {
    // props: ["repo"],
    data: () => ({
      selectedRepo: "Loading Repositories",
      repoSearch: "",
      repoList: undefined,
      newRepoID: "",
      newRepoName: "",
      newRepoResponse: "",
      deleteRepoID: "",
      deleteRepoResponse: "",
    }),
    mounted: async function (){
      // console.log(this.$props)
      // console.log(process.env)
      // try{
      //   // var response = await axios.get(rdf4j_url+'/rdf4j-server/repositories');
      //   // this.top5 = response.data.results.bindings
      // }
      // catch(e){
      //   this.repoList = "PEDIDO FALHOU!!! " + alert
      // }
    },
    methods: {
      replaceURL(repo) {
        // console.log(this.$route)
        // this.$router.replace('?repo='+repo)
        this.$router.replace({ query: { repo: repo } })
      },
      newRepo: function (repoID, repoName) {
        const formData = new FormData();
        formData.append('type', "memory");
        formData.append('Repository ID', repoID);
        formData.append('Repository title', repoName);

        axios.post(rdf4j_url+'/rdf4j-workbench/repositories/NONE/create', formData)
          .then(response => {
            // console.log(response.data)
            this.newRepoResponse = "Created " + repoName + " with SUCCESS \n" + response.data
          })
          .catch(alert => {
            this.newRepoResponse = "Criação FALHOU!!!\n" + alert
          })
      },
      deleteRepo: function (repoID) {
        axios.delete(rdf4j_url+'/rdf4j-server/repositories/'+repoID)
          .then(response => {
            this.deleteRepoResponse = "Deleted " + repoID + " with SUCCESS" + response.data
          })
          .catch(alert => {
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
