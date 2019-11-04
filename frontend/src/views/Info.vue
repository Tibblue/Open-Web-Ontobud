<template>
  <v-container>
    <debug/>
    <v-card flat color="transparent" class="ma-3">
      <v-container fluid class="pa-0">
        <v-row>
          <v-col cols="6">
            <v-card flat color="primary my-2">
              <v-card-title class="display-1 align-center justify-center pt-2">
                Info
              </v-card-title>
            </v-card>
            <v-card flat color="primary my-1">
              <v-card-title class="align-center pt-2">
                Statement Number: {{statementNumber}}
              </v-card-title>
            </v-card>
            <v-card flat color="primary my-1">
              <v-card-title class="align-center pt-2">
                Expansion Ratio: TODO
              </v-card-title>
              <v-card-text>
                <h4>Explicit Statements: {{statementNumber}}</h4>
                <h4>Implicit Statements: TODO</h4>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card flat color="primary my-2">
              <v-card-title class="display-1 align-center justify-center pt-2">
                Existing Classes
              </v-card-title>
            </v-card>
            <v-expansion-panels accordion>
              <v-expansion-panel
                v-for="classe in classes"
                :key="classe.name"
                @click="getClassElems($session.get('repoID'),classe.name)"
              >
                <v-expansion-panel-header>{{classe.name}}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <div v-for="elem in expandedClassElems" :key="elem">
                    {{elem.split("#")[1]}}
                  </div>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import debug from '@/components/debug'
import axios from 'axios'
const rdf4j_url = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT

export default {
  components: {
    debug,
  },
  data: () => ({
    statementNumber: "Loading info...",
    classes: [{name: 'Loading classes...'}],
    expandedClassElems: ["Loading elements..."],
    snackbarDEBUG: false,
  }),
  mounted: async function (){
    // console.log(process.env) // debug
    // console.log(this.$props)
    var currentRepoID = this.$session.get("repoID")
    this.getStatementNumber(currentRepoID)
    this.getClasses(currentRepoID)
  },
  methods: {
    getStatementNumber(repoID) {
      this.statementNumber = "Loading info..."
      axios.get(rdf4j_url+'/rdf4j-server/repositories/'+repoID+'/size')
        .then(response => {
          // console.log(response.data)
          this.statementNumber = response.data
        })
        .catch(alert => {
          this.statementNumber = "Servidor indisponivel...\n" + alert
        })
    },
    getClasses(repoID) {
      this.classes = [{name: 'Loading classes...'}]
      var repoID = this.$session.get("repoID")
      var query = 'SELECT DISTINCT ?class WHERE { ?class a owl:Class. }'
      var url = rdf4j_url+'/rdf4j-server/repositories/'+repoID
      axios.post(url, query,
                {headers: {"Content-Type": "application/sparql-query"}})
        .then(response => {
          // console.log(response.data) // debug
          // console.log(response.data.head.vars) // debug Nome de Colunas
          // console.log(response.data.results.bindings) // debug resultados
          var classArray = []
          var classes = response.data.results.bindings
          classes.forEach(element => {
            classArray.push({'name': element.class.value})
          });
          this.classes = classArray
        })
        .catch(alert => {
          this.classes = [{name: "Get Classes FAIL!!!\n" + alert}]
        })
    },
    getClassElems(repoID, classe) {
      this.expandedClassElems = ["Loading elements..."]
      var repoID = this.$session.get("repoID")
      // var query = 'SELECT DISTINCT ?elem WHERE { ?elem a '+classe+'. }'
      var query = 'PREFIX : <'+classe.split('#')[0]+'#> SELECT DISTINCT ?elem WHERE { ?elem a :'+classe.split('#')[1]+'. }'
      console.log(query)
      var url = rdf4j_url+'/rdf4j-server/repositories/'+repoID
      axios.post(url, query,
                {headers: {"Content-Type": "application/sparql-query"}})
        .then(response => {
          // console.log(response.data) // debug
          // console.log(response.data.head.vars) // debug Nome de Colunas
          // console.log(response.data.results.bindings) // debug resultados
          var elemArray = []
          var elems = response.data.results.bindings
          elems.forEach(element => {
            elemArray.push(element.elem.value)
          });
          this.expandedClassElems = elemArray
        })
        .catch(alert => {
          this.expandedClassElems = ["Get Class Elem FAIL!!!\n" + alert]
        })
    }
  }
}
</script>
