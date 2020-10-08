<template>
  <v-row dense>
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
      <v-tabs grow background-color="darken-1 green" color="white">
        <v-tab>Import File</v-tab>
        <v-tab>Import Raw Text</v-tab>

        <v-tab-item>
          <v-col cols="12">
            <v-file-input outlined show-size clearable hide-details class="my-2"
              v-model="file"
              label="File to Import (max 200MB)"
            ></v-file-input>
            <v-btn block color="success"
              :loading="loading.importFile"
              @click="importRepoFile($repo.id,fileTypeSelected,file,addORreplaceSelected)"
            >
              Import File
            </v-btn>
            <v-alert text dismissible class="my-2"
              v-model="alert.importFile.visible"
              :type="alert.importFile.color"
            >
              {{ alert.importFile.message }}
            </v-alert>
          </v-col>
        </v-tab-item>
        <v-tab-item>
          <v-col cols="12">
            <v-textarea outlined hide-details class="mb-2 mt-1"
              v-model="rawText"
              label="Raw Text"
              placeholder="Raw Text"
            ></v-textarea>
            <v-btn block color="success"
              :loading="loading.importText"
              @click="importRepoText($repo.id,fileTypeSelected,rawText,addORreplaceSelected)"
            >
              Import Raw Text
            </v-btn>
            <v-alert text dismissible class="my-2"
              v-model="alert.importText.visible"
              :type="alert.importText.color"
            >
              {{ alert.importText.message }}
            </v-alert>
          </v-col>
        </v-tab-item>
      </v-tabs>
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
    file: undefined,
    rawText: '',
    loading: {
      importFile: false,
      importText: false
    },
    alert: {
      importFile: {
        visible: false,
        color: 'error',
        message: ''
      },
      importText: {
        visible: false,
        color: 'error',
        message: ''
      }
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
    backendURL: function () {
      var backendURL = 'http://' + this.$backurl.host + ':' + this.$backurl.port
      return backendURL
    }
  },
  methods: {
    importRepoFile (repoID, fileType, file, addORreplace) {
      this.loading.importFile = true
      var url = this.backendURL + '/api/rdf4j/management/importFile/' + repoID
      var data = file
      var headers = { 'Content-Type': 'text/turtle' }
      switch (fileType) {
        case 'ttl':
          headers['Content-Type'] = 'text/turtle'
          break
        case 'rdf-xml':
          headers['Content-Type'] = 'application/xml'
          break
        case 'txt':
          headers['Content-Type'] = 'text/plain'
          break
        default:
          headers['Content-Type'] = 'text/turtle'
      }
      var method
      if (addORreplace === 'add') method = 'post'
      else method = 'put'

      axios({
        method,
        url,
        data,
        headers,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      })
        .then(response => {
          this.alert.importFile.visible = true
          this.alert.importFile.color = 'success'
          this.alert.importFile.message = 'File Import Successful!!!'
        })
        .catch(error => {
          // console.log(error)
          this.alert.importFile.visible = true
          this.alert.importFile.color = 'error'
          this.alert.importFile.message = 'File Import Failed... \n' + error.response.data
        })
        .finally(() => {
          this.loading.importFile = false
        })
    },
    importRepoText (repoID, fileType, rawText, addORreplace) {
      this.loading.importText = true
      var url = this.backendURL + '/api/rdf4j/management/importText/' + repoID
      var data = rawText
      var headers = { 'Content-Type': 'text/turtle' }
      switch (fileType) {
        case 'ttl':
          headers['Content-Type'] = 'text/turtle'
          break
        case 'rdf-xml':
          headers['Content-Type'] = 'application/xml'
          break
        case 'txt':
          headers['Content-Type'] = 'text/plain'
          break
        default:
          headers['Content-Type'] = 'text/turtle'
      }
      var method
      if (addORreplace === 'add') method = 'post'
      else method = 'put'

      axios({
        method,
        url,
        data,
        headers,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      })
        .then(response => {
          this.alert.importText.visible = true
          this.alert.importText.color = 'success'
          this.alert.importText.message = 'Raw Text Import Successful!!!'
        })
        .catch(error => {
          // console.log(error)
          this.alert.importText.visible = true
          this.alert.importText.color = 'error'
          this.alert.importText.message = 'Raw Text Import Failed... \n' + error.response.data
        })
        .finally(() => {
          this.loading.importText = false
        })
    }
  }
}
</script>
