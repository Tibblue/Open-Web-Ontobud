<template>
  <v-row>
    <v-col cols="12">
      <v-radio-group hide-details v-model="fileTypeSelected">
        <v-radio
          v-for="type in fileTypes"
          :key="type.value"
          :label="type.text"
          :value="type.value"
          color="success"
        ></v-radio>
      </v-radio-group>
    </v-col>
    <v-col cols="12" xl="6">
      <v-btn block color="success" @click="exportRepo($repo.id,fileTypeSelected,'download')">
        Export Repo (Download File)
      </v-btn>
    </v-col>
    <v-col cols="12" xl="6">
      <v-btn block color="success" @click="exportRepo($repo.id,fileTypeSelected,'tab')">
        Export Repo (InScreen Text)
      </v-btn>
    </v-col>
    <v-col cols="12">
      <v-textarea outlined auto-grow readonly hide-details class="mt-3"
        v-model="exportResponse"
        label="InScreen Text"
        placeholder="InScreen Text"
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
    fileTypeSelected: "ttl",
    fileTypes: [ // TODO: add more
      { text: 'Turtle', value: 'ttl' },
      { text: 'RDF/XML', value: 'rdf-xml' },
      { text: 'Plain Text', value: 'txt' },
    ],
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
        case 'ttl':
          headers = { 'headers' :{
            Accept: "text/turtle"
          }}
          break;
        case 'rdf-xml':
          fileType = "xml"
          break;
        case 'txt':
          headers = { 'headers' :{
            Accept: "text/plain"
          }}
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
