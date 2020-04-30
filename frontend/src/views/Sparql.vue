<template>
  <v-container>
    <alerts/>
    <v-row dense>
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
            <savedQueries ref="savedQueriesComp" @runQuery="run"/>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12" md="12">
            <v-btn block color="primary" @click="goToDefaultGraph()">
              Default Graph
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <div v-on="on" class="px-1">
                    <v-icon>mdi-help-circle-outline</v-icon>
                  </div>
                </template>
                <span>Returns triples where Subject is rdf:type of some element from the default namespace</span>
              </v-tooltip>
            </v-btn>
          </v-col>
        </v-row>

        <v-row dense class="pt-1">
          <v-col class="grow">
            <v-textarea outlined auto-grow hide-details
              v-model="queryInput"
              rows="6"
              row-height="22"
              label="Query"
              placeholder="Place query and Run"
            ></v-textarea>
          </v-col>
          <v-col class="shrink">
            <v-row dense>
              <v-col cols="12">
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-btn fab small depressed color="primary" v-on="on"
                      @click="queryInput='select *\nwhere {\n  ?s ?p ?o\n}\nlimit 50'"
                    >
                      <v-icon>mdi-alpha-s</v-icon>
                    </v-btn>
                  </template>
                  <span>Construct Snippet</span>
                </v-tooltip>
              </v-col>
              <v-col cols="12">
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-btn fab small depressed color="primary" v-on="on"
                      @click="queryInput='construct {\n  ?s ?p \'wow\'\n}\nwhere {\n  ?s ?p ?o\n}'"
                    >
                      <v-icon>mdi-alpha-c</v-icon>
                    </v-btn>
                  </template>
                  <span>Construct Snippet</span>
                </v-tooltip>
              </v-col>
              <v-col cols="12">
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-btn fab small depressed color="primary" v-on="on"
                      @click="queryInput='ask {\n  ?s ?p ?o\n}'"
                    >
                      <v-icon>mdi-alpha-a</v-icon>
                    </v-btn>
                  </template>
                  <span>Ask Snippet</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="shrink">
            <v-row dense>
              <v-col cols="12">
                <v-btn fab small depressed color="primary"
                  :disabled="warningQuery.visible && checkQuery(queryInput).mode!=='update'"
                  :loading="loading.query"
                  @click="run(queryInput,infer)"
                >
                  <v-icon>mdi-play</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="12">
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-btn fab outlined small depressed dark v-on="on"
                      :color="infer ? 'green' : 'red'"
                      @click="infer=!infer"
                    >
                      <v-icon>
                        {{infer ? 'fas fa-angle-double-right' : 'fas fa-angle-right'}}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Infered Triples: {{infer ? "Included" : "Excluded"}}</span>
                </v-tooltip>
              </v-col>
              <v-col cols="12">
                <div v-if="this.$session.get('userToken')">
                  <v-dialog v-model="dialogSaveQuery" max-width="600px">
                    <template v-slot:activator="{ on }">
                      <v-btn fab small depressed color="primary" v-on="on"
                        :disabled="warningQuery.visible && checkQuery(queryInput).mode!=='update'"
                        :loading="loading.savingQuery"
                        @click="saving.queryValue = queryInput"
                      >
                        <v-icon>fas fa-save</v-icon>
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="headline">
                          Saving Query
                        </span>
                      </v-card-title>
                      <v-card-text>
                        <v-text-field dense hide-details
                          class="mt-0 py-0"
                          v-model="saving.queryName"
                          label="Saved Query name"
                        ></v-text-field>
                        <v-checkbox hide-details
                          class="mt-0 pt-2"
                          v-model="saving.queryGlobal"
                          label="Global"
                          color="primary"
                        ></v-checkbox>
                        <v-textarea outlined auto-grow hide-details
                          class="pt-3"
                          v-model="saving.queryValue"
                          rows="6"
                          row-height="20"
                          label="Edited Query"
                        ></v-textarea>
                      </v-card-text>
                      <v-card-actions>
                        <v-col class="grow">
                          <v-btn block color="success"
                            @click="saveQuery(saving.queryName,saving.queryValue,$session.get('userEmail'),saving.queryGlobal);dialogSaveQuery=false"
                          >
                            Save
                          </v-btn>
                        </v-col>
                        <v-col class="grow">
                          <v-btn block color="error" @click="dialogSaveQuery=false">
                            Cancel
                          </v-btn>
                        </v-col>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </div>
                <div v-else>
                  <v-tooltip left>
                    <template v-slot:activator="{ on }">
                      <div v-on="on">
                        <v-btn fab small depressed color="primary" disabled>
                          <v-icon>fas fa-save</v-icon>
                        </v-btn>
                      </div>
                    </template>
                    <span>Must be Logged In to save queries</span>
                  </v-tooltip>
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" v-if="warningQuery.visible">
            <v-alert text class="mb-0"
              v-model="warningQuery.visible"
              :type="warningQuery.color"
            >
              {{warningQuery.message}}
            </v-alert>
          </v-col>
          <v-col cols="12" v-if="alertQuery.visible">
            <v-alert text dismissible
              v-model="alertQuery.visible"
              :type="alertQuery.color"
            >
              {{alertQuery.message}}
            </v-alert>
          </v-col>
        </v-row>

        <v-row dense align="center" justify="center">
          <v-col class="shrink">
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-icon v-on="on">mdi-help-circle-outline</v-icon>
              </template>
              <span>Search and Sort look at the current view of the elements</span>
            </v-tooltip>
          </v-col>
          <v-col class="grow">
            <v-text-field single-line hide-details class="mt-0 pt-1"
              v-model="search"
              :loading="loading.search"
              append-icon="mdi-magnify"
              label="Search"
            ></v-text-field>
          </v-col>
          <v-col class="shrink">
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn icon outlined depressed dark v-on="on"
                  :color="searchCaseSensitive ? 'green' : 'red'"
                  @click="searchCaseSensitive=!searchCaseSensitive"
                >
                  <v-icon>
                    {{searchCaseSensitive ? 'mdi-case-sensitive-alt' : 'mdi-case-sensitive-alt'}}
                  </v-icon>
                </v-btn>
              </template>
              <span>Case Sensitive: {{searchCaseSensitive ? "ON" : "OFF"}}</span>
            </v-tooltip>
          </v-col>
          <v-col cols="12" md="6" class="py-0">
            <v-row dense align="center" justify="center" class="flex-nowrap">
              <v-col>
                <v-btn block outlined depressed dark v-on="on"
                  :color="namespaceON ? 'green' : 'red'"
                  @click="namespaceON=!namespaceON"
                >
                  Show Namespace
                </v-btn>
              </v-col>
              <v-col>
                <v-btn block outlined depressed dark v-on="on"
                  :color="prefixON ? 'green' : 'red'"
                  @click="prefixON=!prefixON"
                >
                  Use Prefix
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="8">
            <v-btn block color="primary"
              :disabled="!this.exportResult.lastQuery || this.exportResult.lastQueryType==='ask' ? true : false"
              @click="exportResults($repo.id,exportResult.selectedFileType,exportResult.lastQuery,exportResult.lastInfer)"
            >
              Export Results
            </v-btn>
          </v-col>
          <v-col cols="4">
            <v-combobox dense hide-details outlined
              v-model="exportResult.selectedFileType"
              :items="this.exportResult.fileTypeList"
              label="Export File"
            ></v-combobox>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12">
            <!-- TODO:
                    -fix ordering
                    -customize data footer
                    -change items-per-page
             -->
            <v-data-table
              :headers="table.headers"
              :items="tableResults"
              :items-per-page="10"
              :items-per-page-options="[5,10,25,100,-1]"
              :search="search"
              :custom-filter="customSearch"
              :custom-sort="customSort"
              :loading="loading.table"
              loading-text="Loadind results..."
              no-results-text="No results for this search."
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
import sparqlParser from '@/plugins/sparqlParser.js'
import Vuex from 'vuex'
import axios from 'axios'
const qs = require('querystring')
const FileDownload = require('js-file-download')

export default {
  components: {
    alerts,
    savedQueries
  },
  data: () => ({
    queryInput: 'select * where {\n  ?s ?p ?o\n}\nlimit 50',
    infer: true,
    table: {
      headers: [],
      items: []
    },
    dialogSaveQuery: false,
    saving: {
      queryName: '',
      queryValue: '',
      queryGlobal: true
    },
    search: '',
    searchCaseSensitive: true,
    defaultNamespace: '',
    defaultNamespaceForQuery: '',
    namespaces: {},
    namespaceON: true,
    prefixON: true,
    savedQueriesExpand: true,
    exportResult: {
      fileTypeList: ['json', 'csv', 'rdf-xml', 'binary-rdf'],
      selectedFileType: 'json',
      lastQuery: null,
      lastQueryType: null,
      lastInfer: true
    },
    alert: {
    },
    alertQuery: {
      visible: false,
      color: 'warning',
      message: ''
    },
    loading: {
      query: false,
      savingQuery: false,
      table: false,
      search: false
    }
  }),
  mounted: async function () {
    var currentRepoID = this.$session.get('repoID')
    this.getNamespaces(currentRepoID)
    this.getDefaultNamespace(currentRepoID)
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
    warningQuery: function () {
      var warningQuery = {
        visible: false,
        color: 'warning',
        message: 'OK'
      }
      try {
        if (this.checkQuery(this.queryInput).mode === 'update') {
          warningQuery.visible = true
          warningQuery.message = 'Cannot verify Insert or Delete'
        } else {
          // console.log('parsing QUERY')
          sparqlParser.parse(this.queryInput)
          // console.log('parse OK')
          warningQuery.visible = false
        }
      } catch (error) {
        // console.log('parse NOT OK')
        // console.log(warningQuery)
        warningQuery.visible = true
        warningQuery.message = error
      }
      return warningQuery
    },
    tableResults: function () {
      var results = []
      this.table.items.forEach(element => {
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
    }
    // checkQuery: function() {
    //   return this.checkQuery(this.queryInput)
    // }
  },
  methods: {
    getNamespaces (repoID) {
      axios.get(this.backendURL + '/api/rdf4j/repository/' + repoID + '/namespaces')
        .then(response => {
          // puting results directly into this.namespaces usually results in a empty list
          var auxList = {} // for safety
          response.data.forEach(elem => {
            auxList[elem.namespace.value] = elem.prefix.value + ':'
          })
          this.namespaces = auxList
        })
        .catch(error => {
          console.log(error.response)
          this.namespaces = {}
        })
    },
    getDefaultNamespace (repoID) {
      axios.get(this.backendURL + '/api/rdf4j/repository/' + repoID + '/namespaces/ /')
        .then(response => {
          this.defaultNamespace = response.data
          this.defaultNamespaceForQuery = 'PREFIX : <' + response.data + '>\n'
        })
        .catch(error => {
          console.log(error.response)
          this.defaultNamespace = ''
          this.defaultNamespaceForQuery = ''
        })
    },
    goToDefaultGraph () {
      var query = 'select ?s ?p ?o where {\nvalues ?p { rdf:type }\n?s a ?o.\nFILTER (STRSTARTS(str(?s), "' + this.defaultNamespace + '"))\n}'
      // console.log(query) // debug
      this.runQuery(query, true)
    },
    cellClicked (cellInfo) {
      if (cellInfo.type === 'uri') { this.$router.push({ path: 'resource', query: { uri: cellInfo.uri } }) }
    },
    checkQuery (query) {
      // SELECT.*WHERE.*\{.*\}
      const selectPatt = /SELECT/i
      const constructPatt = /CONSTRUCT/i
      const askPatt = /ASK/i
      const describePatt = /DESCRIBE/i
      const insertPatt = /INSERT/i
      const deletePatt = /DELETE/i
      var type = '???'
      var mode = '???'
      if (selectPatt.test(query)) {
        type = 'select'
        mode = 'query'
      } else if (constructPatt.test(query)) {
        type = 'construct'
        mode = 'query'
      } else if (askPatt.test(query)) {
        type = 'ask'
        mode = 'query'
      } else if (describePatt.test(query)) {
        type = 'describe'
        mode = 'query'
      } else if (insertPatt.test(query)) {
        type = 'insert'
        mode = 'update'
      } else if (deletePatt.test(query)) {
        type = 'delete'
        mode = 'update'
      }
      return { type, mode }
    },
    run (query, infer) {
      var type = this.checkQuery(query).type
      switch (type) {
        case 'select':
        case 'construct':
        case 'ask':
          this.runQuery(query, infer, type)
          break
        case 'insert':
        case 'delete':
          this.runUpdate(query)
          break
        default:
          break
      }
    },
    runQuery (query, infer, type) {
      this.loading.query = true
      this.loading.table = true
      const defaultNamespaceExists = /^ *PREFIX : /m.test(query)
      if (!defaultNamespaceExists) query = this.defaultNamespaceForQuery + query
      var repoID = this.$repo.id
      var accept
      switch (type) {
        case 'select':
          accept = 'application/json'
          break
        case 'construct':
          accept = 'application/rdf+json'
          break
        case 'ask':
          accept = 'text/boolean'
          break
        default:
          accept = 'application/json' // could fail
      }
      var url = this.backendURL + '/api/rdf4j/query/' + repoID
      const config = {
        headers: {
          Accept: accept,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      axios.post(url, qs.stringify({ query: query, infer: infer }), config)
        .then(response => {
          var responseData = response.data
          switch (type) {
            case 'select':
              var columnsVars = responseData.head.vars
              var resultsVars = responseData.results.bindings
              this.table.headers = []
              columnsVars.forEach(element => {
                this.table.headers.push({ text: element, value: element, sortable: true })
              })
              this.table.items = []
              resultsVars.forEach(element => {
                var elemAux = {}
                for (const key in element) {
                  elemAux[key] = {
                    value: element[key].value,
                    type: element[key].type
                  }
                }
                this.table.items.push(elemAux)
              })
              break
            case 'construct':
              this.table.headers = [
                { text: 'subject', value: 'subject', sortable: true },
                { text: 'predicate', value: 'predicate', sortable: true },
                { text: 'object', value: 'object', sortable: true }
              ]
              var results = responseData
              this.table.items = []
              for (const subject in results) {
                for (const predicate in results[subject]) {
                  results[subject][predicate].forEach(object => {
                    // console.log(subject)
                    // console.log(predicate)
                    // console.log(object.value)
                    // console.log(object.type)
                    this.table.items.push({
                      subject: {
                        value: subject,
                        type: 'uri'
                      },
                      predicate: {
                        value: predicate,
                        type: 'uri'
                      },
                      object: {
                        value: object.value,
                        type: object.type
                      }
                    })
                  })
                }
              };
              break
            case 'ask':
              var result = responseData
              this.table.headers = [{
                text: 'boolean',
                value: 'boolean',
                sortable: false
              }]
              this.table.items = [{
                boolean: {
                  value: result,
                  type: 'literal'
                }
              }]
              break
            default:
              break
          }
          this.exportResult.lastQuery = query
          this.exportResult.lastQueryType = type
          this.exportResult.lastInfer = infer
          this.alertQuery.visible = false
        })
        .catch(error => {
          this.alertQuery.visible = true
          this.alertQuery.color = 'warning'
          this.alertQuery.message = 'Query Failed!! \n' + error.response.data
        })
        .finally(() => {
          this.loading.query = false
          this.loading.table = false
        })
    },
    saveQuery (name, query, userEmail, global) {
      this.loading.savingQuery = true
      var body = {
        name: name,
        query: query,
        user_email: userEmail // TODO: use user email when auth gets done
      }
      if (!global) body.repoID = this.$repo.id

      var url = this.backendURL + '/api/queries'
      axios.post(url, body)
        .then(response => {
          // console.log(response.data) // debug
          // console.log(this.$refs.savedQueriesComp) // debug to check child component variable
          if (global) { this.$refs.savedQueriesComp.savedQueriesGlobal.push({ name: name, query: query, global: true }) } else { this.$refs.savedQueriesComp.savedQueriesRepo.push({ name: name, query: query, global: false }) }

          this.alertQuery.visible = true
          this.alertQuery.color = 'success'
          this.alertQuery.message = 'Query Saved! \n'
        })
        .catch(error => {
          this.alertQuery.visible = true
          this.alertQuery.color = 'warning'
          this.alertQuery.message = 'Query Save Failed!! \n' + error.response.data
        })
        .finally(() => {
          this.saving.queryName = ''
          this.saving.queryValue = ''
          this.saving.queryGlobal = true
          this.loading.savingQuery = false
        })
    },
    exportResults (repoID, fileType, query, infer) {
      this.loading.exportFile = true
      var accept
      if (this.exportResult.lastQueryType === 'select') {
        switch (fileType) {
          case 'json':
            accept = 'application/json'
            break
          case 'csv':
            accept = 'text/csv'
            break
          case 'rdf-xml':
            accept = 'application/xml'
            break
          case 'binary-rdf':
            accept = 'application/x-binary-rdf-results-table'
            break
          default:
            accept = 'application/json'
        }
      } else if (this.exportResult.lastQueryType === 'construct') {
        switch (fileType) {
          case 'json':
            accept = 'application/rdf+json'
            break
          case 'csv':
            accept = 'text/plain'
            break
          case 'rdf-xml':
            accept = 'application/rdf+xml'
            break
          case 'binary-rdf':
            accept = 'application/x-binary-rdf'
            break
          default:
            accept = 'application/rdf+json'
        }
      }
      var url = this.backendURL + '/api/rdf4j/query/' + repoID
      const config = {
        headers: {
          Accept: accept,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      axios.post(url, qs.stringify({ query: query, infer: infer }), config)
        .then(response => {
          var fileData = 'error processing the export...'
          var extension = fileType
          switch (fileType) {
            case 'json':
              fileData = JSON.stringify(response.data, null, 4)
              break
            case 'csv':
              fileData = response.data
              break
            case 'rdf-xml':
              fileData = response.data
              extension = 'xml'
              break
            case 'binary-rdf':
              fileData = response.data
              extension = 'brt'
              break
            default:
          }
          FileDownload(fileData, 'exportQueryResults.' + extension)
        })
        .catch(error => {
          console.log(error.response.data)
          this.alertQuery.visible = true
          this.alertQuery.color = 'error'
          this.alertQuery.message = 'Export Failed!! \n' + error.response.data
        })
        .finally(() => {
          this.loading.exportFile = false
        })
    },
    runUpdate (update) {
      this.loading.query = true
      const defaultNamespaceExists = /^ *PREFIX : /m.test(update)
      if (!defaultNamespaceExists) update = this.defaultNamespaceForQuery + update
      var repoID = this.$repo.id
      var url = this.backendURL + '/api/rdf4j/update/' + repoID
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      axios.post(url, qs.stringify({ update: update }), config)
        .then(response => {
          this.alertQuery.visible = true
          this.alertQuery.color = 'success'
          this.alertQuery.message = 'Update executed!'
        })
        .catch(error => {
          this.alertQuery.visible = true
          this.alertQuery.color = 'warning'
          this.alertQuery.message = 'Update Failed!! \n' + error.response.data
        })
        .finally(() => {
          this.loading.query = false
          this.loading.table = false
        })
    },
    customSearch (value, search, item) {
      // console.log(value) // debug
      // console.log(search) // debug
      // console.log(item) // debug
      if (value == null || search == null) {
        console.log('Value or Search is NULL')
        return false
      } else if (value.uri == null || value.value == null) {
        console.log('Value URI or VALUE is NULL')
        return false
      } else if (typeof value.uri !== 'string' || typeof value.value !== 'string') {
        console.log('Somehow non-string values are inside the table...')
        return false
      } else {
        var auxURI
        // var auxValue
        var auxSearch
        if (this.searchCaseSensitive) {
          console.log('checking search values... (Case Sensitive)')
          auxURI = value.value.toString()
          auxSearch = search
        } else {
          console.log('checking search values... (NOT Case Sensitive)')
          auxURI = value.value.toString().toLocaleLowerCase()
          auxSearch = search.toLocaleLowerCase()
        }

        if (auxURI.indexOf(auxSearch) === -1) return false
        else return true
      }
    },
    customSort (items, sortBy, sortDesc, locale, customSorters) {
      // console.log(items) // debug
      // console.log(sortBy) // debug
      // console.log(sortDesc) // debug
      items.sort((a, b) => {
        // TODO: a way to order numbers... right now it orders number wrong...
        if (sortBy.length) {
          if (!sortDesc[0]) {
            return a[sortBy].value < b[sortBy].value ? -1 : 1
          } else {
            return b[sortBy].value < a[sortBy].value ? -1 : 1
          }
        }
      })
      return items
    }
  }
}
</script>
