<template>
  <v-col class="pa-0">
    <v-row>
      <v-col cols="12">
        <v-btn block color="primary" @click="savedQueriesExpand=!savedQueriesExpand">
          <div v-if="savedQueriesExpand==true">
            <span>Hide Saved Queries</span>
            <v-icon right>fas fa-chevron-up</v-icon>
          </div>
          <div v-else>
            <span>Show Saved Queries</span>
            <v-icon right>fas fa-chevron-down</v-icon>
          </div>
        </v-btn>
      </v-col>
    </v-row>
    <v-expand-transition>
      <v-card flat color="transparent" class="mb-2"
        v-show="savedQueriesExpand"
      >
        <v-container fluid class="pa-0">
          <v-row dense>
            <v-col cols="6"
              v-for="savedQuery in savedQueries"
              :key="savedQuery.name"
            >
              <v-card flat>
                <v-card-title
                  class="fill-height align-end"
                  v-text="savedQuery.name"
                ></v-card-title>
                <!-- <v-card-text
                  class="fill-height align-end"
                  v-text="savedQuery.name"
                ></v-card-text> -->
                <v-card-actions>
                  <v-btn icon @click="runQuery(savedQuery.query)">
                    <v-icon>fas fa-play</v-icon>
                  </v-btn>
                  <v-dialog v-model="dialogEditQuery" max-width="600px">
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on"
                        :loading="loading.queryEditSave"
                        @click="savedQueryEdit(savedQuery.name,savedQuery.query)"
                      >
                        <v-icon>fas fa-edit</v-icon>
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">
                          {{editing.queryName}}
                        </span>
                      </v-card-title>
                      <v-card-text>
                        <pre>{{editing.queryNewValue}}
                        </pre>
                        <v-textarea outlined auto-grow hide-details
                          v-model="editing.queryNewValue"
                          rows="6"
                          row-height="16"
                          label="Edited Query"
                        ></v-textarea>
                      </v-card-text>
                      <v-card-actions>
                        <v-col class="grow">
                          <v-btn block color="success"
                            @click="savedQueryEditSave(editing.queryName,editing.queryNewValue);dialogEditQuery=false"
                          >
                            Save
                          </v-btn>
                        </v-col>
                        <v-col class="grow">
                          <v-btn block color="error" @click="dialogEditQuery=false">
                            Cancel
                          </v-btn>
                        </v-col>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn icon color="primary" dark v-on="on">
                        <v-icon>fas fa-info</v-icon>
                      </v-btn>
                    </template>
                    <span>{{savedQuery.query}}</span>
                  </v-tooltip>
                  <v-tooltip bottom v-if="savedQuery.global">
                    <template v-slot:activator="{ on }">
                      <v-btn icon color="primary" dark v-on="on">
                        <v-icon>fas fa-globe</v-icon>
                      </v-btn>
                    </template>
                    <span>User global query</span>
                  </v-tooltip>
                  <div class="flex-grow-1"></div>
                  <v-menu left>
                    <template v-slot:activator="{ on }">
                      <v-btn fab x-small depressed dark v-on="on" color="red"
                        :loading="loading.queryDelete"
                      >
                        <v-icon>fas fa-trash</v-icon>
                      </v-btn>
                    </template>
                    <v-btn color="error" @click="deleteSavedQuery(savedQuery.name, savedQuery.global)">
                      Confirm
                    </v-btn>
                  </v-menu>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-expand-transition>
    <v-alert text dismissible type="error" v-model="alert.queryEditFail">
      Failed to save query changes ...
    </v-alert>
    <v-alert text dismissible type="error" v-model="alert.queryDeleteFail">
      Failed to Delete query ...
    </v-alert>
  </v-col>
</template>

<script>
import Vuex from 'vuex'
import axios from 'axios'
// const rdf4j_url = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT
const backend_url = "http://"+process.env.VUE_APP_BACKEND_HOST+":"+process.env.VUE_APP_BACKEND_PORT

export default {
  data: () => ({
    newSavedQueryName: "",
    newSavedQueryGlobal: true,
    savedQueriesExpand: true,
    savedQueriesGlobal: [],
    savedQueriesRepo: [],
    // savedQueries: [ // temporary visual debug
    //   { name: 'Select All', query: 'select * where { ?s ?p ?o } limit 20' },
    //   { name: 'Get classes', query: 'SELECT DISTINCT ?type WHERE { ?class a ?type. }' },
    //   { name: 'Get classes only', query: 'SELECT DISTINCT ?class WHERE { ?class a owl:Class. }' },
    //   { name: 'Get #classes', query: 'SELECT (count(distinct ?class) as ?numberClasses) WHERE { ?class a owl:Class. }' },
    //   { name: 'Get #elements per class', query: 'SELECT ?class (COUNT(?class) as ?count) WHERE { ?elem a ?class. ?class a owl:Class. } GROUP BY ?class' },
    // ],
    dialogEditQuery: false,
    editing: {
      queryName: "",
      queryNewValue: "",
    },
    alert: {
      queryEditFail: false,
      queryDeleteFail: false,
    },
    loading: {
      queryEditSave: false,
      queryDelete: false,
    },
  }),
  mounted: async function (){
    // console.log(process.env) // debug
    if(this.$session.get('userToken')){
      var currentUserEmail = this.$session.get("userEmail") // email from session
      var currentRepo = this.$repo.id
      this.getSavedQueriesGlobal(currentUserEmail)
      this.getSavedQueriesRepo(currentUserEmail,currentRepo)
    }
  },
  computed: {
    $repo: {
      get: Vuex.mapState(['$repo']).$repo,
      set: Vuex.mapMutations(['update$repo']).update$repo,
    },
    savedQueries: function() {
      return this.savedQueriesGlobal.concat(this.savedQueriesRepo)
    }
  },
  methods: {
    getSavedQueriesGlobal(currentUserEmail) {
      this.savedQueriesGlobal = [{'name': 'Loading Global Queries...', 'query': 'Please wait', 'global': true}]
      var url = backend_url+'/api/queries/user/'+currentUserEmail+'/global'
      axios.get(url)
        .then(response => {
          // console.log(response.data) // debug
          var savedQueriesArray = []
          var savedQueriesAux = response.data
          savedQueriesAux.forEach(element => {
            savedQueriesArray.push({'name': element.name, 'query': element.query, 'global': true})
          });
          this.savedQueriesGlobal = savedQueriesArray
        })
        .catch(alert => {
          this.savedQueriesGlobal = [{'name': "Get Repo Queries FAIL!!!", 'query': alert, 'global': true}]
        })
    },
    getSavedQueriesRepo(currentUserEmail, currentRepo) {
      this.savedQueriesRepo = [{'name': 'Loading Repo Queries...', 'query': 'Please wait', 'global': false}]
      var url = backend_url+'/api/queries/user/'+currentUserEmail+'/'+currentRepo
      axios.get(url)
        .then(response => {
          // console.log(response.data) // debug
          var savedQueriesArray = []
          var savedQueriesAux = response.data
          savedQueriesAux.forEach(element => {
            savedQueriesArray.push({'name': element.name, 'query': element.query, 'global': false})
          });
          this.savedQueriesRepo = savedQueriesArray
        })
        .catch(alert => {
          this.savedQueriesRepo = [{'name': "Get Repo Queries FAIL!!!", 'query': alert, 'global': false}]
        })
    },
    runQuery(query) {
      this.$emit('runQuery', query, true)
    },
    savedQueryEdit(queryName,oldQuery) {
      this.editing.queryName = queryName
      this.editing.queryNewValue = oldQuery
    },
    savedQueryEditSave(queryName,newQuery) {
      this.loading.queryEditSave = true
      const user_email = this.$session.get("userEmail")
      const url = backend_url+'/api/queries/'+user_email+'/'+queryName
      const body = {'query': newQuery}
      axios.put(url, body)
        .then(response => {
          // console.log(response.data) // debug
          for (let index = 0; index < this.savedQueries.length; index++) {
            if(this.savedQueries[index].name===queryName){
              this.savedQueries[index].query = newQuery
              this.loading.queryEditSave = false
              return
            }
          }
        })
        .catch(alert => {
          // console.log(alert) // debug
          this.loading.queryEditSave = false
          this.alert.queryEditFail = true
        })
    },
    deleteSavedQuery(name, global) {
      this.loading.queryDelete = true
      const user_email = this.$session.get("userEmail")
      const url = backend_url+'/api/queries/'+user_email+'/'+name
      axios.delete(url)
        .then(response => {
          // console.log(response.data) // debug
          for (let index = 0; index < this.savedQueries.length; index++) {
            if(global){
              if(this.savedQueriesGlobal[index].name===name){
                this.savedQueriesGlobal.splice(index,1)
                this.loading.queryDelete = false
                return index
              }
            }
            else{
              if(this.savedQueriesRepo[index].name===name){
                this.savedQueriesRepo.splice(index,1)
                this.loading.queryDelete = false
                return index
              }
            }
          }
        })
        .catch(alert => {
          this.loading.queryDelete = false
          this.alert.queryDeleteFail = true
          // FIXME: detetar qd falha pk ja existe
        })
    },
  }
};
</script>
