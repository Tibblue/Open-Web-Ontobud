<template>
  <v-container>
    <v-row>
      <v-col class="grow">
        <v-textarea outlined auto-grow hide-details
          v-model="queryInput"
          rows="6"
          row-height="16"
          label="Query"
          placeholder="Place query and Execute"
        ></v-textarea>
        <v-row>
          <v-col cols="6">
            <v-btn block color="primary" @click="runQuery(queryInput)">
              Run Query
            </v-btn>
          </v-col>
          <v-col cols="6" md="6">
            <!-- TODO: alterar para um dialog box,
                    com a query escrita por default e
                    opçao para query global ou nao, etc -->
            <v-btn block color="primary" @click="saveQuery('meh',queryInput)">
              Save Query (NOT WORKING)
            </v-btn>
          </v-col>
          <!-- <v-col cols="12" md="6">
            <v-text-field dense hide-details
              class="mt-0 py-0"
              v-model="newSavedQueryName"
              label="Query name"
            ></v-text-field>
          </v-col> -->
        </v-row>
        <v-textarea outlined auto-grow readonly hide-details class="mt-3"
          v-model="queryResponse"
          rows="4"
          row-height="16"
          label="Last query response"
          placeholder="Query response"
        ></v-textarea>
        <v-row>
          <v-divider class="ma-3"></v-divider>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn block color="primary" @click="savedQueriesExpand=!savedQueriesExpand">
              <div v-if="savedQueriesExpand==true">
                <span>Hide Saved Queries</span>
                <v-icon right>fas fa-chevron-right</v-icon>
              </div>
              <div v-else>
                <span>Show Saved Queries</span>
                <v-icon right>fas fa-chevron-left</v-icon>
              </div>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-expand-x-transition>
        <v-card flat color="transparent" class="ma-3"
          v-show="savedQueriesExpand"
          width="30%"
        >
          <v-container fluid class="pa-0">
            <v-row>
              <v-col cols="12">
                <v-card flat color="primary mb-3">
                  <v-card-title class="display-1 align-center justify-center pt-2">
                    Saved Queries
                  </v-card-title>
                </v-card>
                <v-card flat color="my-2"
                  v-for="savedQuery in savedQueries"
                  :key="savedQuery.name"
                >
                  <v-card-title
                    class="fill-height align-end"
                    v-text="savedQuery.name"
                  ></v-card-title>
                  <v-card-text v-if="savedQueryExpandedList.includes(savedQuery.name)">
                    <span v-if="!savedQueryEditedList[savedQuery.name]">{{savedQuery.query}}</span>
                    <v-textarea v-else outlined auto-grow hide-details
                      v-model="savedQueryEditedList[savedQuery.name]"
                      rows="6"
                      row-height="16"
                      label="Edited Query"
                    ></v-textarea>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn icon @click="savedQueryExpand(savedQuery.name)">
                      <v-icon left v-if="savedQueryExpandedList.includes(savedQuery.name)">fas fa-chevron-up</v-icon>
                      <v-icon left v-else>fas fa-chevron-down</v-icon>
                    </v-btn>
                    <v-btn icon @click="runQuery(savedQuery.query)">
                      <v-icon>fas fa-copy</v-icon>
                    </v-btn>
                    <div class="flex-grow-1"></div>
                    <v-btn icon @click="runQuery(savedQuery.query)">
                      <v-icon>fas fa-play</v-icon>
                    </v-btn>
                    <v-btn icon v-if="!savedQueryEditedList[savedQuery.name]" @click="savedQueryEdit(savedQuery.name,savedQuery.query)">
                      <v-icon>fas fa-edit</v-icon>
                    </v-btn>
                    <v-btn icon v-else @click="savedQueryEditSave(savedQuery.name,savedQueryEditedList[savedQuery.name])">
                      <v-icon>fas fa-save</v-icon>
                    </v-btn>
                    <v-btn icon @click="deleteSavedQuery(savedQuery.name)">
                      <v-icon>fas fa-trash</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-expand-x-transition>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
const rdf4j_url = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT

export default {
  data: () => ({
    queryInput: "select * where { ?s ?p ?o }\nlimit 20",
    queryResponse: "",
    newSavedQueryName: "",
    savedQueriesExpand: true,
    savedQueries: [ // temporary visual debug
      { name: 'Select All', query: 'select * where { ?s ?p ?o }\nlimit 20' },
      { name: 'Get classes', query: 'SELECT DISTINCT ?type WHERE {\n ?s a ?type.\n}' },
      { name: 'Get classes only', query: 'SELECT DISTINCT ?s WHERE {\n ?s a owl:Class.\n}' },
      { name: 'Get #classes', query: 'SELECT (count(distinct ?class) as ?numberClasses) WHERE {\n ?class a owl:Class.\n}' },
      { name: 'Get #elements per class', query: 'SELECT ?class (COUNT(?class) as ?count) WHERE {\n ?elem a ?class.\n ?class a owl:Class. }\nGROUP BY ?class' },
    ],
    savedQueryExpandedList: [],
    savedQueryEditedList: {},
  }),
  methods: {
    runQuery(query) {
      var repoID = this.$session.get("repoID")
      // var queryEncoded = encodeURIComponent(query)
      // var url = rdf4j_url+'/rdf4j-server/repositories/'+repoID
      // axios.get(url+'?query='+queryEncoded)
      //   .then(response => {
      //     console.log(response.data)
      //     var columnsVars = response.data.head.vars
      //     var resultsData = response.data.results.bindings
      //     resultsData = resultsData.slice(0,100) // limite results
      //     this.queryResponse = "Query SUCCESS \n" + columnsVars + "\n" + resultsData
      //   })
      //   .catch(alert => {
      //     this.queryResponse = "Query FALHOU!!!\n" + alert
      //   })
      var url = rdf4j_url+'/rdf4j-server/repositories/'+repoID
      axios.post(url, query,
        {headers: {"Content-Type": "application/sparql-query"}})
        .then(response => {
          // console.log(response.data) // debug
          // console.log(response.data.head.vars) // debug Nome de Colunas
          // console.log(response.data.results.bindings) // debug resultados
          var columnsVars = response.data.head.vars
          var resultsData = response.data.results.bindings
          this.queryResponse = "Query SUCCESS \n" + columnsVars + "\n"
          resultsData.forEach(element => {
            this.queryResponse += JSON.stringify(element) + '\n'
          });
        })
        .catch(alert => {
          this.queryResponse = "Query FALHOU!!!\n" + alert
        })
    },
    saveQuery(name, query) {
      // var queryEncoded = encodeURIComponent(query)
      const formData = new FormData();
      formData.append('action', 'save');
      formData.append('query-name', "name");
      formData.append('query', "query");
      var language = "SPARQL"
      formData.append('queryLn', language);
      // formData.append('limit_query', limit);
      var url = rdf4j_url+'/rdf4j-workbench/repositories/'+this.$session.get("repoID")+'/query'
      axios.post(url, formData)
        .then(response => {
          console.log(response.data) // debug
          var response = response.data
          this.queryResponse = "Query SUCCESS \n" + JSON.stringify(response)
        })
        .catch(alert => {
          this.queryResponse = "Query FALHOU!!!\n" + alert
        })
    },
    savedQueryExpand(name) {
      if(this.savedQueryExpandedList.includes(name)){
        let index = this.savedQueryExpandedList.indexOf(name)
        this.savedQueryExpandedList.splice(index,1)
      }
      else
        this.savedQueryExpandedList.push(name)
    },
    savedQueryEdit(name,oldQuery) {
      this.savedQueryEditedList[name] = oldQuery
    },
    savedQueryEditSave(name,newQuery) {
      for (let index = 0; index < this.savedQueries.length; index++) {
        if(this.savedQueries[index].name===name){
          this.savedQueries[index].query = newQuery
        }
      }
      delete this.savedQueryEditedList[name]
    },
    deleteSavedQuery(name) { // FIXME
      // TODO add dialog for confirmation
      for (let index = 0; index < this.savedQueries.length; index++) {
        if(this.savedQueries[index].name===name){
          this.savedQueries.splice(index,1)
          return index
        }
      }
      console.log("TODO update when mongo is done, to delete the query in the database")
    },
  }
}
</script>
