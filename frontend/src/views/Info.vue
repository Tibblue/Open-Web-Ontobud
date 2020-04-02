<template>
  <v-container>
    <alerts/>
    <v-card flat color="transparent" class="ma-3">
      <v-container fluid class="pa-0">
        <v-row>
          <v-col cols="12" lg="6">
            <v-expansion-panels :value="0">
              <v-expansion-panel>
                <v-expansion-panel-header :style="expansionPanelCSS">
                  <v-row no-gutters align="center">
                    <v-col class="grow">
                      <span class="display-1 align-center pa-0">
                        Statements
                      </span>
                    </v-col>
                    <v-col class="mx-3 shrink">
                      <div v-if="loading.statements">
                        <v-icon>fas fa-spinner fa-spin</v-icon>
                        <!-- <v-icon>mdi-loading mdi-spin</v-icon> -->
                      </div>
                      <div v-else>
                        <div v-if="alert.statements">
                          <v-icon>fas fa-times-circle</v-icon>
                        </div>
                        <!-- <div v-else>
                          <v-icon>fas fa-check-circle</v-icon>
                        </div> -->
                      </div>
                    </v-col>
                  </v-row>
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
                  <v-row no-gutters align="center">
                    <v-col class="grow">
                      <span class="display-1 align-center pa-0">
                        Namespaces
                      </span>
                    </v-col>
                    <v-col class="mx-3 shrink">
                      <div v-if="loading.namespaces">
                        <v-icon>fas fa-spinner fa-spin</v-icon>
                        <!-- <v-icon>mdi-loading mdi-spin</v-icon> -->
                      </div>
                      <div v-else>
                        <div v-if="alert.namespaces">
                          <v-icon>fas fa-times-circle</v-icon>
                        </div>
                        <!-- <div v-else>
                          <v-icon>fas fa-check-circle</v-icon>
                        </div> -->
                      </div>
                    </v-col>
                  </v-row>
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
                  <v-row no-gutters align="center">
                    <v-col class="grow">
                      <span class="display-1 align-center pa-0">
                        Existing Classes
                      </span>
                    </v-col>
                    <v-col class="mx-3 shrink">
                      <div v-if="loading.classes">
                        <v-icon>fas fa-spinner fa-spin</v-icon>
                        <!-- <v-icon>mdi-loading mdi-spin</v-icon> -->
                      </div>
                      <div v-else>
                        <div v-if="alert.classes">
                          <v-icon>fas fa-times-circle</v-icon>
                        </div>
                        <div v-else>
                          <v-icon v-if="noClasses">fas fa-minus-circle</v-icon>
                          <!-- <v-icon v-else>fas fa-check-circle</v-icon> -->
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-expansion-panels accordion focusable>
                    <v-expansion-panel
                      v-for="classe in classes"
                      :key="classe.name"
                      :disabled="noClasses"
                      @click="getClassElems($session.get('repoID'),classe.name)"
                    >
                      <v-expansion-panel-header>
                        <v-row no-gutters align="center">
                          <v-col class="grow">
                            {{classe.name}}
                          </v-col>
                          <v-col class="mx-3 shrink text--secondary">
                            {{classe.count}}
                          </v-col>
                        </v-row>
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-card>
                          <v-row dense justify="center">
                            <v-col class="shrink"
                              v-for="elem in expandedClassElems.slice(0,elemsShown)"
                              :key="elem"
                            >
                              <v-card flat hover
                                color="grey darken-3"
                                @click="elemClicked(elem)"
                              >
                                <v-col class="px-2 py-1">
                                  {{elem.split("#")[1]}}
                                </v-col>
                              </v-card>
                            </v-col>
                          </v-row>
                          <v-row dense
                            v-if="elemsShown < expandedClassElems.length"
                          >
                            <v-col>
                              <v-btn block color="primary"
                                @click="elemsShown+=50"
                              >
                                Show 50 More
                              </v-btn>
                            </v-col>
                            <v-col>
                              <v-btn block color="primary"
                                @click="elemsShown+=500"
                              >
                                Show 500 More
                              </v-btn>
                            </v-col>
                          </v-row>
                        </v-card>
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
import alerts from '@/components/alerts'
import axios from 'axios'
const qs = require('querystring')
const backend_url = "http://"+process.env.VUE_APP_BACKEND_HOST+":"+process.env.VUE_APP_BACKEND_PORT

export default {
  components: {
    alerts,
  },
  data: () => ({
    explicitStatementsNumber: "Loading info...",
    implicitStatementsNumber: "Loading info...",
    expansionRatio: "Loading info...",
    namespaces: [{prefix: 'Loading namespaces...', namespace: 'Wait a moment :)'}],
    classes: [{name: 'Loading classes...', count: '0'}],
    expandedClassElems: ["Loading elements..."],
    elemsShown: 50,
    noClasses: false,
    alert: {
      statements: false,
      namespaces: false,
      classes: false,
    },
    loading: {
      statements: false,
      namespaces: false,
      classes: false,
    },
  }),
  mounted: async function (){
    // console.log(process.env) // debug
    this.getStatementNumber(this.$session.get("repoID"))
    this.getNamespaces(this.$session.get("repoID"))
    this.getClasses(this.$session.get("repoID"))
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
      this.loading.statements = true
      this.explicitStatementsNumber = "Loading info..."
      axios.get(backend_url+'/api/rdf4j/repository/'+repoID+'/triples')
        .then(response => {
          // console.log(response.data)
          this.explicitStatementsNumber = response.data.explicit
          this.implicitStatementsNumber = response.data.implicit
          this.expansionRatio = response.data.expansion || 0
          this.error.statements = true
        })
        .catch(error => {
          // console.log(error.response)
          this.error.statements = true
          this.explicitStatementsNumber = "Request failed..."
          this.implicitStatementsNumber = "Request failed..."
          this.expansionRatio = "Request failed..."
        })
        .finally(() => {
          this.loading.statements = false
        })
    },
    getNamespaces(repoID) {
      this.loading.namespaces = true
      this.namespaces = [{prefix: 'Loading namespaces...', namespace: 'Wait a moment :)'}]
      axios.get(backend_url+'/api/rdf4j/repository/'+repoID+'/namespaces')
        .then(response => {
          // console.log(response.data)
          var elemsAux = []
          var elems = response.data
          elems.forEach(element => {
            elemsAux.push({'prefix': element.prefix.value, 'namespace': element.namespace.value})
          });
          this.namespaces = elemsAux
          this.error.namespaces = false
        })
        .catch(error => {
          // console.log(error.response)
          this.error.namespaces = true
          this.namespaces = [{prefix: 'Get Namespaces Failed!', namespace: error}]
        })
        .finally(() => {
          this.loading.namespaces = false
        })
    },
    getClasses(repoID) {
      this.loading.classes = true
      this.classes = [{name: 'Loading classes...'}]
      var repoID = this.$session.get("repoID")
      // var query = 'SELECT ?class (COUNT(?class) as ?count) WHERE { ?elem a ?class. ?class a owl:Class. } GROUP BY ?class' // select class and its count
      var query = 'SELECT ?class (COUNT(?class) as ?count) WHERE { ?elem a ?class. ?class a owl:Class. FILTER (!isBlank(?class))} GROUP BY ?class' // select class and its count (without blank_nodes)
      var url = backend_url+'/api/rdf4j/query/'+repoID
      const config = {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
      axios.post(url, qs.stringify({'query': query}), config)
        .then(response => {
          // console.log(response.data) // debug
          var classesAux = []
          var classes = response.data.results.bindings
          if (classes.length==1) {
            this.noClasses = true
            this.classes = [{name: 'No classes exist in this Repository'}]
          }
          else {
            this.noClasses = false
            classes.forEach(element => {
              classesAux.push({'name': element.class.value, 'count': element.count.value})
            });
            this.classes = classesAux
          }
          this.alert.classes = false
        })
        .catch(error => {
          // console.log(error.response)
          this.error.classes = true
          this.classes = [{name: "Get Classes Failed!"}]
        })
        .finally(() => {
          this.loading.classes = false
        })
    },
    getClassElems(repoID, classe) {
      this.expandedClassElems = ["Loading elements..."]
      this.elemsShown = 50
      var repoID = this.$session.get("repoID")
      var query = 'SELECT DISTINCT ?elem WHERE { ?elem a <'+classe+'>. }' // no cap
      // var query = 'SELECT DISTINCT ?elem WHERE { ?elem a <'+classe+'>. } LIMIT 100' // soft cap
      var url = backend_url+'/api/rdf4j/query/'+repoID
      const config = {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
      axios.post(url, qs.stringify({'query': query}), config)
        .then(response => {
          // console.log(response.data) // debug
          var elemsAux = []
          var elems = response.data.results.bindings
          elems.forEach(element => {
            elemsAux.push(element.elem.value)
          });
          this.expandedClassElems = elemsAux
        })
        .catch(error => {
          this.expandedClassElems = ["Get Class Elements Failed!\n" + error]
        })
    },
    elemClicked(uri) {
      this.$router.push({path: "resource", query: { uri: uri }})
    },
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
