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
      <v-tabs grow background-color="darken-3 green" color="white">
        <v-tab>Export File</v-tab>
        <v-tab>Export Raw Text</v-tab>

        <v-tab-item>
          <v-col cols="12">
            <v-btn block color="success"
              :loading="loading.exportFile"
              @click="exportRepoFile($repo.id,fileTypeSelected,infer)" class="mt-3"
            >
              Export File (Download File)
            </v-btn>
            <v-alert text dismissible type="error" v-model="alert.exportFileFail">
              File Export Failed...
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
            <v-alert text dismissible type="error" v-model="alert.exportTextFail">
              Text Export Failed...
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
    exportRawText: '',
    loading: {
      exportFile: false,
      exportText: false
    },
    alert: {
      exportFileFail: false,
      exportTextFail: false
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
    exportRepoFile (repoID, fileType, infer) {
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
      axios.get(url, headers)
        .then(response => {
          FileDownload(response.data, 'exportRepository.' + fileType)
        })
        .catch(alert => {
          this.alert.exportFileFail = true
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
          // FIXME: needs visual upgrades
          this.exportRawText = response.data
        })
        .catch(alert => {
          this.alert.exportTextFail = true
        })
        .finally(() => {
          this.loading.exportText = false
        })
    }
  }
}
</script>
