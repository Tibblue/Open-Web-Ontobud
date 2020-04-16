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
import Vuex from 'vuex'
import axios from 'axios'

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
  computed: {
    $backurl: {
      get: Vuex.mapState(['$backurl']).$backurl,
      set: Vuex.mapMutations(['update_backurl']).update_backurl,
    },
    backend_url: function() {
      var backend_url = "http://"+this.$backurl.host+":"+this.$backurl.port
      return backend_url
    },
  },
  methods: {
    deleteRepo(repoID) {
      this.loading.deleteRepo = true
      axios.delete(this.backend_url+'/api/rdf4j/management/delete/'+repoID)
        .then(response => {
          this.alert.deleteRepoSuccess = true
          this.alert.deleteRepoFail = false
          // this.$emit('updateRepos',repoID) // NOTE: isto funcionou
          if(repoID===this.$session.get("repoID")){
            this.$session.remove("repoID")
            this.$session.remove("repoName")
          }
          this.$router.go(0) // FIXME: reload enquanto nao atualizo só a repoList
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
