<template>
  <v-container>
        <div class="text-center">
          <v-btn color="info" @click="snackbarDEBUG=true">
            Confirm current repo (DEBUG)
          </v-btn>
          <v-snackbar top v-model="snackbarDEBUG">
            {{ this.$session.get("repoName") }} - {{ this.$session.get("repoID") }}
            <v-btn @click="snackbarDEBUG=false">Close</v-btn>
          </v-snackbar>
        </div>

    <v-card flat color="transparent" class="ma-3">
      <v-container fluid class="pa-0">
        <v-row>
          <v-col cols="12">
            <v-card flat color="primary">
              <v-card-title class="display-1 align-center justify-center pt-2">
                Info
              </v-card-title>
            </v-card>
            <v-card flat color="primary">
              <v-card-title class="display-1 align-center justify-center pt-2">
                Statement Number: {{statementNumber}}
              </v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios'
const rdf4j_url = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT

export default {
  data: () => ({
    statementNumber: "Loading info...",
    snackbarDEBUG: false,
  }),
  mounted: async function (){
    // console.log(process.env) // debug
    // console.log(this.$props)
    this.getStatementNumber()
  },
  methods: {
    getStatementNumber() {
      axios.get(rdf4j_url+'/rdf4j-server/repositories/'+this.$session.get("repoID")+'/size')
        .then(response => {
          // console.log(response.data)
          this.statementNumber = response.data
        })
        .catch(alert => {
          this.statementNumber = "Servidor indisponivel...\n" + alert
        })
    },
  }
}
</script>
