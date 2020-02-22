<template>
  <v-row>
    <v-col cols="8">
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
    <v-col cols="4">
      <v-checkbox hide-details class="mt-0 pt-2"
        v-model="infer"
        label="Inferencing"
        color="primary"
      ></v-checkbox>
    </v-col>
    <v-col cols="12">
      <v-btn :loading="loading.exportFile" block color="success" @click="exportRepoFile($repo.id,fileTypeSelected,infer)" class="mt-3">
        Export Repo (Download File)
      </v-btn>
      <v-alert text dismissible type="error" v-model="alert.exportFileFail">
        File Export Failed...
      </v-alert>
    </v-col>
    <v-col cols="12">
      <v-btn :loading="loading.exportText" block color="success" @click="exportRepoText($repo.id,fileTypeSelected,infer)">
        Export Repo (InScreen Text)
      </v-btn>
      <v-alert text dismissible type="error" v-model="alert.exportTextFail">
        Text Export Failed...
      </v-alert>
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
const backend_url = "http://"+process.env.VUE_APP_BACKEND_HOST+":"+process.env.VUE_APP_BACKEND_PORT
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
    infer: true,
    exportResponse: "",
    loading: {
      exportFile: false,
      exportText: false,
    },
    alert: {
      exportFileFail: false,
      exportTextFail: false,
    },
  }),
  computed: {
    $repo: {
      get: Vuex.mapState(['$repo']).$repo,
      set: Vuex.mapMutations(['update$repo']).update$repo,
    },
  },
  methods: {
    exportRepoFile(repoID, fileType, infer) {
      this.loading.exportFile = true
      var url = backend_url+'/api/rdf4j/management/export/'+repoID
      var headers = {}
      headers['params'] = { 'infer': infer}
      switch(fileType){
        case 'ttl':
          headers['headers'] = { Accept: "text/turtle" }
          break;
        case 'rdf-xml':
          fileType = "xml"
          break;
        case 'txt':
          headers['headers'] = { Accept: "text/plain" }
          break;
        default:
      }
      axios.get(url, headers)
        .then(response => {
          FileDownload(response.data, 'export.'+fileType)
        })
        .catch(alert => {
          this.alert.exportFileFail = true
        })
        .finally(() => {
          this.loading.exportFile = false
        })
    },
    exportRepoText(repoID, fileType, infer) {
      this.loading.exportText = true
      var url = backend_url+'/api/rdf4j/management/export/'+repoID
      var headers = {}
      headers['params'] = { 'infer': infer}
      switch(fileType){
        case 'ttl':
          headers['headers'] = { Accept: "text/turtle" }
          break;
        case 'rdf-xml':
          fileType = "xml"
          break;
        case 'txt':
          headers['headers'] = { Accept: "text/plain" }
          break;
        default:
      }
      axios.get(url, headers)
        .then(response => {
          // FIXME: needs visual upgrades
          this.exportResponse = response.data
        })
        .catch(alert => {
          this.alert.exportTextFail = true
        })
        .finally(() => {
          this.loading.exportText = false
        })
    },
  },
};
</script>
