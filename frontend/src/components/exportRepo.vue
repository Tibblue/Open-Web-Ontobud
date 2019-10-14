<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-btn block color="success" @click="exportRepo($repo.id,'ttl','download')">
        Export Repo (Download File)
      </v-btn>
    </v-col>
    <v-col cols="12" md="6">
      <v-btn block color="success" @click="exportRepo($repo.id,'ttl','tab')">
        Export Repo (InScreen Text)
      </v-btn>
    </v-col>
    <v-col cols="12">
      <v-textarea outlined auto-grow readonly hide-details class="mt-3"
        v-model="exportResponse"
        label="Response"
        placeholder="Response to the request"
        ></v-textarea>
    </v-col>
  </v-row>
</template>

<script>
import Vuex from 'vuex'
import axios from 'axios'
const rdf4j_url = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT
const FileDownload = require('js-file-download')

export default {
  data: () => ({
    exportResponse: "",
  }),
  mounted: async function (){
    // console.log(process.env) # debug
    // this.getRepositories()
  },
  computed: {
    $repo: {
      get: Vuex.mapState(['$repo']).$repo,
      set: Vuex.mapMutations(['update$repo']).update$repo,
    },
  },
  methods: {
    exportRepo(repoID, fileType, exportType) {
      // fileType="text"
      var url = rdf4j_url+'/rdf4j-server/repositories/'+repoID+'/statements'
      var headers = { 'headers' :{}}
      switch(fileType){
        case 'txt':
          headers = { 'headers' :{
            Accept: "text/plain"
          }}
          break;
        case 'ttl':
          headers = { 'headers' :{
            Accept: "text/turtle"
          }}
          break;
        case 'rdf-xml':
          fileType = "xml"
          break;
        default:
      }
      axios.get(url, headers)
        .then(response => {
          if(exportType=='download')
            FileDownload(response.data, 'export.'+fileType)
          else{
            // FIXME needs upgrades
            this.exportResponse = response.data
          }
        })
        .catch(alert => {
          this.exportResponse = "Export Failed!!! " + alert
        })
    },
  },
};
</script>
