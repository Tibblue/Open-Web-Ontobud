<template>
  <v-row>
    <v-col cols="12">
      <v-btn :loading="loading.clear" block color="warning" @click="clearStatements($repo.id)">
        Clear Repo Statements
      </v-btn>
      <v-alert text dismissible type="success" v-model="alert.clearSuccess">
        {{ $repo.name }} was cleared with Success!
      </v-alert>
      <v-alert text dismissible type="error" v-model="alert.clearFail">
        Failed to clear {{ $repo.name }} ...
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import Vuex from 'vuex'
import axios from 'axios'

export default {
  data: () => ({
    loading: {
      clear: false,
    },
    alert: {
      clearSuccess: false,
      clearFail: false,
    },
  }),
  computed: {
    $repo: {
      get: Vuex.mapState(['$repo']).$repo,
      set: Vuex.mapMutations(['update$repo']).update$repo,
    },
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
    clearStatements(repoID) {
      this.loading.clear = true
      axios.delete(this.backend_url+'/api/rdf4j/management/delete/'+repoID+'/statements')
        .then(response => {
          this.alert.clearSuccess = true
          this.alert.clearFail = false
        })
        .catch(alert => {
          this.alert.clearFail = true
          this.alert.clearSuccess = false
        })
        .finally(() => {
          this.loading.clear = false
        })
    },
  },
};
</script>
