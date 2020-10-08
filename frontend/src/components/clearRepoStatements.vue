<template>
  <v-row>
    <v-col cols="12">
      <v-dialog v-model="dialogClearRepo" max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn block color="error" v-on="on">
            Clear ALL Repository Statements
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h4">
              Confirm delete
            </span>
          </v-card-title>
          <v-card-text>
            <span class="text-body-1">
              Do you really wish to delete all repository statements?
            </span>
          </v-card-text>
          <v-card-actions>
            <v-col class="grow">
              <v-btn block color="success"
                @click="clearStatements($repo.id);dialogClearRepo=false"
              >
                Confirm
              </v-btn>
            </v-col>
            <v-col class="grow">
              <v-btn block color="error" @click="dialogClearRepo=false">
                Cancel
              </v-btn>
            </v-col>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
      clear: false
    },
    alert: {
      clearSuccess: false,
      clearFail: false
    },
    dialogClearRepo: false
  }),
  computed: {
    $repo: {
      get: Vuex.mapState(['$repo']).$repo,
      set: Vuex.mapMutations(['update$repo']).update$repo
    },
    $backurl: {
      get: Vuex.mapState(['$backurl']).$backurl,
      set: Vuex.mapMutations(['update_backurl']).update_backurl
    },
    backendURL: function () {
      var backendURL = 'http://' + this.$backurl.host + ':' + this.$backurl.port
      return backendURL
    }
  },
  methods: {
    clearStatements (repoID) {
      this.loading.clear = true
      axios.delete(this.backendURL + '/api/rdf4j/management/delete/' + repoID + '/statements')
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
    }
  }
}
</script>
