<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Resource: {{this.$route.query.uri.split('#')[1]}}</h2>
        <h3>{{$route.query.uri}}</h3>

        <v-checkbox hide-details class="mt-0 pt-2"
          v-model="prefixON"
          label="Show Prefix"
          color="primary"
        ></v-checkbox>
      </v-col>
      <v-col cols="12">
        <v-tabs grow>
          <v-tab>Subject</v-tab>
          <v-tab>Predicate</v-tab>
          <v-tab>Object</v-tab>

          <v-tab-item>
            <v-data-table
              :headers="table.headers"
              :items="table.subjectResults"
              :items-per-page="10"
            >
              <template v-slot:item="props">
                <tr v-if="prefixON">
                  <td>
                    {{$route.query.uri}}
                  </td>
                  <td @click="cellClicked(props.item[table.headers[1].text])">
                    {{props.item[table.headers[1].text]}}
                  </td>
                  <td @click="cellClicked(props.item[table.headers[2].text])">
                    {{props.item[table.headers[2].text]}}
                  </td>
                </tr>
                <tr v-else>
                  <td>
                    {{$route.query.uri.split('#')[1]}}
                  </td>
                  <td @click="cellClicked(props.item[table.headers[1].text])">
                    {{props.item[table.headers[1].text].split('#')[1]}}
                  </td>
                  <td @click="cellClicked(props.item[table.headers[2].text])">
                    {{props.item[table.headers[2].text].split('#')[1]}}
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-tab-item>
          <v-tab-item>
            <v-data-table
              :headers="table.headers"
              :items="table.predicateResults"
              :items-per-page="10"
            >
              <template v-slot:item="props">
                <tr v-if="prefixON">
                  <td @click="cellClicked(props.item[table.headers[0].text])">
                    {{props.item[table.headers[0].text]}}
                  </td>
                  <td>
                    {{$route.query.uri}}
                  </td>
                  <td @click="cellClicked(props.item[table.headers[2].text])">
                    {{props.item[table.headers[2].text]}}
                  </td>
                </tr>
                <tr v-else>
                  <td @click="cellClicked(props.item[table.headers[0].text])">
                    {{props.item[table.headers[0].text].split('#')[1]}}
                  </td>
                  <td>
                    {{$route.query.uri.split('#')[1]}}
                  </td>
                  <td @click="cellClicked(props.item[table.headers[2].text])">
                    {{props.item[table.headers[2].text].split('#')[1]}}
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-tab-item>
          <v-tab-item>
            <v-data-table
              :headers="table.headers"
              :items="table.objectResults"
              :items-per-page="10"
            >
              <template v-slot:item="props">
                <tr v-if="prefixON">
                  <td @click="cellClicked(props.item[table.headers[0].text])">
                    {{props.item[table.headers[0].text]}}
                  </td>
                  <td @click="cellClicked(props.item[table.headers[1].text])">
                    {{props.item[table.headers[1].text]}}
                  </td>
                  <td>
                    {{$route.query.uri}}
                  </td>
                </tr>
                <tr v-else>
                  <td @click="cellClicked(props.item[table.headers[0].text])">
                    {{props.item[table.headers[0].text].split('#')[1]}}
                  </td>
                  <td @click="cellClicked(props.item[table.headers[1].text])">
                    {{props.item[table.headers[1].text].split('#')[1]}}
                  </td>
                  <td>
                    {{$route.query.uri.split('#')[1]}}
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-tab-item>
        </v-tabs>
      </v-col>
      <v-col cols="12">
        <v-data-table
          :headers="table.headers"
          :items="table.subjectResults"
          :items-per-page="10"
        >
          <template v-slot:item="props">
            <tr v-if="prefixON">
              <td>
                {{$route.query.uri}}
              </td>
              <td @click="cellClicked(props.item[table.headers[1].text])">
                {{props.item[table.headers[1].text]}}
              </td>
              <td @click="cellClicked(props.item[table.headers[2].text])">
                {{props.item[table.headers[2].text]}}
              </td>
            </tr>
            <tr v-else>
              <td>
                {{$route.query.uri.split('#')[1]}}
              </td>
              <td @click="cellClicked(props.item[table.headers[1].text])">
                {{props.item[table.headers[1].text].split('#')[1]}}
              </td>
              <td @click="cellClicked(props.item[table.headers[2].text])">
                {{props.item[table.headers[2].text].split('#')[1]}}
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12">
        <v-data-table
          :headers="table.headers"
          :items="table.predicateResults"
          :items-per-page="10"
        >
          <template v-slot:item="props">
            <tr v-if="prefixON">
              <td @click="cellClicked(props.item[table.headers[0].text])">
                {{props.item[table.headers[0].text]}}
              </td>
              <td>
                {{$route.query.uri}}
              </td>
              <td @click="cellClicked(props.item[table.headers[2].text])">
                {{props.item[table.headers[2].text]}}
              </td>
            </tr>
            <tr v-else>
              <td @click="cellClicked(props.item[table.headers[0].text])">
                {{props.item[table.headers[0].text].split('#')[1]}}
              </td>
              <td>
                {{$route.query.uri.split('#')[1]}}
              </td>
              <td @click="cellClicked(props.item[table.headers[2].text])">
                {{props.item[table.headers[2].text].split('#')[1]}}
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
      <v-col cols="12">
        <v-data-table
          :headers="table.headers"
          :items="table.objectResults"
          :items-per-page="10"
        >
          <template v-slot:item="props">
            <tr v-if="prefixON">
              <td @click="cellClicked(props.item[table.headers[0].text])">
                {{props.item[table.headers[0].text]}}
              </td>
              <td @click="cellClicked(props.item[table.headers[1].text])">
                {{props.item[table.headers[1].text]}}
              </td>
              <td>
                {{$route.query.uri}}
              </td>
            </tr>
            <tr v-else>
              <td @click="cellClicked(props.item[table.headers[0].text])">
                {{props.item[table.headers[0].text].split('#')[1]}}
              </td>
              <td @click="cellClicked(props.item[table.headers[1].text])">
                {{props.item[table.headers[1].text].split('#')[1]}}
              </td>
              <td>
                {{$route.query.uri.split('#')[1]}}
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

export default {
  data: () => ({
    table: {
      headers: [
        // { text: 'column', value: 'column', align: 'left', sortable: false },
        { text: 'subject', value: 'subject' },
        { text: 'predicate', value: 'predicate' },
        { text: 'object', value: 'object' },
      ],
      items: [{column: 'value'}],
      subjectResults: [],
      predicateResults: [],
      objectResults: [],
    },
    prefixON: false,
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

    this.subjectResults(this.$session.get('repoID'), this.$route.query.uri)
    this.predicateResults(this.$session.get('repoID'), this.$route.query.uri)
    this.objectResults(this.$session.get('repoID'), this.$route.query.uri)
  },
  computed: {
    $repo: {
      get: Vuex.mapState(['$repo']).$repo,
      set: Vuex.mapMutations(['update$repo']).update$repo,
    },
  },
  methods: {
    cellClicked(cellInfo) {
      // this.$router.push({query: { uri: this.$route.query.uri }})
      this.$router.push({query: { uri: cellInfo }})
      this.subjectResults(this.$repo.id, this.$route.query.uri)
      this.predicateResults(this.$repo.id, this.$route.query.uri)
      this.objectResults(this.$repo.id, this.$route.query.uri)
    },
    subjectResults(repoID, resource) {
      // this.loading.subject = true
      const url = rdf4j_url+'/rdf4j-server/repositories/'+repoID
      const query = 'select * where { <'+resource+'> ?predicate ?object }'
      axios.post(url, query,
        {headers: {"Content-Type": "application/sparql-query"}})
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
          console.log("FDS subject" + alert)
          // this.alert.subjectFail = true
        })
        // .finally(() => {
        //   this.loading.subject = false
        //   return items
        // })
    },
    predicateResults(repoID, resource) {
      // this.loading.predicate = true
      const url = rdf4j_url+'/rdf4j-server/repositories/'+repoID
      const query = 'select * where { ?subject <'+resource+'> ?object }'
      axios.post(url, query,
        {headers: {"Content-Type": "application/sparql-query"}})
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
    objectResults(repoID, resource) {
      // this.loading.object = true
      const url = rdf4j_url+'/rdf4j-server/repositories/'+repoID
      const query = 'select * where { ?subject ?predicate <'+resource+'> }'
      axios.post(url, query,
        {headers: {"Content-Type": "application/sparql-query"}})
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
        // .finally(() => {
        //   this.loading.query = false
        // })
    },
  }
}
</script>
