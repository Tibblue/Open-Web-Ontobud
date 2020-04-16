<template>
  <v-row>
    <v-col cols="12">
      <v-radio-group hide-details
        v-model="repoTypeSelected"
        class="ma-0 pa-0"
      >
        <div v-for="option in repoTypes" :key="option.value">
          <v-row class="px-3">
            <v-radio
              :label="option.text"
              :value="option.value"
              color="primary"
            ></v-radio>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" class="px-1">
                  <v-icon>mdi-help-circle-outline</v-icon>
                </div>
              </template>
              <span>{{option.tooltip}}</span>
            </v-tooltip>
          </v-row>
        </div>
        <!-- <v-radio
          v-for="option in repoTypes"
          :key="option.value"
          :label="option.text"
          :value="option.value"
          color="info"
        ></v-radio> -->
      </v-radio-group>
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
import Vuex from 'vuex'
import axios from 'axios'
const qs = require('querystring')

export default {
  data: () => ({
    newRepoID: "",
    newRepoName: "",
    repoTypeSelected: 'native',
    repoTypes: [ // TODO: add more
      { text: 'Hard Drive Store', value: 'native', tooltip: 'Hard drive memory is slightly slower'},
      { text: 'Hard Drive Store + Inference', value: 'native-rdfs-dt', tooltip: 'Inference includes RDFS and Direct Type Reasoning'},
      { text: 'Memory Store', value: 'memory', tooltip: 'RAM Memory is faster, but limited'},
      { text: 'Memory Store + Inference', value: 'memory-rdfs-dt', tooltip: 'Inference includes RDFS and Direct Type Reasoning'},
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
    newRepo(repoID, repoName, repoType) {
      this.loading.createRepo = true
      axios.get(this.backend_url+'/api/rdf4j/management/listRepos')
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
            form['Repository Title'] = repoName
            axios.put(this.backend_url+'/api/rdf4j/management/create', qs.stringify(form),
              {headers: {"Content-Type": 'application/x-www-form-urlencoded'}}
            )
              .then(response => {
                this.alert.createRepoSuccess = true
                this.alert.createRepoAlreadyExists = false
                this.alert.createRepoFail = false
                this.repoChange(repoID, repoName)
                // this.$emit('updateRepos',repoID) // NOTE: isto funcionou
                this.$router.go(0) // FIXME: reload enquanto nao atualizo só a repoList
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
          // this.$router.go()
        })
    },
    repoChange(id, name) {
      this.$repo = {id: id, name: name}
      this.$session.set("repoID",id)
      this.$session.set("repoName",name)
      this.$router.go(0)
    },
  },
};
</script>
