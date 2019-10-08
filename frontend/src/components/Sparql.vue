<template>
  <v-container>
        <!-- <v-btn color="primary">
          {{this.$props}}
        </v-btn> -->
        <v-btn color="primary">
          {{this.$route.query}}
        </v-btn>
    <v-row>
      <v-col cols="2">
        <v-row
          align-content="space-between"
          justify="space-between"
        >
          <v-btn block color="primary" @click="runQuery(queryInput)">
            Run Query
          </v-btn>
          <v-btn block color="primary" @click="saveQuery('meh',queryInput)">
            Save Query (NOT WORKING)
          </v-btn>
        </v-row>
      </v-col>
      <v-col>
        <v-textarea outlined auto-grow
          v-model="queryInput"
          rows="6"
          row-height="16"
          label="Query"
          placeholder="Place query and Execute"
        ></v-textarea>
        <v-textarea outlined auto-grow readonly class="mt-3"
          v-model="queryResponse"
          rows="4"
          row-height="16"
          label="Last query response"
          placeholder="Query response"
        ></v-textarea>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
const rdf4j_url = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT

export default {
  // props: ["repo"],
  data: () => ({
    selectedRepo: "Loading Repositories",
    queryInput: "",
    queryResponse: "",
  }),
  methods: {
    replaceURL(repo) {
      // console.log(this.$route)
      // this.$router.replace('?repo='+repo)
      this.$router.replace({ query: { repo: repo } })
    },
    runQuery: function (query) {
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
          console.log(response.data)
          var columnsVars = response.data.head.vars
          var resultsData = response.data.results.bindings
          this.queryResponse = "Query SUCCESS \n" + columnsVars + "\n" + resultsData
        })
        .catch(alert => {
          this.queryResponse = "Query FALHOU!!!\n" + alert
        })
    },
    saveQuery: function (name, query) {
      // var queryEncoded = encodeURIComponent(query)
      const formData = new FormData();
      formData.append('action', 'save');
      formData.append('query-name', "name");
      formData.append('query', "query");
      // formData.append('query', queryFile);
      var language = "SPARQL"
      formData.append('queryLn', language);
      // formData.append('limit_query', limit);
      var url = rdf4j_url+'/rdf4j-workbench/repositories/'+this.$session.get("repoID")+'/query'
      axios.post(url, formData)
        .then(response => {
          console.log(response.data)
          var response = response.data
          this.queryResponse = "Query SUCCESS \n" + JSON.stringify(response)
        })
        .catch(alert => {
          this.queryResponse = "Query FALHOU!!!\n" + alert
        })
    },
  }
}
</script>

<style>

</style>
