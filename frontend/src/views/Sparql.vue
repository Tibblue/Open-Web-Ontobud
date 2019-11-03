<template>
  <v-container>
    <v-row>
      <v-col>
        <savedQueries @runQuery="runQuery"/>
        <!-- <v-divider></v-divider> -->
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
            <v-alert text dismissible type="error" v-model="alert.queryFail">
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
const rdf4j_url = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT
const backend_url = "http://localhost:"+process.env.VUE_APP_BACKEND_PORT

export default {
  components: {
    savedQueries,
  },
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
    // this.getSavedQueries(currentUserEmail)
  },
  computed: {
    $repo: {
      get: Vuex.mapState(['$repo']).$repo,
      set: Vuex.mapMutations(['update$repo']).update$repo,
    },
  },
  methods: {
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

      var url = backend_url+'/api/queries'
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
    deleteSavedQuery(name) {
      this.loading.queryDelete = true
      const user_email = "kiko@kiko" // FIXME: use loged user
      const url = backend_url+'/api/queries/'+user_email+'/'+name
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
