<template>
  <v-container>
    <alerts/>
    <v-row>
      <v-col cols="12" lg="9">
        <h2>Resource: {{this.uri.split('#')[1]}}</h2>
        <h3>Namespace: {{this.uri.split('#')[0]}}</h3>
        <!-- TODO: allow URI edit -->
        <span class="mb-0">URI: </span><span class="mb-0">{{this.uri}}</span>
      </v-col>
      <v-col cols="12" lg="3">
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
      <v-col cols="12">
        <v-tabs grow background-color="darken-1 primary"
          :value="this.activeTab"
        >
          <v-tab>Subject</v-tab>
          <v-tab>Predicate</v-tab>
          <v-tab>Object</v-tab>

          <v-tab-item>
            <v-data-table
              :headers="table.headers"
              :items="subjectResults"
              :items-per-page="10"
              :loading="loading.subject"
            >
              <template v-slot:item="props">
                <tr>
                  <td>
                    <b>{{resourceTableURI}}</b>
                  </td>
                  <td @click="cellClicked(props.item[table.headers[1].text])">
                    <span v-if="props.item[table.headers[1].text].type==='uri'">
                      <u>{{props.item[table.headers[1].text].value}}</u>
                    </span>
                    <span v-else>{{props.item[table.headers[1].text].value}}</span>
                  </td>
                  <td @click="cellClicked(props.item[table.headers[2].text])">
                    <span v-if="props.item[table.headers[2].text].type==='uri'">
                      <u>{{props.item[table.headers[2].text].value}}</u>
                    </span>
                    <span v-else>{{props.item[table.headers[2].text].value}}</span>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-tab-item>
          <v-tab-item>
            <v-data-table
              :headers="table.headers"
              :items="predicateResults"
              :items-per-page="10"
              :loading="loading.predicate"
            >
              <template v-slot:item="props">
                <tr>
                  <td @click="cellClicked(props.item[table.headers[0].text])">
                    <span v-if="props.item[table.headers[0].text].type==='uri'">
                      <u>{{props.item[table.headers[0].text].value}}</u>
                    </span>
                    <span v-else>{{props.item[table.headers[0].text].value}}</span>
                  </td>
                  <td>
                    <b>{{resourceTableURI}}</b>
                  </td>
                  <td @click="cellClicked(props.item[table.headers[2].text])">
                    <span v-if="props.item[table.headers[2].text].type==='uri'">
                      <u>{{props.item[table.headers[2].text].value}}</u>
                    </span>
                    <span v-else>{{props.item[table.headers[2].text].value}}</span>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-tab-item>
          <v-tab-item>
            <v-data-table
              :headers="table.headers"
              :items="objectResults"
              :items-per-page="10"
              :loading="loading.object"
            >
              <template v-slot:item="props">
                <tr>
                  <td @click="cellClicked(props.item[table.headers[0].text])">
                    <span v-if="props.item[table.headers[0].text].type==='uri'">
                      <u>{{props.item[table.headers[0].text].value}}</u>
                    </span>
                    <span v-else>{{props.item[table.headers[0].text].value}}</span>
                  </td>
                  <td @click="cellClicked(props.item[table.headers[1].text])">
                    <span v-if="props.item[table.headers[1].text].type==='uri'">
                      <u>{{props.item[table.headers[1].text].value}}</u>
                    </span>
                    <span v-else>{{props.item[table.headers[1].text].value}}</span>
                  </td>
                  <td>
                    <b>{{resourceTableURI}}</b>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-tab-item>
        </v-tabs>
      </v-col>

      <!-- <v-col cols="12">
        <v-data-table
          :headers="table.headers"
          :items="subjectResults"
          :items-per-page="10"
        >
          <template v-slot:item="props">
            <tr>
              <td>
                {{resourceTableURI}}
              </td>
              <td @click="cellClicked(props.item[table.headers[1].text])">
                {{props.item[table.headers[1].text]}}
              </td>
              <td @click="cellClicked(props.item[table.headers[2].text])">
                {{props.item[table.headers[2].text]}}
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col> -->
    </v-row>
  </v-container>
</template>

<script>
import alerts from '@/components/alerts'
import Vuex from 'vuex'
import axios from 'axios'
const qs = require('querystring')

export default {
  components: {
    alerts
  },
  data: () => ({
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
    switch (this.$route.query.position) {
      case 'subject':
        this.activeTab = 0
        break
      case 'predicate':
        this.activeTab = 1
        break
      case 'object':
        this.activeTab = 2
        break
      default:
        this.activeTab = 0
        break
    }
    this.getNamespaces(this.$session.get('repoID'))
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
    backend_url: function () {
      var backend_url = 'http://' + this.$backurl.host + ':' + this.$backurl.port
      return backend_url
    },
    uri: function () {
      this.updateResults()
      return this.$route.query.uri
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
    }
  },
  methods: {
    getNamespaces (repoID) {
      axios.get(this.backend_url + '/api/rdf4j/repository/' + repoID + '/namespaces')
        .then(response => {
          response.data.forEach(elem => {
            this.namespaces[elem.namespace.value] = elem.prefix.value + ':'
          })
        })
        .catch(alert => {
          this.namespaces = {}
        })
    },
    cellClicked (cellInfo) {
      if (cellInfo.type === 'uri') {
        this.$router.push({ query: { uri: cellInfo.uri } })
        // this.updateResults()
      }
    },
    updateResults () {
      this.getSubjectResults(this.$repo.id, this.$route.query.uri, this.inferON)
      this.getPredicateResults(this.$repo.id, this.$route.query.uri, this.inferON)
      this.getObjectResults(this.$repo.id, this.$route.query.uri, this.inferON)
    },
    getSubjectResults (repoID, resource, infer) {
      this.loading.subject = true
      const url = this.backend_url + '/api/rdf4j/query/' + repoID
      const query = 'select * where { <' + resource + '> ?predicate ?object }'
      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      axios.post(url, qs.stringify({ query: query, infer: infer }), config)
        .then(response => {
          // console.log(response.data) // debug
          // console.log(response.data.results.bindings) // debug resultados
          var resultsData = response.data.results.bindings

          this.table.subjectResults = []
          resultsData.forEach(element => {
            var elemAux = {}
            for (const key in element) {
              elemAux[key] = {
                value: element[key].value,
                type: element[key].type
              }
            }
            this.table.subjectResults.push(elemAux)
          })
        })
        .catch(alert => {
          this.table.subjectResults = []
          console.log('RIP subject (it ok if once when opening page, idk why) => ' + alert)
          // this.alert.subjectFail = true
        })
        .finally(() => {
          this.loading.subject = false
        })
    },
    getPredicateResults (repoID, resource, infer) {
      this.loading.predicate = true
      const url = this.backend_url + '/api/rdf4j/query/' + repoID
      const query = 'select * where { ?subject <' + resource + '> ?object }'
      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      axios.post(url, qs.stringify({ query: query, infer: infer }), config)
        .then(response => {
          // console.log(response.data) // debug
          // console.log(response.data.results.bindings) // debug resultados
          var resultsData = response.data.results.bindings

          this.table.predicateResults = []
          resultsData.forEach(element => {
            var elemAux = {}
            for (const key in element) {
              elemAux[key] = {
                value: element[key].value,
                type: element[key].type
              }
            }
            this.table.predicateResults.push(elemAux)
          })
        })
        .catch(alert => {
          console.log('RIP predicate (it ok if once when opening page, idk why) => ' + alert)
          // this.alert.predicateFail = true
        })
        .finally(() => {
          this.loading.predicate = false
        })
    },
    getObjectResults (repoID, resource, infer) {
      this.loading.object = true
      const url = this.backend_url + '/api/rdf4j/query/' + repoID
      const query = 'select * where { ?subject ?predicate <' + resource + '> }'
      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      axios.post(url, qs.stringify({ query: query, infer: infer }), config)
        .then(response => {
          // console.log(response.data) // debug
          // console.log(response.data.results.bindings) // debug resultados
          var resultsData = response.data.results.bindings

          this.table.objectResults = []
          resultsData.forEach(element => {
            var elemAux = {}
            for (const key in element) {
              elemAux[key] = {
                value: element[key].value,
                type: element[key].type
              }
            }
            this.table.objectResults.push(elemAux)
          })
        })
        .catch(alert => {
          console.log('RIP object (it ok if once when opening page, idk why) => ' + alert)
          // this.alert.objectFail = true
        })
        .finally(() => {
          this.loading.object = false
        })
    }
  }
}
</script>
