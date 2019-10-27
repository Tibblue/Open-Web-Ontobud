<template>
  <v-row>
    <v-col cols="12">
      <v-btn block color="warning" @click="clearStatements($repo.id)">
        Clear Repo Statements
      </v-btn>
      <v-alert text dismissible type="success" :value="alertClearSuccess">
        {{ $repo.name }} was cleared with Success!
      </v-alert>
      <v-alert text dismissible type="error" :value="alertClearFail">
        Failed to clear {{ $repo.name }} ...
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import Vuex from 'vuex'
import axios from 'axios'
const rdf4j_url = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT

export default {
  data: () => ({
    alertClearSuccess: false,
    alertClearFail: false,
  }),
  computed: {
    $repo: {
      get: Vuex.mapState(['$repo']).$repo,
      set: Vuex.mapMutations(['update$repo']).update$repo,
    },
  },
  methods: {
    clearStatements(repoID) {
      axios.delete(rdf4j_url+'/rdf4j-server/repositories/'+repoID+'/statements')
        .then(response => {
          this.alertClearSuccess = true
          this.alertClearFail = false
        })
        .catch(alert => {
          this.alertClearFail = true
          this.alertClearSuccess = false
        })
    },
  },
};
</script>
