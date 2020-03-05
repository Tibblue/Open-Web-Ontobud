<template>
  <v-container>
    <alerts/>
    <v-row>
      <v-col>
        <v-row dense v-if="!this.$session.get('userToken')">
          <v-col cols="12" md="12">
            <v-alert text dismissible type="warning" >
              Viewing Saved queries requires Account Login
            </v-alert>
          </v-col>
        </v-row>
        <v-row dense v-else>
          <v-col cols="12" md="12">
            <savedQueries ref="savedQueriesComp" @runQuery="runQuery"/>
          </v-col>
        </v-row>

        <!-- <v-row dense>
          <v-col cols="12" md="6">
            <v-btn block color="primary" @click="goToDefaultGraph()">
              Default Graph
            </v-btn>
          </v-col>
        </v-row> -->

        <v-row dense>
          <v-col cols="12">
            <v-textarea outlined auto-grow hide-details
              v-model="queryInput"
              rows="6"
              row-height="16"
              label="Query"
              placeholder="Place query and Run"
            ></v-textarea>
          </v-col>
          <v-col cols="3" lg="2">
            <v-checkbox hide-details class="mt-0 pt-2"
              v-model="infer"
              label="Inferencing"
              color="primary"
            ></v-checkbox>
          </v-col>
          <v-col cols="9" lg="10">
            <v-btn :loading="loading.query" block color="primary" @click="runQuery(queryInput,infer)">
              Run Query
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-alert text dismissible type="error" v-model="alert.queryFail">
              Run Query Failed ...
            </v-alert>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12" md="6">
            <v-btn block color="primary" @click="goToDefaultGraph()">
              Default Graph
            </v-btn>
          </v-col>
        </v-row>

        <v-row dense v-if="!this.$session.get('userToken')">
          <v-col cols="12" md="12">
            <v-alert text dismissible type="warning" >
              Saving queries requires Account Login
            </v-alert>
          </v-col>
        </v-row>
        <v-row dense v-else>
          <v-col cols="3" lg="2">
            <v-checkbox hide-details class="mt-0 pt-2"
              v-model="newSavedQueryGlobal"
              label="Global"
              color="primary"
            ></v-checkbox>
          </v-col>
          <v-col cols="9" lg="10">
            <v-text-field dense hide-details
              class="mt-0 py-0"
              v-model="newSavedQueryName"
              label="Saved Query name"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12">
            <v-btn block color="primary"
              :loading="loading.querySave"
              @click="saveQuery(newSavedQueryName,queryInput,$session.get('userEmail'),newSavedQueryGlobal)"
            >
              Save Query
            </v-btn>
            <v-alert text dismissible type="error" v-model="alert.querySaveFail">
              Save query Failed ...
            </v-alert>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="6">
            <v-checkbox hide-details class="mt-0 pt-2"
              v-model="namespaceON"
              label="Show Namespace"
              color="primary"
            ></v-checkbox>
          </v-col>
          <v-col cols="6">
            <v-checkbox hide-details class="mt-0 pt-2"
              v-model="prefixON"
              label="Use Prefix"
              color="primary"
            ></v-checkbox>
          </v-col>
          <v-col cols="12">
            <!-- TODO:
                    -add search
                    -fix ordering
                    -customize data footer
                    -change items-per-page
             -->
            <v-data-table
              :headers="table.headers"
              :items="tableResults"
              :items-per-page="10"
              class="elevation-1"
            >
              <template v-slot:item="props">
                <tr>
                  <td class="subheading" @click="cellClicked(props.item[col.text])"
                    v-for="col in table.headers"
                    :key="col.text"
                  >
                    <span v-if="props.item[col.text].type==='uri'">
                      <u>{{props.item[col.text].value}}</u>
                    </span>
                    <span v-else>{{props.item[col.text].value}}</span>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import alerts from '@/components/alerts'
import savedQueries from '@/components/savedQueries'
import Vuex from 'vuex'
import axios from 'axios'
const qs = require('querystring')
const backend_url = "http://"+process.env.VUE_APP_BACKEND_HOST+":"+process.env.VUE_APP_BACKEND_PORT

export default {
  components: {
    alerts,
    savedQueries,
  },
  data: () => ({
    queryInput: "select * where { ?s ?p ?o }\nlimit 20",
    infer: true,
    table: {
      headers: [],
      items: [],
    },
    defaultNamespace: "",
    namespaces: {},
    namespaceON: true,
    prefixON: true,
    newSavedQueryName: "",
    newSavedQueryGlobal: true,
    savedQueriesExpand: true,
    savedQueries: [ // temporary visual debug
      { name: 'Select All', query: 'select * where { ?s ?p ?o } limit 200' },
      { name: 'Get classes', query: 'SELECT DISTINCT ?type WHERE { ?class a ?type. }' },
      { name: 'Get OWL classes only', query: 'SELECT DISTINCT ?class WHERE { ?class a owl:Class. }' },
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
    var currentRepoID = this.$session.get('repoID')
    this.getNamespaces(currentRepoID)
    this.getDefaultNamespace(currentRepoID)
  },
  computed: {
    $repo: {
      get: Vuex.mapState(['$repo']).$repo,
      set: Vuex.mapMutations(['update$repo']).update$repo,
    },
    tableResults: function() {
      var results = []
      this.table.items.forEach(element => {
        var elemAux = {}
        for(const key in element){
          if(this.namespaceON || element[key].type=='literal')
            if(this.prefixON && element[key].type!='literal'){
              var namespace = element[key].value.split('#')[0] + '#'
              var prefix = this.namespaces[namespace] || namespace
              var resource = element[key].value.split('#')[1] || ''
              elemAux[key] = {'value': prefix + resource, 'uri': element[key].value, 'type': element[key].type}
            }
            else
              elemAux[key] = {'value': element[key].value, 'uri': element[key].value, 'type': element[key].type}
          else
            elemAux[key] = {'value': element[key].value.split('#')[1], 'uri': element[key].value, 'type': element[key].type}
        }
        results.push(elemAux)
      });
      return results
    },
  },
  methods: {
    getNamespaces(repoID) {
      axios.get(backend_url+'/api/rdf4j/repository/'+repoID+'/namespaces')
        .then(response => {
          // puting results directly into this.namespaces usually results in a empty list
          var auxList = {} // for safety
          response.data.forEach(elem => {
            auxList[elem.namespace.value] = elem.prefix.value + ':'
          });
          this.namespaces = auxList
        })
        .catch(alert => {
          this.namespaces = {}
        })
    },
    getDefaultNamespace(repoID) {
      axios.get(backend_url+'/api/rdf4j/repository/'+repoID+'/namespaces/ /')
        .then(response => {
          this.defaultNamespace = "PREFIX : <"+response.data+">\n"
        })
        .catch(alert => {
          this.defaultNamespace = ""
        })
    },
    goToDefaultGraph() {
      const uri = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
      this.$router.push({path: "sparql/resource", query: { uri: uri, position: "predicate" }})
    },
    cellClicked(cellInfo) {
      if(cellInfo.type==='uri')
        this.$router.push({path: "sparql/resource", query: { uri: cellInfo.uri }})
    },
    runQuery(query, infer) {
      this.loading.query = true
      const defaultNamespaceExists = /^ *PREFIX : /m.test(query)
      if(!defaultNamespaceExists) query = this.defaultNamespace + query
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
              elemAux[key] = {
                'value': element[key].value,
                'type': element[key].type
              }
            }
            this.table.items.push(elemAux)
          });
          this.alert.queryFail = false
        })
        .catch(alert => {
          this.alert.queryFail = true
        })
        .finally(() => {
          this.loading.query = false
        })
    },
    saveQuery(name, query, userEmail, global) {
      this.loading.saveQuery = true
      var body = {
        'name': name,
        'query': query,
        'user_email': userEmail, // TODO: use user email when auth gets done
      }
      if(!global) body['repoID'] = this.$repo.id

      var url = backend_url+'/api/queries'
      axios.post(url, body)
        .then(response => {
          // console.log(response.data) // debug
          // console.log(this.$refs.savedQueriesComp) // debug to check child component variable
          if(global)
            this.$refs.savedQueriesComp.savedQueriesGlobal.push({'name': name, 'query': query, 'global': true})
          else
            this.$refs.savedQueriesComp.savedQueriesRepo.push({'name': name, 'query': query, 'global': false})

          this.alert.querySaveFail = false
        })
        .catch(alert => {
          this.alert.querySaveFail = true
          // FIXME: detetar qd falha pk ja existe
          // FIXME: devolver mais feedback de erro
        })
        .finally(() => {
          this.loading.saveQuery = false
        })
    },
  }
}
</script>
