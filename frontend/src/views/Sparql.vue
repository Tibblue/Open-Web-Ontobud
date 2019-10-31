<template>
  <v-container>
    <v-row>
      <v-col class="grow">
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
          <v-card flat color="transparent" class="mb-4"
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
                      <div class="flex-grow-1"></div>
                      <v-btn icon
                        :loading="loading.queryDelete"
                        @click="deleteSavedQuery(savedQuery.name)"
                      >
                        <v-icon>fas fa-trash</v-icon>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-expand-transition>
        <v-alert text dismissible type="error" :value="alert.queryEditFail">
          Failed to save query changes ...
        </v-alert>
        <v-alert text dismissible type="error" :value="alert.queryDeleteFail">
          Failed to Delete query ...
        </v-alert>
        <v-textarea outlined auto-grow hide-details
          v-model="queryInput"
          rows="6"
          row-height="16"
          label="Query"
          placeholder="Place query and Run"
        ></v-textarea>
        <v-row>
          <v-col cols="12">
            <v-btn :loading="loading.query" block color="primary" @click="runQuery(queryInput)">
              Run Query
            </v-btn>
            <v-alert text dismissible type="error" :value="alert.queryFail">
              Failed to Query {{ $repo.name }} ...
            </v-alert>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="9" md="9">
            <v-text-field dense hide-details
              class="mt-0 py-0"
              v-model="newSavedQueryName"
              label="Saved Query name"
            ></v-text-field>
          </v-col>
          <v-col cols="3" md="3">
            <v-checkbox hide-details class="mt-0 pt-2"
              v-model="newSavedQueryGlobal"
              label="Global"
              color="primary"
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="12">
            <v-btn block color="primary"
              :loading="loading.querySave"
              @click="saveQuery(newSavedQueryName,queryInput,newSavedQueryGlobal)"
            >
              Save Query
            </v-btn>
          </v-col>
        </v-row>
        <v-alert text dismissible type="error" :value="alert.querySaveFail">
          Failed to Save query ...
        </v-alert>
        <v-data-table
          :headers="table.headers"
          :items="table.items"
          :items-per-page="10"
          class="elevation-1"
        >
          <template v-slot:item="props">
            <tr>
              <td class="subheading" @click="cellClicked(props.item[col.text])"
                v-for="col in table.headers"
                :key="col.text"
              >
                {{props.item[col.text]}}
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Vuex from 'vuex'
import axios from 'axios'
const rdf4j_url = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT
const mongo_url = "http://localhost:"+'5000' // FIXME use env

export default {
  data: () => ({
    queryInput: "select * where { ?s ?p ?o }\nlimit 20",
    queryResponse: "",
    table: {
      headers: [
        { text: 'column', value: 'column',
          align: 'left', sortable: false,
        },
      ],
      items: [{column: 'value'}],
    },
    newSavedQueryName: "",
    newSavedQueryGlobal: true,
    savedQueriesExpand: true,
    savedQueries: [ // temporary visual debug
      { name: 'Select All', query: 'select * where { ?s ?p ?o } limit 20' },
      { name: 'Get classes', query: 'SELECT DISTINCT ?type WHERE { ?class a ?type. }' },
      { name: 'Get classes only', query: 'SELECT DISTINCT ?class WHERE { ?class a owl:Class. }' },
      { name: 'Get #classes', query: 'SELECT (count(distinct ?class) as ?numberClasses) WHERE { ?class a owl:Class. }' },
      { name: 'Get #elements per class', query: 'SELECT ?class (COUNT(?class) as ?count) WHERE { ?elem a ?class. ?class a owl:Class. } GROUP BY ?class' },
    ],
    dialogEditQuery: false,
    editing: {
      queryName: "",
      queryNewValue: "",
    },
    alert: {
      queryFail: false,
      querySaveFail: false,
      queryEditFail: false,
      queryDeleteFail: false,
    },
    loading: {
      query: false,
      querySave: false,
      queryEditSave: false,
      queryDelete: false,
    },
  }),
  mounted: async function (){
    // console.log(process.env) // debug
    var currentUserEmail = 'kiko@kiko' // FIXME: use loged user
    this.getSavedQueries(currentUserEmail)
  },
  computed: {
    $repo: {
      get: Vuex.mapState(['$repo']).$repo,
      set: Vuex.mapMutations(['update$repo']).update$repo,
    },
  },
  methods: {
    getSavedQueries(currentUserEmail) {
      this.savedQueries = [{'name': 'Loading Queries...', 'query': 'Please wait'}]
      var url = mongo_url+'/api/queries/user/'+currentUserEmail
      axios.get(url)
        .then(response => {
          // console.log(response.data) // debug
          var savedQueriesArray = []
          var savedQueriesAux = response.data
          savedQueriesAux.forEach(element => {
            savedQueriesArray.push({'name': element.name, 'query': element.query})
          });
          this.savedQueries = savedQueriesArray
        })
        .catch(alert => {
          this.savedQueries = [{'name': "Get Classes FAIL!!!", 'query': alert}]
        })
    },
    runQuery(query) {
      this.loading.query = true
      var repoID = this.$repo.id
      var url = rdf4j_url+'/rdf4j-server/repositories/'+repoID
      axios.post(url, query,
        {headers: {"Content-Type": "application/sparql-query"}})
        .then(response => {
          // console.log(response.data) // debug
          // console.log(response.data.head.vars) // debug Nome de Colunas
          // console.log(response.data.results.bindings) // debug resultados
          var columnsVars = response.data.head.vars
          var resultsData = response.data.results.bindings
          // resultsData = resultsData.slice(0,10) // limit results
          // console.log(columnsVars) // debug
          // console.log(resultsData) // debug

          this.table.headers = []
          columnsVars.forEach(element => {
            this.table.headers.push({'text': element, 'value': element})
          });
          this.table.items = []
          resultsData.forEach(element => {
            var elemAux = {}
            for(const key in element){
              elemAux[key] = element[key].value
            }
            this.table.items.push(elemAux)
          });
        })
        .catch(alert => {
          this.alert.queryFail = true
        })
        .finally(() => {
          this.loading.query = false
        })
    },
    cellClicked(cellInfo) {
      this.$router.push({path: "sparql/resource", query: { uri: cellInfo }})
    },
    saveQuery(name, query, global) {
      this.loading.saveQuery = true
      var body = {
        'name': name,
        'query': query,
        'user_email': 'kiko@kiko', // TODO: use user email when auth gets done
      }
      if(!global) body['repoID'] = this.$repo.id

      var url = mongo_url+'/api/queries'
      axios.post(url, body)
        .then(response => {
          // console.log(response.data) // debug
          this.savedQueries.push({'name': name, 'query': query,})
          this.loading.saveQuery = false
        })
        .catch(alert => {
          this.loading.saveQuery = false
          this.alert.querySaveFail = true
          // FIXME: detetar qd falha pk ja existe
        })
    },
    savedQueryEdit(queryName,oldQuery) {
      this.editing.queryName = queryName
      this.editing.queryNewValue = oldQuery
    },
    savedQueryEditSave(queryName,newQuery) {
      this.loading.queryEditSave = true
      const user_email = "kiko@kiko" // FIXME: use loged user
      const url = mongo_url+'/api/queries/'+user_email+'/'+queryName
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
    deleteSavedQuery(name) {
      this.loading.queryDelete = true
      const user_email = "kiko@kiko" // FIXME: use loged user
      const url = mongo_url+'/api/queries/'+user_email+'/'+name
      axios.delete(url)
        .then(response => {
          // console.log(response.data) // debug
          for (let index = 0; index < this.savedQueries.length; index++) {
            if(this.savedQueries[index].name===name){
              this.savedQueries.splice(index,1)
              this.loading.queryDelete = false
              return index
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
}
</script>
