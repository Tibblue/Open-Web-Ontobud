<template>
  <v-container>
    <v-row>
      <v-col>
        <savedQueries ref="savedQueriesComp" @runQuery="runQuery"/>
        <!-- <v-divider></v-divider> -->
        <v-textarea outlined auto-grow hide-details
          v-model="queryInput"
          rows="6"
          row-height="16"
          label="Query"
          placeholder="Place query and Run"
        ></v-textarea>
        <v-row>
          <v-col cols="9">
            <v-btn :loading="loading.query" block color="primary" @click="runQuery(queryInput,infer)">
              Run Query
            </v-btn>
          </v-col>
          <v-col cols="3" md="3">
            <v-checkbox hide-details class="mt-0 pt-2"
              v-model="infer"
              label="Inferencing"
              color="primary"
            ></v-checkbox>
          </v-col>
        </v-row>
        <v-alert text dismissible type="error" v-model="alert.queryFail">
          Failed to Query {{ $repo.name }} ...
        </v-alert>
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
        <v-alert text dismissible type="error" v-model="alert.querySaveFail">
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
import savedQueries from '@/components/savedQueries'
import Vuex from 'vuex'
import axios from 'axios'
const qs = require('querystring')
const backend_url = "http://localhost:"+process.env.VUE_APP_BACKEND_PORT

export default {
  components: {
    savedQueries,
  },
  data: () => ({
    queryInput: "select * where { ?s ?p ?o }\nlimit 20",
    infer: true,
    table: {
      headers: [],
      items: [],
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
    alert: {
      queryFail: false,
      querySaveFail: false,
    },
    loading: {
      query: false,
      querySave: false,
    },
  }),
  mounted: async function (){
    // console.log(process.env) // debug
    // var currentUserEmail = 'kiko@kiko' // FIXME: use loged user
  },
  computed: {
    $repo: {
      get: Vuex.mapState(['$repo']).$repo,
      set: Vuex.mapMutations(['update$repo']).update$repo,
    },
  },
  methods: {
    runQuery(query, infer) {
      this.loading.query = true
      var repoID = this.$repo.id
      var url = backend_url+'/api/rdf4j/query/'+repoID
      axios.post(url, qs.stringify({'query': query, 'infer': infer}),
        {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
        .then(response => {
          // console.log(response.data) // debug
          // console.log(response.data.head.vars) // debug Nome de Colunas
          // console.log(response.data.results.bindings) // debug resultados
          var columnsVars = response.data.head.vars
          var resultsData = response.data.results.bindings
          // process results
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

      var url = backend_url+'/api/queries'
      axios.post(url, body)
        .then(response => {
          // console.log(response.data) // debug
          // console.log(this.$refs.savedQueriesComp) // debug to check child component variable
          this.$refs.savedQueriesComp.savedQueries.push({'name': name, 'query': query,})
          this.loading.saveQuery = false
        })
        .catch(alert => {
          this.loading.saveQuery = false
          this.alert.querySaveFail = true
          // FIXME: detetar qd falha pk ja existe
        })
    },
  }
}
</script>
