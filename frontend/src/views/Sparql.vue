<template>
  <v-container>
    <v-row>
      <v-col class="grow">
        <v-row>
          <v-col cols="12">
            <v-btn block color="primary" @click="savedQueriesExpand=!savedQueriesExpand">
              <div v-if="savedQueriesExpand==true">
                <span>Hide Saved Queries</span>
                <v-icon right>fas fa-chevron-right</v-icon>
              </div>
              <div v-else>
                <span>Show Saved Queries</span>
                <v-icon right>fas fa-chevron-left</v-icon>
              </div>
            </v-btn>
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
            <v-btn block color="primary" @click="saveQuery(newSavedQueryName,queryInput,newSavedQueryGlobal)">
              Save Query
            </v-btn>
          </v-col>
        </v-row>
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
      <v-expand-x-transition>
        <v-card flat color="transparent" class="ma-3"
          v-show="savedQueriesExpand"
          width="30%"
        >
          <v-container fluid class="pa-0">
            <v-row>
              <v-col cols="12">
                <v-card flat color="primary mb-3">
                  <v-card-title class="display-1 align-center justify-center pt-2">
                    Saved Queries
                  </v-card-title>
                </v-card>
                <v-card flat color="my-2"
                  v-for="savedQuery in savedQueries"
                  :key="savedQuery.name"
                >
                  <v-card-title
                    class="fill-height align-end"
                    v-text="savedQuery.name"
                  ></v-card-title>
                  <v-card-text v-if="savedQueryExpandedList.includes(savedQuery.name)">
                    <span v-if="!savedQueryEditedList[savedQuery.name]">{{savedQuery.query}}</span>
                    <v-textarea v-else outlined auto-grow hide-details
                      v-model="savedQueryEditedList[savedQuery.name]"
                      rows="6"
                      row-height="16"
                      label="Edited Query"
                    ></v-textarea>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn icon @click="savedQueryExpand(savedQuery.name)">
                      <v-icon left v-if="savedQueryExpandedList.includes(savedQuery.name)">fas fa-chevron-up</v-icon>
                      <v-icon left v-else>fas fa-chevron-down</v-icon>
                    </v-btn>
                    <div class="flex-grow-1"></div>
                    <v-btn icon @click="runQuery(savedQuery.query)">
                      <v-icon>fas fa-play</v-icon>
                    </v-btn>
                    <v-btn icon v-if="!savedQueryEditedList[savedQuery.name]" @click="savedQueryEdit(savedQuery.name,savedQuery.query)">
                      <v-icon>fas fa-edit</v-icon>
                    </v-btn>
                    <v-btn icon v-else @click="savedQueryEditSave(savedQuery.name,savedQueryEditedList[savedQuery.name])">
                      <v-icon>fas fa-save</v-icon>
                    </v-btn>
                    <v-btn icon @click="deleteSavedQuery(savedQuery.name)">
                      <v-icon>fas fa-trash</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-expand-x-transition>
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
    savedQueryExpandedList: [],
    savedQueryEditedList: {},
    alert: {
      queryFail: false,
    },
    loading: {
      query: false,
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
      // 'select * where { ?s ?p ?o } limit 20'
      const query = 'select * where { <'+cellInfo+'> ?p ?o }'
      // this.runQuery(query)
      this.$router.push({path: "sparql/resource", query: { uri: cellInfo }})
    },
    saveQuery(name, query, global) {
      var body = {
        'name': name,
        'query': query,
        'user_email': 'kiko@kiko', // TODO: use user email when auth gets done
      }
      if(!global)
        body['repoID'] = this.$repo.id

      var url = mongo_url+'/api/queries'
      axios.post(url, body)
        .then(response => {
          console.log(response.data) // debug
          var response = response.data
          this.queryResponse = "Query add SUCCESS \n" + JSON.stringify(response)
          this.savedQueries.push({'name': name, 'query': query,})
        })
        .catch(alert => {
          this.queryResponse = "Query add FAIL!!!\n" + alert
        })
    },
    savedQueryExpand(name) {
      if(this.savedQueryExpandedList.includes(name)){
        let index = this.savedQueryExpandedList.indexOf(name)
        this.savedQueryExpandedList.splice(index,1)
      }
      else
        this.savedQueryExpandedList.push(name)
    },
    savedQueryEdit(name,oldQuery) {
      this.savedQueryEditedList[name] = oldQuery
    },
    savedQueryEditSave(name,newQuery) {
      // TODO update no mongo
      for (let index = 0; index < this.savedQueries.length; index++) {
        if(this.savedQueries[index].name===name){
          this.savedQueries[index].query = newQuery
        }
      }
      delete this.savedQueryEditedList[name]
    },
    deleteSavedQuery(name) {
      // TODO: add dialog for confirmation
      var url = mongo_url+'/api/queries/'+name
      axios.delete(url)
        .then(response => {
          // console.log(response.data) // debug
          var response = response.data
          this.queryResponse = "Query delete SUCCESS \n" + JSON.stringify(response)
          for (let index = 0; index < this.savedQueries.length; index++) {
            if(this.savedQueries[index].name===name){
              this.savedQueries.splice(index,1)
              return index
            }
          }
        })
        .catch(alert => {
          this.queryResponse = "Query delete FAIL!!!\n" + alert
          // FIXME: detetar qd falha pk ja existe
        })
    },
  }
}
</script>
