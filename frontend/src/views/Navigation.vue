<template>
  <v-container>
    <alerts/>
    <v-row>
      <v-col cols="12" lg="9" v-if="editing">
        <h2 class="wrap-text">Resource&nbsp;</h2>
        <v-textarea outlined dense hide-details
          auto-grow no-resize rows="1"
          v-model="resource"
        ></v-textarea>
        <h2 class="wrap-text">Namespace&nbsp;</h2>
        <v-textarea outlined dense hide-details
          auto-grow no-resize rows="1"
          v-model="namespace"
        ></v-textarea>
        <h3>URI&nbsp;</h3><p class="wrap-text ml-3 my-2">{{this.namespace}}#{{this.resource}}</p>
      </v-col>
      <v-col cols="12" lg="9" v-else>
        <h2>Resource&nbsp; </h2><p class="wrap-text ml-3 my-2">{{this.resource}}</p>
        <h2>Namespace&nbsp;</h2><p class="wrap-text ml-3 my-2">{{this.namespace}}</p>
        <h3>URI&nbsp;</h3><p class="wrap-text ml-3 my-2">{{this.namespace}}#{{this.resource}}</p>
      </v-col>
      <v-col cols="12" lg="3">
        <div v-if="!editing">
          <v-btn block color="primary" @click="editing=!editing">
            Edit URI
          </v-btn>
        </div>
        <v-row no-gutters v-else>
          <v-col cols="6">
            <v-btn block color="success" @click="editConfirm()">
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn block color="error" @click="editCancel()">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-checkbox hide-details class="mt-0 pt-2"
          v-model="namespaceON"
          label="Show Namespace"
          color="primary"
        ></v-checkbox>
        <v-checkbox hide-details class="mt-0 pt-2"
          v-model="prefixON"
          label="Use Prefix"
          color="primary"
        ></v-checkbox>
        <v-checkbox hide-details class="mt-0 pt-2"
          v-model="inferON"
          label="Inferencing"
          color="primary"
          @change="updateResults()"
        ></v-checkbox>
      </v-col>
      <v-col cols="12" md="12" class="py-0">
        <v-btn block color="primary" @click="goToResource()">
          Open Resource Table
        </v-btn>
      </v-col>
      <v-col cols="12" class="pb-0">
        <d3graph ref="d3graph"
          :elem="resourceTableURI"
          :results="graphResults"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import alerts from '@/components/alerts'
import d3graph from '@/components/d3graph'
import Vuex from 'vuex'
import axios from 'axios'
const qs = require('querystring')

export default {
  components: {
    alerts,
    d3graph
  },
  data: () => ({
    namespace: '',
    resource: '',
    editing: false,
    inferON: true,
    table: {
      headers: [
        { text: 'subject', value: 'subject', sortable: false },
        { text: 'predicate', value: 'predicate', sortable: false },
        { text: 'object', value: 'object', sortable: false }
      ],
      subjectResults: [],
      predicateResults: [],
      objectResults: []
    },
    activeTab: 0,
    namespaces: {},
    namespaceON: true,
    prefixON: true,
    loading: {
      subject: false,
      predicate: false,
      object: false
    },
    alert: {
      subjectFail: false,
      predicateFail: false,
      objectFail: false
    }
  }),
  mounted: async function () {
    this.getNamespaces(this.$session.get('repoID'))
    // this.updateResults()
    try {
      this.namespace = this.uri.split('#')[0]
      this.resource = this.uri.split('#')[1]
    } catch {}
    // switch (this.$route.query.position) {
    //   case 'subject':
    //     this.activeTab = 0
    //     break
    //   case 'predicate':
    //     this.activeTab = 1
    //     break
    //   case 'object':
    //     this.activeTab = 2
    //     break
    //   default:
    //     this.activeTab = 0
    //     break
    // }
  },
  computed: {
    $repo: {
      get: Vuex.mapState(['$repo']).$repo,
      set: Vuex.mapMutations(['update$repo']).update$repo
    },
    $backurl: {
      get: Vuex.mapState(['$backurl']).$backurl,
      set: Vuex.mapMutations(['update_backurl']).update_backurl
    },
    backendURL: function () {
      var backendURL = 'http://' + this.$backurl.host + ':' + this.$backurl.port
      return backendURL
    },
    uri: function () {
      // this update is making graph update twice. IDK WHY
      this.updateResults()
      return this.$route.query.uri || ''
    },
    resourceTableURI: function () {
      // usar this.uri aqui faz milagres. sei vagamente pk mas...
      if (this.namespaceON) {
        if (this.prefixON) {
          var namespace = this.uri.split('#')[0] + '#'
          var prefix = this.namespaces[namespace] || namespace
          var resource = this.uri.split('#')[1] || ''
          return prefix + resource
        } else { return this.uri }
      } else { return this.uri.split('#')[1] }
    },
    subjectResults: function () {
      var results = []
      this.table.subjectResults.forEach(element => {
        var elemAux = {}
        for (const key in element) {
          if (this.namespaceON || element[key].type === 'literal') {
            if (this.prefixON && element[key].type !== 'literal') {
              var namespace = element[key].value.split('#')[0] + '#'
              var prefix = this.namespaces[namespace] || namespace
              var resource = element[key].value.split('#')[1] || ''
              elemAux[key] = { value: prefix + resource, uri: element[key].value, type: element[key].type }
            } else { elemAux[key] = { value: element[key].value, uri: element[key].value, type: element[key].type } }
          } else { elemAux[key] = { value: element[key].value.split('#')[1], uri: element[key].value, type: element[key].type } }
        }
        results.push(elemAux)
      })
      return results
    },
    predicateResults: function () {
      var results = []
      this.table.predicateResults.forEach(element => {
        var elemAux = {}
        for (const key in element) {
          if (this.namespaceON || element[key].type === 'literal') {
            if (this.prefixON && element[key].type !== 'literal') {
              var namespace = element[key].value.split('#')[0] + '#'
              var prefix = this.namespaces[namespace] || namespace
              var resource = element[key].value.split('#')[1] || ''
              elemAux[key] = { value: prefix + resource, uri: element[key].value, type: element[key].type }
            } else { elemAux[key] = { value: element[key].value, uri: element[key].value, type: element[key].type } }
          } else { elemAux[key] = { value: element[key].value.split('#')[1], uri: element[key].value, type: element[key].type } }
        }
        results.push(elemAux)
      })
      return results
    },
    objectResults: function () {
      var results = []
      this.table.objectResults.forEach(element => {
        var elemAux = {}
        for (const key in element) {
          if (this.namespaceON || element[key].type === 'literal') {
            if (this.prefixON && element[key].type !== 'literal') {
              var namespace = element[key].value.split('#')[0] + '#'
              var prefix = this.namespaces[namespace] || namespace
              var resource = element[key].value.split('#')[1] || ''
              elemAux[key] = { value: prefix + resource, uri: element[key].value, type: element[key].type }
            } else { elemAux[key] = { value: element[key].value, uri: element[key].value, type: element[key].type } }
          } else { elemAux[key] = { value: element[key].value.split('#')[1], uri: element[key].value, type: element[key].type } }
        }
        results.push(elemAux)
      })
      return results
    },
    graphResults () {
      // var graphResults = this.subjectResults
      // var graphResults = this.predicateResults
      // var graphResults = this.objectResults
      // var graphResults = this.subjectResults.concat(this.objectResults)
      var graphResults = this.subjectResults.concat(this.objectResults).concat(this.predicateResults)
      return graphResults
    }
  },
  methods: {
    getNamespaces (repoID) {
      axios.get(this.backendURL + '/api/rdf4j/repository/' + repoID + '/namespaces')
        .then(response => {
          var namespacesAux = {}
          response.data.forEach(elem => {
            const prefix = elem.prefix.value + ':'
            namespacesAux[elem.namespace.value] = prefix
          })
          this.namespaces = namespacesAux
        })
        .catch(alert => {
          this.namespaces = {}
        })
    },
    editConfirm () {
      var uriNovo = this.namespace + '#' + this.resource
      if (this.$route.query.uri !== uriNovo) {
        this.$router.push({ query: { uri: uriNovo } })
      }
      this.editing = false
      this.updateResults()
    },
    editCancel () {
      this.namespace = this.uri.split('#')[0]
      this.resource = this.uri.split('#')[1]
      this.editing = false
    },
    goToResource (resource) {
      this.$router.push({ path: 'resource', query: { uri: this.$route.query.uri } })
    },
    cellClicked (cellInfo) {
      if (cellInfo.type === 'uri') {
        this.$router.push({ query: { uri: cellInfo.uri } })
        // this.updateResults()
      }
    },
    updateResults () {
      if (this.$route.query.uri !== undefined) {
        this.getSubjectResults(this.$repo.id, this.$route.query.uri, this.inferON)
        this.getPredicateResults(this.$repo.id, this.$route.query.uri, this.inferON)
        this.getObjectResults(this.$repo.id, this.$route.query.uri, this.inferON)
      }
    },
    async getSubjectResults (repoID, resource, infer) {
      this.loading.subject = true
      const url = this.backendURL + '/api/rdf4j/query/' + repoID
      const query = 'select * where { <' + resource + '> ?predicate ?object }'
      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      axios.post(url, qs.stringify({ query: query, infer: infer }), config)
        .then(response => {
          // console.log(response.data.results.bindings) // debug results
          var resultsData = response.data.results.bindings
          this.table.subjectResults = resultsData
        })
        .catch(alert => {
          this.table.subjectResults = []
          console.log('Subject Column Fetch failed')
          console.log(alert)
          // this.alert.subjectFail = true
        })
        .finally(() => {
          this.loading.subject = false
        })
    },
    async getPredicateResults (repoID, resource, infer) {
      this.loading.predicate = true
      const url = this.backendURL + '/api/rdf4j/query/' + repoID
      const query = 'select * where { ?subject <' + resource + '> ?object }'
      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      axios.post(url, qs.stringify({ query: query, infer: infer }), config)
        .then(response => {
          // console.log(response.data.results.bindings) // debug results
          var resultsData = response.data.results.bindings
          this.table.predicateResults = resultsData
        })
        .catch(alert => {
          this.table.subjectResults = []
          console.log('Predicate Column Fetch failed')
          console.log(alert)
          // this.alert.predicateFail = true
        })
        .finally(() => {
          this.loading.predicate = false
        })
    },
    async getObjectResults (repoID, resource, infer) {
      this.loading.object = true
      const url = this.backendURL + '/api/rdf4j/query/' + repoID
      const query = 'select * where { ?subject ?predicate <' + resource + '> }'
      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      axios.post(url, qs.stringify({ query: query, infer: infer }), config)
        .then(response => {
          // console.log(response.data.results.bindings) // debug results
          var resultsData = response.data.results.bindings
          this.table.objectResults = resultsData
        })
        .catch(alert => {
          this.table.objectResults = []
          console.log('Object Column Fetch failed')
          console.log(alert)
          // this.alert.objectFail = true
        })
        .finally(() => {
          this.loading.object = false
        })
    }
  }
}
</script>

<style>
.wrap-text {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  /* white-space: normal; */
  /* hyphens: auto; */
}
</style>
