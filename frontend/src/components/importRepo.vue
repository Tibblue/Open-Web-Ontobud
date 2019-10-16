<template>
  <v-row>
    <v-col cols="12">
      <v-text-field readonly outlined hide-details class="mt-3"
        v-model="importResponse"
        label="Import Response"
        placeholder="Import Response"
        ></v-text-field>
    </v-col>
    <v-col cols="6">
      <v-radio-group hide-details v-model="fileTypeSelected" class="ma-0 pa-0">
        <v-radio
          v-for="type in fileTypes"
          :key="type.value"
          :label="type.text"
          :value="type.value"
          color="success"
        ></v-radio>
      </v-radio-group>
    </v-col>
    <v-col cols="6">
      <v-radio-group hide-details v-model="addORreplaceSelected" class="ma-0 pa-0">
        <v-radio
          v-for="option in addORreplace"
          :key="option.value"
          :label="option.text"
          :value="option.value"
          color="success"
        ></v-radio>
      </v-radio-group>
    </v-col>
    <v-col cols="12">
      <v-file-input outlined show-size clearable hide-details class="my-2"
        v-model="importFile"
        label="File to Import"
      ></v-file-input>
      <v-btn block color="success" @click="importRepoFile($repo.id,fileTypeSelected,importFile,addORreplaceSelected)">
        Import Repo (File)
      </v-btn>
    </v-col>
    <v-col cols="12">
      <v-textarea outlined hide-details class="mb-3"
        v-model="importText"
        label="Import Text"
        placeholder="Import Text"
        ></v-textarea>
      <v-btn block color="success" @click="importRepoInput($repo.id,fileTypeSelected,importText,addORreplaceSelected)">
        Import Repo (Input Text)
      </v-btn>
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
    // TODO: confirm if no error exists when importing/exporting from other file types (example rdf-xml)
    fileTypes: [ // TODO: add more
      { text: 'Turtle', value: 'ttl' },
      { text: 'RDF/XML', value: 'rdf-xml' },
      { text: 'Plain Text', value: 'txt' },
    ],
    addORreplaceSelected: 'add',
    addORreplace: [ // TODO: add more
      { text: 'Add to Ontology', value: 'add' },
      { text: 'Replace Ontology', value: 'replace' },
    ],
    importFile: undefined,
    importText: "",
    importResponse: "",
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
    importRepoFile(repoID, fileType, file, addORreplace) {
      var url = rdf4j_url+'/rdf4j-server/repositories/'+repoID+'/statements'
      var data = file
      var headers = { 'headers' :{}}
      switch(fileType){
        case 'ttl':
          headers = { 'headers': { "Content-Type": "text/turtle" }}
          break;
        case 'rdf-xml':
          fileType = "xml"
          break;
        case 'txt':
          headers = { 'headers': { "Content-Type": "text/plain" }}
          break;
        default:
      }
      if(addORreplace==='add')
        axios.post(url, data, headers)
          .then(response => {
            this.importResponse = "Import (Add) Success!" + response.data
          })
          .catch(alert => {
            this.importResponse = "Import (Add) Failed..." + alert
          })
      else
        axios.put(url, data, headers)
          .then(response => {
            this.importResponse = "Import (Replace) Success!" + response.data
          })
          .catch(alert => {
            this.importResponse = "Import (Replace) Failed..." + alert
          })
    },
    importRepoInput(repoID, fileType, input, addORreplace) {
      var url = rdf4j_url+'/rdf4j-server/repositories/'+repoID+'/statements'
      var data = input
      var headers = { 'headers' :{}}
      switch(fileType){
        case 'ttl':
          headers = { 'headers': { "Content-Type": "text/turtle" }}
          break;
        case 'rdf-xml':
          fileType = "xml"
          break;
        case 'txt':
          headers = { 'headers': { "Content-Type": "text/plain" }}
          break;
        default:
      }
      // headers = { 'headers': { "Content-Type": "application/x-turtle" }}
      if(addORreplace==='add')
        axios.post(url, data, headers)
          .then(response => {
            this.importResponse = "Import (Add) Success!" + response.data
          })
          .catch(alert => {
            this.importResponse = "Import (Add) Failed..." + alert
          })
      else
        axios.put(url, data, headers)
          .then(response => {
            this.importResponse = "Import (Replace) Success!" + response.data
          })
          .catch(alert => {
            this.importResponse = "Import (Replace) Failed..." + alert
          })
    },
  },
};
</script>
