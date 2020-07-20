<template>
  <v-col class="pa-0">
    <v-row dense>
      <v-col cols="12">
        <v-btn block color="primary" @click="sparqlHelpExpand=!sparqlHelpExpand">
          <div v-if="sparqlHelpExpand==true">
            <span>Hide SPARQL Help</span>
            <v-icon right>fas fa-chevron-up</v-icon>
          </div>
          <div v-else>
            <span>Show SPARQL Help</span>
            <v-icon right>fas fa-chevron-down</v-icon>
          </div>
        </v-btn>
      </v-col>
    </v-row>
    <v-expand-transition>
      <v-card class="mb-2" v-show="sparqlHelpExpand">
        <v-container class="mt-1 pa-2">
          <v-row dense align="center">
            <v-col class="grow">
              <p class="text-center text-h3 text-md-h2 font-weight-bold">SPARQL Help</p>
              <p class="text-subtitle-1 text-md-h6 mb-2">
                <span class="font-weight-bold">
                  SPARQL 1.1 Specification (W3C Recomendations):
                </span>
                <a target="_blank" href="https://www.w3.org/TR/sparql11-query/"
                  class="text-decoration-none"
                >
                  https://www.w3.org/TR/sparql11-query/
                </a>
              </p>
              <p class="text-subtitle-1 text-md-h6 mb-2">
                <span class="font-weight-bold">
                  SPARQL Introduction in 11 minutes (video):
                </span>
                <a target="_blank" href="https://www.youtube.com/watch?v=FvGndkpa4K0"
                  class="text-decoration-none"
                >
                  https://www.youtube.com/watch?v=FvGndkpa4K0
                </a>
              </p>
              <p class="text-subtitle-1 text-md-h6 mb-2">
                <span class="font-weight-bold">
                  SPARQL Introduction:
                </span>
                <a target="_blank" href="http://www.macs.hw.ac.uk/SWeL/tag/sparql-for-dummies/"
                  class="text-decoration-none"
                >
                  http://www.macs.hw.ac.uk/SWeL/tag/sparql-for-dummies/
                </a>
              </p>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-expand-transition>
  </v-col>
</template>

<script>
// import Vuex from 'vuex'

export default {
  data: () => ({
    sparqlHelpExpand: false
  })
  // mounted: async function () {
  // },
  // computed: {
  //   $repo: {
  //     get: Vuex.mapState(['$repo']).$repo,
  //     set: Vuex.mapMutations(['update$repo']).update$repo
  //   },
  //   $backurl: {
  //     get: Vuex.mapState(['$backurl']).$backurl,
  //     set: Vuex.mapMutations(['update_backurl']).update_backurl
  //   },
  //   backendURL: function () {
  //     var backendURL = 'http://' + this.$backurl.host + ':' + this.$backurl.port
  //     return backendURL
  //   },
  // }
}
</script>
