<template>
  <div>
    <v-col class="pa-0">
      <v-row dense>
        <v-col cols="12">
          <v-btn block color="primary" @click="repoListExpand=!repoListExpand">
            <div v-if="repoListExpand==true">
              <span>Hide Repository List</span>
              <v-icon right>fas fa-chevron-up</v-icon>
            </div>
            <div v-else>
              <span>Show Repository List</span>
              <v-icon right>fas fa-chevron-down</v-icon>
            </div>
          </v-btn>
        </v-col>
      </v-row>
      <v-expand-transition>
        <v-card flat color="transparent" class="mb-2"
          v-show="repoListExpand"
        >
          <v-container fluid class="pa-0">
            <v-dialog
              v-model="dialogEditRepo"
              max-width="600px"
              :retain-focus="false"
            >
              <v-card>
                <v-card-title>
                  <span class="headline">
                    {{editing.repoID}}
                  </span>
                </v-card-title>
                <v-card-text>
                  <v-textarea outlined auto-grow hide-details
                    v-model="editing.repoName"
                    rows="6"
                    row-height="16"
                    label="Edited Query"
                  ></v-textarea>
                </v-card-text>
                <v-card-actions>
                  <v-col class="grow">
                    <v-btn block color="success"
                      @click="repoEditSave(editing.repoID,editing.repoName);dialogEditRepo=false"
                    >
                      Save
                    </v-btn>
                  </v-col>
                  <v-col class="grow">
                    <v-btn block color="error" @click="dialogEditRepo=false">
                      Cancel
                    </v-btn>
                  </v-col>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-row dense>
              <v-col :cols="colsSize"
                v-for="repo in repoList"
                :key="repo"
              >
                <v-card>
                  <v-container class="pa-1">
                    <v-row no-gutters align="center">
                      <v-col class="grow title px-1 py-1">
                        <span>{{getRepoName(repo)}}</span>
                      </v-col>
                      <!-- <v-col class="shrink px-1 py-1">
                        <v-btn rounded outlined depressed small disabled color="primary">
                          {{checkRepo(repo.query).type}}
                        </v-btn>
                      </v-col> -->
                    </v-row>
                    <v-row no-gutters align="center" class="flex-nowrap">
                      <v-col class="shrink px-1 py-1">
                        <v-btn fab x-small depressed color="primary"
                          disabled
                          @click="repoChange(repo.query,infer)"
                        >
                          <v-icon>mdi-play</v-icon>
                        </v-btn>
                      </v-col>
                      <v-col class="shrink px-1 py-1">
                        <v-btn fab x-small depressed color="primary"
                          disabled
                          :loading="loading.repoEditSave"
                          @click="dialogEditRepo=true;repoEdit(repo.id,repo.query)"
                        >
                          <v-icon>mdi-pencil</v-icon>
                        </v-btn>
                      </v-col>
                      <v-col class="shrink px-1 py-1">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on }">
                            <v-btn icon x-small  v-on="on">
                              <v-icon>fas fa-info</v-icon>
                            </v-btn>
                          </template>
                          <span>ID: {{getRepoID(repo)}}</span>
                        </v-tooltip>
                      </v-col>
                      <v-col class="grow"></v-col>
                      <v-col class="shrink px-1 py-1">
                        <v-menu left offset-x>
                          <template v-slot:activator="{ on }">
                            <v-btn fab x-small depressed dark v-on="on" color="red"
                              :loading="loading.repoDelete"
                            >
                              <v-icon>fas fa-trash</v-icon>
                            </v-btn>
                          </template>
                          <v-btn small color="error" @click="deleteRepo(getRepoID(repo))">
                            Confirm?
                          </v-btn>
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-expand-transition>
      <v-alert text dismissible type="error" v-model="alert.repoEditFail">
        Failed to save repo changes ...
      </v-alert>
      <v-alert text dismissible type="error" v-model="alert.repoDeleteFail">
        Failed to Delete repo ...
      </v-alert>
    </v-col>
    <v-divider class="my-2"></v-divider>
  </div>
</template>

<script>
import Vuex from 'vuex'
import axios from 'axios'

export default {
  // components: {
  // },
  props: ['currentRepo', 'repoList'],
  data: () => ({
    repoListExpand: true,
    dialogEditRepo: false,
    editing: {
      repoID: '',
      repoName: ''
    },
    alert: {
      repoEditFail: false,
      repoDeleteFail: false
    },
    loading: {
      repoList: false,
      repoEditSave: false,
      repoDelete: false
    }
  }),
  mounted: async function () {
  },
  computed: {
    $backurl: {
      get: Vuex.mapState(['$backurl']).$backurl,
      set: Vuex.mapMutations(['update_backurl']).update_backurl
    },
    backendURL: function () {
      var backendURL = 'http://' + this.$backurl.host + ':' + this.$backurl.port
      return backendURL
    },
    test: {
      get: Vuex.mapState(['test']).test,
      set: Vuex.mapMutations(['updatetest']).updatetest
    },
    colsSize: function () {
      var cols = 6 // default
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          cols = 12
          break
        case 'sm':
          cols = 6
          break
        case 'md':
          cols = 6
          break
        case 'lg':
          cols = 4
          break
        case 'xl':
          cols = 3
          break
      }
      return cols
    }
  },
  methods: {
    repoEdit (repoID, oldName) {
      this.editing.repoID = repoID
      this.editing.repoName = oldName
    },
    deleteRepo (repoID) {
      this.loading.repoDelete = true
      axios.delete(this.backendURL + '/api/rdf4j/management/delete/' + repoID)
        .then(response => {
          this.alert.repoDeleteFail = false
          // this.$emit('updateRepos',repoID) // NOTE: isto funcionou
          if (repoID === this.$session.get('repoID')) {
            this.$session.remove('repoID')
            this.$session.remove('repoName')
            // this.$router.go(0) // FIXME: reload enquanto nao atualizo só a repoList
          }
          this.$router.go(0) // FIXME: reload enquanto nao atualizo só a repoList
        })
        .catch(alert => {
          this.alert.repoDeleteFail = true
        })
        .finally(() => {
          this.loading.repoDelete = false
        })
    },
    async updateState (id, name) {
      this.$session.set('repoID', id)
      this.$session.set('repoName', name)
      this.$repo = { id: id, name: name }
      return true
    },
    async repoChange (id, name) {
      this.$emit('changedCurrentRepo', { id: id, name: name }) // NOTE: isto funcionou
      await this.updateState(id, name)
      this.$router.go(0)
    },
    getRepoName (string) {
      return string.split(' ID:')[0]
    },
    getRepoID (string) {
      return string.split(' ID:')[1]
    }
  }
}
</script>

<style>
/* .wrap-text {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  hyphens: auto;
} */
p {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}
</style>
