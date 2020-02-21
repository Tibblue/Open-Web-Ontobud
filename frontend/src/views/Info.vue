<template>
  <v-container>
    <v-card flat color="transparent" class="ma-3">
      <v-container fluid class="pa-0">
        <v-row>
          <v-col cols="12" lg="6">
            <v-expansion-panels :value="0">
              <v-expansion-panel>
                <v-expansion-panel-header :style="expansionPanelCSS">
                  <span class="display-1 align-center pa-0">
                    Statements
                  </span>
                </v-expansion-panel-header>
                <v-expansion-panel-content class="px-4 py-2">
                    <v-card-title class="align-center pt-2">
                      Triples: {{explicitStatementsNumber + implicitStatementsNumber}}
                    </v-card-title>
                    <v-card-text>
                      <h4>Explicit Statements: {{explicitStatementsNumber}}</h4>
                      <h4>Implicit Statements: {{implicitStatementsNumber}}</h4>
                    </v-card-text>
                    <v-card-title class="align-center pt-2">
                      Expansion Ratio: {{expansionRatio}}
                    </v-card-title>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <v-expansion-panels :value="0" class="pt-6">
              <v-expansion-panel>
                <v-expansion-panel-header :style="expansionPanelCSS">
                  <span class="display-1 align-center pa-0">
                    Namespaces
                  </span>
                </v-expansion-panel-header>
                <v-expansion-panel-content class="px-4 py-2">
                  <p class="mb-0"
                    v-for="namespace in namespaces"
                    :key="namespace.prefix"
                  >
                    <span class="headline"><b>
                      {{namespace.prefix}}:
                    </b></span>
                    {{namespace.namespace}}
                  </p>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
          <v-col cols="12" lg="6">
            <v-expansion-panels accordion :value="0">
              <v-expansion-panel>
                <v-expansion-panel-header :style="expansionPanelCSS">
                  <span class="display-1 align-center pa-0">
                    Existing Classes
                  </span>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-expansion-panels accordion focusable>
                    <v-expansion-panel
                      v-for="classe in classes"
                      :key="classe.name"
                      @click="getClassElems($session.get('repoID'),classe.name)"
                    >
                      <v-expansion-panel-header>{{classe.name}}</v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <ul>
                          <li v-for="elem in expandedClassElems" :key="elem">
                            {{elem.split("#")[1]}}
                          </li>
                        </ul>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
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
import axios from 'axios'
const qs = require('querystring')
const backend_url = "http://"+process.env.VUE_APP_URL+":"+process.env.VUE_APP_BACKEND_PORT

export default {
  data: () => ({
    currentRepoID: "",
    explicitStatementsNumber: "Loading info...",
    implicitStatementsNumber: "Loading info...",
    expansionRatio: "Loading info...",
    namespaces: [{prefix: 'Loading namespaces...', namespace: 'Wait a moment :)'}],
    classes: [{name: 'Loading classes...'}],
    expandedClassElems: ["Loading elements..."],
  }),
  mounted: async function (){
    // console.log(process.env) // debug
    this.currentRepoID = this.$session.get("repoID")
    this.getStatementNumber(this.currentRepoID)
    this.getNamespaces(this.currentRepoID)
    this.getClasses(this.currentRepoID)
  },
  computed: {
    expansionPanelCSS() {
      if(this.$vuetify.theme.dark)
        var primaryColor = "#2196F3"
      else
        var primaryColor = "#1976D2"
      return {
        '--primary-color': primaryColor,
      }
    }
  },
  methods: {
    getStatementNumber(repoID) {
      this.explicitStatementsNumber = "Loading info..."
      axios.get(backend_url+'/api/rdf4j/repository/'+repoID+'/triples')
        .then(response => {
          // console.log(response.data)
          this.explicitStatementsNumber = response.data.explicit
          this.implicitStatementsNumber = response.data.implicit
          this.expansionRatio = response.data.expansion || 0
        })
        .catch(alert => {
          this.explicitStatementsNumber = "Servidor indisponivel...\n" + alert
          this.implicitStatementsNumber = "Servidor indisponivel...\n" + alert
          this.expansionRatio = "Servidor indisponivel...\n" + alert
        })
    },
    getNamespaces(repoID) {
      this.namespaces = [{prefix: 'Loading namespaces...', namespace: 'Wait a moment :)'}]
      axios.get(backend_url+'/api/rdf4j/repository/'+repoID+'/namespaces')
        .then(response => {
          // console.log(response.data)
          var elemArray = []
          var elems = response.data
          elems.forEach(element => {
            elemArray.push({'prefix': element.prefix.value, 'namespace': element.namespace.value})
          });
          this.namespaces = elemArray
        })
        .catch(alert => {
          this.namespaces = [{prefix: 'Get Namespaces FAIL!!!', namespace: alert}]
        })
    },
    getClasses(repoID) {
      this.classes = [{name: 'Loading classes...'}]
      var repoID = this.$session.get("repoID")
      var query = 'SELECT DISTINCT ?class WHERE { ?class a owl:Class. }'
      var url = backend_url+'/api/rdf4j/query/'+repoID
      axios.post(url, qs.stringify({'query': query}),
        {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
        .then(response => {
          // console.log(response.data) // debug
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
      var query = 'SELECT DISTINCT ?elem WHERE { ?elem a <'+classe+'>. }'
      var url = backend_url+'/api/rdf4j/query/'+repoID
      axios.post(url, qs.stringify({'query': query}),
        {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
        .then(response => {
          // console.log(response.data) // debug
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

<style>
.v-expansion-panel-content__wrap {
  padding: 0px;
}
.v-expansion-panel-header {
  background-color: var(--primary-color);
}
</style>