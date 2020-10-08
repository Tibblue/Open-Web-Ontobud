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
      <v-checkbox hide-details class="mt-0 pt-2"
        v-model="infer"
        label="Inferencing"
        color="primary"
      ></v-checkbox>
    </v-col>
    <v-col cols="12">
      <v-tabs grow background-color="darken-1 green" color="white">
        <v-tab>Export File</v-tab>
        <v-tab>Export Raw Text</v-tab>

        <v-tab-item>
          <v-col cols="12">
            <v-text-field outlined clearable hide-details class="my-2"
              prepend-icon="fas fa-paperclip"
              v-model="exportFileName"
              label="Filename (Defaults to Repo ID)"
            ></v-text-field>
            <v-btn block color="success"
              :loading="loading.exportFile"
              @click="exportRepoFile($repo.id,fileTypeSelected,infer,exportFileName)"
            >
              Export File (Download File)
            </v-btn>
            <v-alert text dismissible class="my-2"
              v-model="alert.exportFile.visible"
              :type="alert.exportFile.color"
            >
              {{ alert.exportFile.message }}
            </v-alert>
          </v-col>
        </v-tab-item>
        <v-tab-item>
          <v-col cols="12">
            <v-btn block color="success"
              :loading="loading.exportText"
              @click="exportRepoText($repo.id,fileTypeSelected,infer)"
            >
              Export Raw Text
            </v-btn>
            <v-alert text dismissible class="my-2"
              v-model="alert.exportText.visible"
              :type="alert.exportText.color"
            >
              {{ alert.exportText.message }}
            </v-alert>
            <v-textarea outlined readonly hide-details class="mt-3"
              v-model="exportRawText"
              label="Raw Text"
              placeholder="Raw Text"
            ></v-textarea>
          </v-col>
        </v-tab-item>
      </v-tabs>
    </v-col>
  </v-row>
</template>

<script>
import Vuex from 'vuex'
import axios from 'axios'
const FileDownload = require('js-file-download')

export default {
  data: () => ({
    fileTypeSelected: 'ttl',
    // TODO: confirm if no error exists when importing/exporting from other file types (example rdf-xml)
    fileTypes: [ // TODO: add more
      { text: 'Turtle', value: 'ttl' },
      { text: 'RDF/XML', value: 'rdf-xml' },
      { text: 'Plain Text', value: 'txt' }
    ],
    infer: true,
    exportFileName: '',
    exportRawText: '',
    loading: {
      exportFile: false,
      exportText: false
    },
    alert: {
      exportTextFail: false,
      exportFile: {
        visible: false,
        color: 'error',
        message: ''
      },
      exportText: {
        visible: false,
        color: 'error',
        message: ''
      }
    }
  }),
  mounted () {
    this.exportFileName = this.$repo.id
  },
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
    exportRepoFile (repoID, fileType, infer, filename) {
      this.loading.exportFile = true
      var url = this.backendURL + '/api/rdf4j/management/export/' + repoID
      var headers = {}
      headers.params = { infer: infer }
      switch (fileType) {
        case 'ttl':
          headers.headers = { Accept: 'text/turtle' }
          break
        case 'rdf-xml':
          fileType = 'xml'
          break
        case 'txt':
          headers.headers = { Accept: 'text/plain' }
          break
        default:
      }
      if (!filename) filename = this.$repo.id
      axios.get(url, headers)
        .then(response => {
          this.alert.exportFile.visible = false
          this.alert.exportFile.message = ''
          FileDownload(response.data, filename + '.' + fileType)
        })
        .catch(error => {
          this.alert.exportFile.visible = true
          this.alert.exportFile.message = 'File Export Failed... \n' + error.response.data
        })
        .finally(() => {
          this.loading.exportFile = false
        })
    },
    exportRepoText (repoID, fileType, infer) {
      this.loading.exportText = true
      var url = this.backendURL + '/api/rdf4j/management/export/' + repoID
      var headers = {}
      headers.params = { infer: infer }
      switch (fileType) {
        case 'ttl':
          headers.headers = { Accept: 'text/turtle' }
          break
        case 'rdf-xml':
          fileType = 'xml'
          break
        case 'txt':
          headers.headers = { Accept: 'text/plain' }
          break
        default:
      }
      axios.get(url, headers)
        .then(response => {
          this.alert.exportText.visible = false
          this.alert.exportText.message = 'qwe'
          this.exportRawText = response.data
        })
        .catch(error => {
          this.alert.exportText.visible = true
          this.alert.exportText.message = 'Raw Text Export Failed... \n' + error.response.data
        })
        .finally(() => {
          this.loading.exportText = false
        })
    }
  }
}
</script>
