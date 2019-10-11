<template>
  <v-container>
        <div class="text-center">
          <v-btn color="info" @click="snackbarDEBUG=true">
            Confirm current repo (DEBUG)
          </v-btn>
          <v-snackbar top v-model="snackbarDEBUG">
            {{ this.$session.get("repoName") }} - {{ this.$session.get("repoID") }}
            <v-btn @click="snackbarDEBUG=false">Close</v-btn>
          </v-snackbar>
        </div>
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
      </v-col>
      <v-col cols="6">
        <v-row>
          <v-row>
            <v-col cols="12" px-2>
              <v-text-field
                v-model="deleteRepoID"
                label="Repo ID"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-btn color="warning" @click="deleteRepo(deleteRepoID)">
                Delete Repo
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-text-field
                readonly
                v-model="deleteRepoResponse"
                label="Response"
                placeholder="Response to the request"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider class="ma-2"></v-divider>
          <v-col cols="12">
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
            <v-alert text dismissible type="success" :value="alertDeleteSuccess">
              {{ this.$session.get("repoName") }} was deleted with Success!!!
            </v-alert>
            <v-alert text dismissible type="error" :value="alertDeleteFail">
              Failed to delete {{ this.$session.get("repoName") }} ...
            </v-alert>
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
  data: () => ({
    selectedRepo: "Loading Repositories",
    repoSearch: "",
    repoList: undefined,
    newRepoID: "",
    newRepoName: "",
    newRepoResponse: "",
    deleteRepoID: "",
    deleteRepoResponse: "",
    deleteRepoIDConfirm: "",
    snackbarDEBUG: false,
    disableDialogConfirmDelete: true,
    alertDeleteSuccess: false,
    alertDeleteFail: false,
    dialogDeleteRepo: false,
  }),
  // mounted: async function (){
  //   console.log(this.$props)
  //   console.log(process.env)
  // },
  methods: {
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
    deleteRepo(repoID) {
      axios.delete(rdf4j_url+'/rdf4j-server/repositories/'+repoID)
        .then(response => {
          this.deleteRepoResponse = "Deleted " + repoID + " with SUCCESS" + response.data
        })
        .catch(alert => {
          this.deleteRepoResponse = "Remoção FALHOU!!! " + alert
        })
    },
    deleteCurrentRepo(repoID) {
      axios.delete(rdf4j_url+'/rdf4j-server/repositories/'+repoID)
        .then(response => {
          this.alertDeleteSuccess = true
          this.alertDeleteFail = false
        })
        .catch(alert => {
          this.alertDeleteFail = true
          this.alertDeleteSuccess = false
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
