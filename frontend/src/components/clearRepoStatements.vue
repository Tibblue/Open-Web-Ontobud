<template>
  <v-row>
    <v-col cols="12">
      <v-btn color="warning" @click="clearStatements($session.get('repoID'))">
        Clear Repo Statements
      </v-btn>
    </v-col>
    <v-col cols="12">
      <v-text-field readonly outlined hide-details
        v-model="clearResponse"
        label="Response"
        placeholder="Response to the request"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
const rdf4j_url = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT

export default {
  data: () => ({
    // repoID: "",
    clearResponse: "",
  }),
  mounted: async function (){
    // console.log(process.env) # debug
    // this.getRepositories()
  },
  methods: {
    clearStatements(repoID) {
      axios.delete(rdf4j_url+'/rdf4j-server/repositories/'+repoID+'/statements')
        .then(response => {
          this.clearResponse = "Cleared " + repoID + " with SUCCESS" + response.data
        })
        .catch(alert => {
          this.clearResponse = "Clear Failed!!! " + alert
        })
    },
  },
};
</script>
