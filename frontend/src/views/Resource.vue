<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="9">
        <h2>Resource: {{this.$route.query.uri.split('#')[1]}}</h2>
        <h3>{{$route.query.uri}}</h3>
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
      </v-col>
      <v-col cols="12">
        <v-tabs grow background-color="darken-1 primary">
          <v-tab>Subject</v-tab>
          <v-tab>Predicate</v-tab>
          <v-tab>Object</v-tab>

          <v-tab-item>
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
                  <td @click="cellClicked(props.item[table.headers[1].text].uri)">
                    {{props.item[table.headers[1].text].value}}
                  </td>
                  <td @click="cellClicked(props.item[table.headers[2].text].uri)">
                    {{props.item[table.headers[2].text].value}}
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
            >
              <template v-slot:item="props">
                <tr>
                  <td @click="cellClicked(props.item[table.headers[0].text].uri)">
                    {{props.item[table.headers[0].text].value}}
                  </td>
                  <td>
                    {{resourceTableURI}}
                  </td>
                  <td @click="cellClicked(props.item[table.headers[2].text].uri)">
                    {{props.item[table.headers[2].text].value}}
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
            >
              <template v-slot:item="props">
                <tr>
                  <td @click="cellClicked(props.item[table.headers[0].text].uri)">
                    {{props.item[table.headers[0].text].value}}
                  </td>
                  <td @click="cellClicked(props.item[table.headers[1].text].uri)">
                    {{props.item[table.headers[1].text].value}}
                  </td>
                  <td>
                    {{resourceTableURI}}
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
import Vuex from 'vuex'
import axios from 'axios'
const qs = require('querystring')
const backend_url = "http://localhost:"+process.env.VUE_APP_BACKEND_PORT

export default {
  data: () => ({
    table: {
      headers: [
        { text: 'subject', value: 'subject', sortable: false },
        { text: 'predicate', value: 'predicate', sortable: false },
        { text: 'object', value: 'object', sortable: false },
      ],
      subjectResults: [],
      predicateResults: [],
      objectResults: [],
    },
    namespaces: {},
    namespaceON: true,
    prefixON: true,
    loading: {
      subject: false,
      predicate: false,
      object: false,
    },
    alert: {
      subjectFail: false,
      predicateFail: false,
      objectFail: false,
    },
  }),
  mounted: async function (){
    // console.log(process.env) // debug
    var currentUserEmail = 'kiko@kiko' // FIXME: use loged user

    this.getNamespaces(this.$session.get('repoID'))
    this.getSubjectResults(this.$session.get('repoID'), this.$route.query.uri)
    this.getPredicateResults(this.$session.get('repoID'), this.$route.query.uri)
    this.getObjectResults(this.$session.get('repoID'), this.$route.query.uri)
  },
  computed: {
    $repo: {
      get: Vuex.mapState(['$repo']).$repo,
      set: Vuex.mapMutations(['update$repo']).update$repo,
    },
    resourceTableURI: function() {
      if(this.namespaceON)
        if(this.prefixON){
          var namespace = this.$route.query.uri.split('#')[0] + '#'
          var prefix = this.namespaces[namespace] || namespace
          var resource = this.$route.query.uri.split('#')[1] || ''
          return prefix + resource
        }
        else
          return this.$route.query.uri
      else
        return this.$route.query.uri.split('#')[1]
    },
    subjectResults: function() {
      var results = []
      this.table.subjectResults.forEach(element => {
        var elemAux = {}
        for(const key in element){
          if(this.namespaceON)
            if(this.prefixON){
              var namespace = element[key].split('#')[0] + '#'
              var prefix = this.namespaces[namespace] || namespace
              var resource = element[key].split('#')[1] || ''
              elemAux[key] = {'value': prefix + resource, 'uri': element[key]}
            }
            else
              elemAux[key] = {'value': element[key], 'uri': element[key]}
          else
            elemAux[key] = {'value': element[key].split('#')[1], 'uri': element[key]}
        }
        results.push(elemAux)
      });
      return results
    },
    predicateResults: function() {
      var results = []
      this.table.predicateResults.forEach(element => {
        var elemAux = {}
        for(const key in element){
          if(this.namespaceON)
            if(this.prefixON){
              var namespace = element[key].split('#')[0] + '#'
              var prefix = this.namespaces[namespace] || namespace
              var resource = element[key].split('#')[1] || ''
              elemAux[key] = {'value': prefix + resource, 'uri': element[key]}
            }
            else
              elemAux[key] = {'value': element[key], 'uri': element[key]}
          else
            elemAux[key] = {'value': element[key].split('#')[1], 'uri': element[key]}
        }
        results.push(elemAux)
      });
      return results
    },
    objectResults: function() {
      var results = []
      this.table.objectResults.forEach(element => {
        var elemAux = {}
        for(const key in element){
          if(this.namespaceON)
            if(this.prefixON){
              var namespace = element[key].split('#')[0] + '#'
              var prefix = this.namespaces[namespace] || namespace
              var resource = element[key].split('#')[1] || ''
              elemAux[key] = {'value': prefix + resource, 'uri': element[key]}
            }
            else
              elemAux[key] = {'value': element[key], 'uri': element[key]}
          else
            elemAux[key] = {'value': element[key].split('#')[1], 'uri': element[key]}
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
          response.data.forEach(elem => {
            this.namespaces[elem.namespace.value] = elem.prefix.value + ':'
          });
        })
        .catch(alert => {
          this.namespaces = {}
        })
    },
    cellClicked(cellInfo) {
      this.$router.replace({query: { uri: cellInfo }})
      this.getSubjectResults(this.$repo.id, this.$route.query.uri)
      this.getPredicateResults(this.$repo.id, this.$route.query.uri)
      this.getObjectResults(this.$repo.id, this.$route.query.uri)
    },
    getSubjectResults(repoID, resource) {
      // this.loading.subject = true
      const url = backend_url+'/api/rdf4j/query/'+repoID
      const query = 'select * where { <'+resource+'> ?predicate ?object }'
      axios.post(url, qs.stringify({'query': query}),
        {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
        .then(response => {
          // console.log(response.data) // debug
          // console.log(response.data.results.bindings) // debug resultados
          var resultsData = response.data.results.bindings

          this.table.subjectResults = []
          resultsData.forEach(element => {
            var elemAux = {}
            for(const key in element){
              elemAux[key] = element[key].value
            }
            this.table.subjectResults.push(elemAux)
          });
        })
        .catch(alert => {
          this.table.subjectResults = []
          console.log("FDS subject" + alert)
          // this.alert.subjectFail = true
        })
        // .finally(() => {
        //   this.loading.subject = false
        // })
    },
    getPredicateResults(repoID, resource) {
      // this.loading.predicate = true
      const url = backend_url+'/api/rdf4j/query/'+repoID
      const query = 'select * where { ?subject <'+resource+'> ?object }'
      axios.post(url, qs.stringify({'query': query}),
        {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
        .then(response => {
          // console.log(response.data) // debug
          // console.log(response.data.results.bindings) // debug resultados
          var resultsData = response.data.results.bindings

          this.table.predicateResults = []
          resultsData.forEach(element => {
            var elemAux = {}
            for(const key in element){
              elemAux[key] = element[key].value
            }
            this.table.predicateResults.push(elemAux)
          });
        })
        .catch(alert => {
          console.log("FDS predicate" + alert)
          // this.alert.predicateFail = true
        })
        // .finally(() => {
        //   this.loading.predicate = false
        //   return items
        // })
    },
    getObjectResults(repoID, resource) {
      // this.loading.object = true
      const url = backend_url+'/api/rdf4j/query/'+repoID
      const query = 'select * where { ?subject ?predicate <'+resource+'> }'
      axios.post(url, qs.stringify({'query': query}),
        {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
        .then(response => {
          // console.log(response.data) // debug
          // console.log(response.data.results.bindings) // debug resultados
          var resultsData = response.data.results.bindings

          this.table.objectResults = []
          resultsData.forEach(element => {
            var elemAux = {}
            for(const key in element){
              elemAux[key] = element[key].value
            }
            this.table.objectResults.push(elemAux)
          });
        })
        .catch(alert => {
          console.log("FDS object" + alert)
          // this.alert.objectFail = true
        })
        // .finally(() => {
        //   this.loading.object = false
        //   return items
        // })
    },
  }
}
</script>
