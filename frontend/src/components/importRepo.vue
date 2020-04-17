<template>
  <v-row>
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
        label="File to Import (max 200MB)"
      ></v-file-input>
      <v-btn :loading="loading.importFile" block color="success" @click="importRepoFile($repo.id,fileTypeSelected,importFile,addORreplaceSelected)">
        Import Repo (File)
      </v-btn>
      <v-alert text dismissible type="success" v-model="alert.importFileSuccess">
        File Import Successful!!! Updated {{ $repo.name }}
      </v-alert>
      <v-alert text dismissible type="error" v-model="alert.importFileFail">
        File Import Failed... Not Updated {{ $repo.name }}
      </v-alert>
    </v-col>
    <v-col cols="12">
      <v-textarea outlined hide-details class="mb-3"
        v-model="importText"
        label="Import Text"
        placeholder="Import Text"
      ></v-textarea>
      <v-btn :loading="loading.importText" block color="success" @click="importRepoText($repo.id,fileTypeSelected,importText,addORreplaceSelected)">
        Import Repo (Input Text)
      </v-btn>
      <v-alert text dismissible type="success" v-model="alert.importTextSuccess">
        Text Import Successful!!! Updated {{ $repo.name }}
      </v-alert>
      <v-alert text dismissible type="error" v-model="alert.importTextFail">
        Text Import Failed... Not Updated {{ $repo.name }}
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
import Vuex from 'vuex'
import axios from 'axios'

export default {
  data: () => ({
    fileTypeSelected: 'ttl',
    // TODO: confirm if no error exists when importing/exporting from other file types (example rdf-xml)
    fileTypes: [ // TODO: add more
      { text: 'Turtle', value: 'ttl' },
      { text: 'RDF/XML', value: 'rdf-xml' },
      { text: 'Plain Text', value: 'txt' }
    ],
    addORreplaceSelected: 'add',
    addORreplace: [ // TODO: add more
      { text: 'Add to Ontology', value: 'add' },
      { text: 'Replace Ontology', value: 'replace' }
    ],
    importFile: undefined,
    importText: '',
    loading: {
      importFile: false,
      importText: false
    },
    alert: {
      importFileSuccess: false,
      importFileFail: false,
      importTextSuccess: false,
      importTextFail: false
    }
  }),
  computed: {
    $repo: {
      get: Vuex.mapState(['$repo']).$repo,
      set: Vuex.mapMutations(['update$repo']).update$repo
    },
    $backurl: {
      get: Vuex.mapState(['$backurl']).$backurl,
      set: Vuex.mapMutations(['update_backurl']).update_backurl
    },
    backend_url: function () {
      var backend_url = 'http://' + this.$backurl.host + ':' + this.$backurl.port
      return backend_url
    }
  },
  methods: {
    importRepoFile (repoID, fileType, file, addORreplace) {
      this.loading.importFile = true
      var url = this.backend_url + '/api/rdf4j/management/importFile/' + repoID
      var data = file
      var config = {
        headers: { 'Content-Type': 'text/turtle' },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
      switch (fileType) {
        case 'ttl':
          config.headers = { 'Content-Type': 'text/turtle' }
          break
        case 'rdf-xml':
          config.headers = { 'Content-Type': 'application/xml' }
          break
        case 'txt':
          config.headers = { 'Content-Type': 'text/plain' }
          break
        default:
      }
      if (addORreplace === 'add') {
        axios.post(url, data, config)
          .then(response => {
            this.alert.importFileSuccess = true
            this.alert.importFileFail = false
          })
          .catch(error => {
            console.log(error)
            this.alert.importFileFail = true
            this.alert.importFileSuccess = false
          })
          .finally(() => {
            this.loading.importFile = false
          })
      } else {
        axios.put(url, data, config)
          .then(response => {
            this.alert.importFileSuccess = true
            this.alert.importFileFail = false
          })
          .catch(error => {
            console.log(error)
            this.alert.importFileFail = true
            this.alert.importFileSuccess = false
          })
          .finally(() => {
            this.loading.importFile = false
          })
      }
    },
    importRepoText (repoID, fileType, input, addORreplace) {
      this.loading.importText = true
      var url = this.backend_url + '/api/rdf4j/management/importText/' + repoID
      var data = input
      var config = {
        headers: { 'Content-Type': 'text/turtle' },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
      switch (fileType) {
        case 'ttl':
          config.headers = { 'Content-Type': 'text/turtle' }
          break
        case 'rdf-xml':
          config.headers = { 'Content-Type': 'application/xml' }
          break
        case 'txt':
          config.headers = { 'Content-Type': 'text/plain' }
          break
        default:
      }
      // headers = { 'headers': { "Content-Type": "application/x-turtle" }}
      if (addORreplace === 'add') {
        axios.post(url, data, config)
          .then(response => {
            this.alert.importTextSuccess = true
            this.alert.importTextFail = false
          })
          .catch(error => {
            console.log(error)
            this.alert.importTextFail = true
            this.alert.importTextSuccess = false
          })
          .finally(() => {
            this.loading.importText = false
          })
      } else {
        axios.put(url, data, config)
          .then(response => {
            this.alert.importTextSuccess = true
            this.alert.importTextFail = false
          })
          .catch(error => {
            console.log(error)
            this.alert.importTextFail = true
            this.alert.importTextSuccess = false
          })
          .finally(() => {
            this.loading.importText = false
          })
      }
    }
  }
}
</script>
