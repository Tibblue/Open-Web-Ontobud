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
              <v-card-text>
                <h4>Explicit Statements: TODO</h4>
                <h4>Implicit Statements: TODO</h4>
              </v-card-text>
            </v-card>
            <v-card flat color="primary my-1">
              <v-card-title class="align-center pt-2">
                Expansion Ratio: TODO
              </v-card-title>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card flat color="primary my-2">
              <v-card-title class="display-1 align-center justify-center pt-2">
                Existing Classes
              </v-card-title>
            </v-card>
            <v-card flat color="primary my-1">
              <v-card-title class="align-center pt-2">
                Statement Number: {{statementNumber}}
              </v-card-title>
              <v-card-text>
                <h4>Explicit Statements: TODO</h4>
              </v-card-text>
            </v-card>
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
    snackbarDEBUG: false,
  }),
  mounted: async function (){
    // console.log(process.env) // debug
    // console.log(this.$props)
    this.getStatementNumber(this.$session.get("repoID"))
  },
  methods: {
    getStatementNumber(repoID) {
      axios.get(rdf4j_url+'/rdf4j-server/repositories/'+repoID+'/size')
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
