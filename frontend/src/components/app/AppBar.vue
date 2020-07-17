<template>
  <v-app-bar app color="primary"
    :prominent="this.$vuetify.breakpoint.name==='xs' ? true : false"
  >
    <v-row dense align="center" class="mx-n4 my-n1">
      <v-col order="last" order-sm="first" sm="6">
        <v-row no-gutters align="center" class="flex-nowrap">
          <v-col class="mx-1">
            <v-select filled hide-details dense color="secondary" background-color="secondary" dark
              v-model="selectedRepo"
              :items="repoList"
              no-data-text="No Repositories available"
              label="Selected Repository"
              append-outer-icon="fas fa-sync"
              @click:append-outer="getRepositories()"
              :loading="loadingRepos"
              v-on:change="repoChange(getRepoID(selectedRepo),getRepoName(selectedRepo), true)"
            ></v-select>
          </v-col>
        </v-row>
      </v-col>
      <v-col order="first" order-sm="last" cols="12" sm="6">
        <v-row no-gutters align="center" class="flex-nowrap">
          <v-col>
            <v-row dense align="center" justify="start" class="flex-nowrap">
              <v-col class="shrink" v-if="this.$vuetify.breakpoint.name==='xs'">
                <v-btn fab depressed color="secondary" @click="toggleSidebarON()">
                  <v-icon>fas fa-bars</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row dense align="center" justify="end" class="flex-nowrap"
              v-if="!this.$session.get('userToken')"
            >
              <v-col class="shrink">
                <v-dialog
                  max-width="600px"
                  overlay-opacity="0.85"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn rounded large depressed color="secondary" v-on="on">
                      Login&nbsp;
                      <v-icon>fas fa-sign-in-alt</v-icon>
                    </v-btn>
                  </template>
                  <login/>
                </v-dialog>
              </v-col>
              <v-col class="shrink">
                <v-dialog max-width="600px">
                  <template v-slot:activator="{ on }">
                    <v-btn fab depressed color="secondary" v-on="on">
                      <v-icon>fas fa-user-plus</v-icon>
                    </v-btn>
                  </template>
                  <signIn/>
                </v-dialog>
              </v-col>
            </v-row>
            <v-row dense align="center" justify="end" class="flex-nowrap"
              v-else
            >
              <v-col class="shrink">
                <v-btn rounded large depressed color="secondary" link to="/auth/user">
                  {{this.$session.get('userName')}}&nbsp;
                  <v-icon>fas fa-user-cog</v-icon>
                </v-btn>
              </v-col>
              <v-col class="shrink">
                <v-btn fab depressed color="secondary" @click="logout()">
                  <v-icon>fas fa-sign-out-alt</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-app-bar>
</template>

<script>
import login from '@/components/login_card'
import signIn from '@/components/signIn_card'
import Vuex from 'vuex'
import axios from 'axios'

export default {
  components: {
    login,
    signIn
  },
  data: () => ({
    loadingRepos: false,
    selectedRepo: 'Loading Repositories',
    repoList: []
  }),
  mounted: async function () {
    this.getRepositories()
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
      console.log(backendURL)
      // this.getRepositories(backendURL)
      return backendURL
    }
  },
  methods: {
    logout: function () {
      this.$session.remove('userToken')
      this.$session.remove('userEmail')
      this.$session.flash.set('login', { msg: 'Logout Success!!!', color: 'success' })
      this.$router.go()
    },
    toggleSidebarON () {
      this.$emit('toggleSidebarON')
    },
    async updateState (id, name) {
      this.$session.set('repoID', id)
      this.$session.set('repoName', name)
      this.$repo = { id: id, name: name }
      // this.$repo.id = id
      // this.$repo.name = name
      // console.log(this.$store.state.$repo) // debug
      return true
    },
    async repoChange (id, name, reload) {
      this.$emit('changedCurrentRepo', { id: id, name: name }) // NOTE: isto funcionou
      await this.updateState(id, name)
      if (reload) this.$router.go(0)
    },
    getRepositories () {
      this.loadingRepos = true
      axios.get(this.backendURL + '/api/rdf4j/management/listRepos')
        .then(response => {
          // console.log(response.data) // debug
          var repoList = response.data
          var repoListText = []
          repoList.forEach(elem => {
            repoListText.push(elem.title.value + ' ID:' + elem.id.value)
          })
          this.repoList = repoListText.sort()
          if (this.$session.has('repoName')) {
            // NOTE mudar de session pra VUEX
            // TODO verificar se o repo guardado ainda existe
            this.selectedRepo = this.$session.get('repoName') + ' ID:' + this.$session.get('repoID')
            this.repoChange(this.getRepoID(this.selectedRepo), this.getRepoName(this.selectedRepo), false)
          } else {
            this.selectedRepo = repoListText[0]
            this.repoChange(this.getRepoID(repoListText[0]), this.getRepoName(repoListText[0]), false)
          }
        })
        .catch(alert => {
          // this.alert = error // debug
          this.$emit('changedCurrentRepo', { id: undefined, name: undefined }) // NOTE: isto funcionou
          this.$emit('changedRepoList', [])
          this.selectedRepo = 'No Repositories available' + alert
        })
        .finally(() => {
          this.$emit('changedRepoList', this.repoList)
          this.loadingRepos = false
        })
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
