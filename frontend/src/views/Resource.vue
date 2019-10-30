<template>
  <v-container>
    <v-row>
      <v-col>
        <h2>Resource: {{this.$route.query.uri.split('#')[1]}}</h2>
        <h3>{{$route.query.uri}}</h3>
      </v-col>
      <v-col cols="12">
        <v-data-table
          :headers="table.headers"
          :items="subject.items"
          :items-per-page="10"
        >
          <template v-slot:item="props">
            <tr>
              <td @click="cellClicked($route.query.uri)">
                {{$route.query.uri}}
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
    queryInput: "select * where { ?s ?p ?o }\nlimit 20",
    queryResponse: "",
    table: {
      headers: [
        // { text: 'column', value: 'column', align: 'left', sortable: false },
        { text: 'subject', value: 'subject' },
        { text: 'predicate', value: 'predicate' },
        { text: 'object', value: 'object' },
      ],
      items: [{column: 'value'}],
    },
    subject: {
      headers: [],
      items: [],
    },
  }),
  mounted: async function (){
    // console.log(process.env) // debug
    var currentUserEmail = 'kiko@kiko' // FIXME: use loged user

    this.subjectResults(this.$session.get('repoID'), this.$route.query.uri)
    // this.predicateResults(this.$repo.id, this.$route.query.uri)
    // this.objectResults(this.$repo.id, this.$route.query.uri)
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
      // this.predicateResults(this.$repo.id, this.$route.query.uri)
      // this.objectResults(this.$repo.id, this.$route.query.uri)
    },
    subjectResults(repoID, resource) {
      // this.loading.subject = true
      const url = rdf4j_url+'/rdf4j-server/repositories/'+repoID
      const query = 'select * where { <'+resource+'> ?predicate ?object }'
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

          this.subject.headers = []
          columnsVars.forEach(element => {
            this.subject.headers.push({'text': element, 'value': element})
          });
          this.subject.items = []
          resultsData.forEach(element => {
            var elemAux = {}
            for(const key in element){
              elemAux[key] = element[key].value
            }
            this.subject.items.push(elemAux)
          });
        })
        .catch(alert => {
          console.log("<FDS" + alert)
          // this.alert.subjectFail = true
        })
        // .finally(() => {
        //   this.loading.subject = false
        //   return (headers, items)
        // })
    },
  }
}
</script>
