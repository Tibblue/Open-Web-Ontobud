<template>
  <v-container>
        <div class="text-center">
          <v-btn color="info" @click="snackbar=true">
            Confirm current repo (DEBUG)
          </v-btn>
          <v-snackbar top v-model="snackbar">
            {{ this.$session.get("repoName") }} - {{ this.$session.get("repoID") }}
            <v-btn color="blue" text @click="snackbar=false">
              Close
            </v-btn>
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
          <v-divider class="ma-2"></v-divider>
          <v-col cols="12">
            <v-dialog v-model="dialogDeleteRepo" max-width="600px">
              <template v-slot:activator="{ on }">
                <v-btn block color="warning" dark v-on="on">
                  Delete Repo
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
                    label="Type Repository Name"
                    :placeholder="this.$session.get('repoName')"
                  ></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-col class="grow">
                    <v-btn block color="success" @click="deleteRepo(deleteRepoID);dialogDeleteRepo=false">
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
      deleteRepoIDConfirm: "",
      snackbar: false,
      deleteRepoConfirm: false,
      dialogDeleteRepo: false,
    }),
    // mounted: async function (){
    //   console.log(this.$props)
    //   console.log(process.env)
    // },
    methods: {
      // replaceURL(repo) {
      //   this.$router.replace({ query: { repo: repo } })
      // },
      newRepo: function (repoID, repoName) {
        const formData = new FormData();
        formData.append('type', "memory");
        formData.append('Repository ID', repoID);
        formData.append('Repository title', repoName);

        axios.post(rdf4j_url+'/rdf4j-workbench/repositories/NONE/create', formData)
          .then(response => {
            // console.log(response.data)
            this.newRepoResponse = "Created " + repoName + " with SUCCESS \n" + response.data
            this.$emit('updateRepos',repoID) // NOTE: isto funcionou
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
