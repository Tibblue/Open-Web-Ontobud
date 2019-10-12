<template>
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
</template>

<script>
import axios from 'axios'
const rdf4j_url = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT

export default {
  data: () => ({
    newRepoID: "",
    newRepoName: "",
    newRepoResponse: "",
  }),
  mounted: async function (){
    // console.log(process.env) # debug
    // this.getRepositories()
  },
  methods: {
    newRepo(repoID, repoName) {
      const formData = new FormData();
      formData.append('type', "memory");
      formData.append('Repository ID', repoID);
      formData.append('Repository title', repoName);

      axios.post(rdf4j_url+'/rdf4j-workbench/repositories/NONE/create', formData)
        .then(response => {
          // console.log(response.data)
          this.newRepoResponse = "Created " + repoName + " with SUCCESS \n" + response.data
          // this.$emit('updateRepos',repoID) // NOTE: isto funcionou
        })
        .catch(alert => {
          this.newRepoResponse = "Criação FALHOU!!!\n" + alert
        })
    },
  },
};
</script>
