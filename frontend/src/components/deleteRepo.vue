<template>
  <v-row>
    <v-col cols="12">
      <v-text-field hide-details class="mb-3 pt-0"
        v-model="deleteRepoID"
        label="Repo ID"
      ></v-text-field>
      <v-btn :loading="loading.deleteRepo" block color="warning" @click="deleteRepo(deleteRepoID)">
        Delete Repo
      </v-btn>
      <v-alert text dismissible type="success" v-model="alert.deleteRepoSuccess">
        Repo Delete Successful!!!
      </v-alert>
      <v-alert text dismissible type="error" v-model="alert.deleteRepoFail">
        Repo Delete Failed...
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
const backend_url = "http://"+process.env.VUE_APP_BACKEND_HOST+":"+process.env.VUE_APP_BACKEND_PORT

export default {
  data: () => ({
    // selectedRepo: "Loading Repositories",
    // repoList: undefined,
    deleteRepoID: "",
    deleteRepoResponse: "",
    alert: {
      deleteRepoSuccess: false,
      deleteRepoFail: false,
    },
    loading: {
      deleteRepo: false,
    },
  }),
  mounted: async function (){
    // console.log(process.env) # debug
    // this.getRepositories()
  },
  methods: {
    deleteRepo(repoID) {
      this.loading.deleteRepo = true
      axios.delete(backend_url+'/api/rdf4j/management/delete/'+repoID)
        .then(response => {
          this.alert.deleteRepoSuccess = true
          this.alert.deleteRepoFail = false
        })
        .catch(alert => {
          this.alert.deleteRepoSuccess = false
          this.alert.deleteRepoFail = true
        })
        .finally(() => {
          this.loading.deleteRepo = false
        })
    },
  },
};
</script>
