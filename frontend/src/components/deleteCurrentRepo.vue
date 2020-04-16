<template>
  <v-row>
    <v-col cols="12">
      <!-- <span>wow {{this.$session.get('repoID')}}</span> -->
      <v-dialog v-model="dialogDeleteRepo" max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn block color="warning" v-on="on">
            Delete Current Repo
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">
              Please type the repository name below
            </span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="deleteRepoIDConfirm"
              :rules="[deleteConfirm]"
              label="Type Repository Name"
              :placeholder="this.$session.get('repoID')"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-col class="grow">
              <v-btn block color="success"
                :disabled="disableDialogConfirmDelete"
                @click="deleteCurrentRepo(deleteRepoIDConfirm);dialogDeleteRepo=false"
              >
                Confirm
              </v-btn>
            </v-col>
            <v-col class="grow">
              <v-btn block color="error" @click="dialogDeleteRepo=false">
                Cancel
              </v-btn>
            </v-col>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-alert text dismissible type="success" v-model="alert.deleteSuccess">
        {{ this.$session.get("repoName") }} was deleted with Success!!!
      </v-alert>
      <v-alert text dismissible type="error" v-model="alert.deleteFail">
        Failed to delete {{ this.$session.get("repoName") }} ...
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import Vuex from 'vuex'
import axios from 'axios'

export default {
  data: () => ({
    deleteRepoIDConfirm: "",
    disableDialogConfirmDelete: true,
    alert: {
      deleteSuccess: false,
      deleteFail: false,
    },
    dialogDeleteRepo: false,
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
    deleteCurrentRepo(repoID) {
      axios.delete(this.backend_url+'/api/rdf4j/management/delete/'+repoID)
        .then(response => {
          this.alert.deleteSuccess = true
          this.alert.deleteFail = false
          this.$session.remove("repoID")
          this.$session.remove("repoName")
          this.$router.go(0)
        })
        .catch(alert => {
          this.alert.deleteFail = true
          this.alert.deleteSuccess = false
        })
    },
    deleteConfirm(value) {
      if(value===this.$session.get("repoID")){
        this.disableDialogConfirmDelete=false
        return true
      }
      else {
        this.disableDialogConfirmDelete=true
        return 'ID must be the same'
      }
    },
  },
};
</script>
