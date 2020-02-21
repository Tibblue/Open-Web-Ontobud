<template>
  <v-row>
    <v-col cols="12">
      <v-radio-group hide-details v-model="repoTypeSelected" class="ma-0 pa-0">
        <v-radio
          v-for="option in repoTypes"
          :key="option.value"
          :label="option.text"
          :value="option.value"
          color="info"
        ></v-radio>
      </v-radio-group>
      <!-- <v-combobox hide-details :return-object="false"
        v-model="repoTypeSelected"
        :items="repoTypes"
        label="Select the Repository Type"
      ></v-combobox> -->
    </v-col>
    <v-col cols="12">
      <v-text-field hide-details class="mt-0 mb-3 pt-0"
        v-model="newRepoID"
        label="New Repo ID"
      ></v-text-field>
      <v-text-field hide-details class="mt-0 mb-3 pt-0"
        v-model="newRepoName"
        label="New Repo Name"
      ></v-text-field>
      <v-btn :loading="loading.createRepo" block color="primary" @click="newRepo(newRepoID, newRepoName, repoTypeSelected)">
        Create Repo
      </v-btn>
      <v-alert text dismissible type="success" v-model="alert.createRepoSuccess">
        Repository create Successful!!! Created {{ newRepoName }}
      </v-alert>
      <v-alert text dismissible type="warning" v-model="alert.createRepoAlreadyExists">
        Repository {{ newRepoName }} already exists!
      </v-alert>
      <v-alert text dismissible type="error" v-model="alert.createRepoFail">
        Repository create Failed... Not Created {{ newRepoName }}
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
const qs = require('querystring')
const backend_url = "http://"+process.env.VUE_APP_URL+":"+process.env.VUE_APP_BACKEND_PORT

export default {
  data: () => ({
    newRepoID: "",
    newRepoName: "",
    repoTypeSelected: 'memory-rdfs-dt',
    repoTypes: [ // TODO: add more
      { text: 'Memory Store', value: 'memory' },
      { text: 'Memory Store + RDFS and Direct Type Reasoning', value: 'memory-rdfs-dt' },
      { text: 'Hard Drive Store', value: 'native' },
      { text: 'Hard Drive Store + RDFS and Direct Type Reasoning', value: 'native-rdfs-dt' },
    ],
    loading: {
      createRepo: false,
      deleteRepo: false,
    },
    alert: {
      createRepoSuccess: false,
      createRepoAlreadyExists: false,
      createRepoFail: false,
      deleteRepoSuccess: false,
      deleteRepoFail: false,
    },
  }),
  mounted: async function (){
    // console.log(process.env) # debug
    // this.getRepositories()
  },
  methods: {
    newRepo(repoID, repoName, repoType) {
      this.loading.createRepo = true
      axios.get(backend_url+'/api/rdf4j/management/listRepos')
        .then(response => {
          // console.log(response.data.head) // debug column names
          // console.log(response.data.results.bindings) // debug results
          var isNew = true
          var repoList = response.data
          repoList.forEach(elem => {
            if( repoID === elem.id.value){
              isNew = false
            }
          })
          if(isNew){
            var form = {}
            form['type'] = repoType
            form['Repository ID'] = repoID
            form['Repository title'] = repoName
            axios.post(backend_url+'/api/rdf4j/management/create', qs.stringify(form),
              {headers: {"Content-Type": 'application/x-www-form-urlencoded'}}
            )
              .then(response => {
                this.alert.createRepoSuccess = true
                this.alert.createRepoAlreadyExists = false
                this.alert.createRepoFail = false
                // this.$emit('updateRepos',repoID) // NOTE: isto funcionou
              })
              .catch(alert => {
                this.alert.createRepoSuccess = false
                this.alert.createRepoAlreadyExists = false
                this.alert.createRepoFail = true
              })
              // .finally(() => {
              //   this.loading.createRepo = false
              // })
          }
          else{
            this.alert.createRepoSuccess = false
            this.alert.createRepoAlreadyExists = true
            this.alert.createRepoFail = false
          }
        })
        .catch(alert => {
          this.alert.createRepoSuccess = false
          this.alert.createRepoAlreadyExists = false
          this.alert.createRepoFail = true
        })
        .finally(() => {
          this.loading.createRepo = false
        })
    },
  },
};
</script>
