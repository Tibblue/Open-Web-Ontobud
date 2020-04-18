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
              :suffix="`ID: ${getRepoID(selectedRepo)}`"
              append-outer-icon="fas fa-sync"
              @click:append-outer="getRepositories()"
              :loading="loadingRepos"
              v-on:change="repoChange(getRepoID(selectedRepo),getRepoName(selectedRepo))"
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
              <v-col class="shrink">
                <v-dialog
                  max-width="600px"
                  overlay-opacity="0.85"
                >
                  <template v-slot:activator="{ on }">
                    <v-btn rounded large depressed color="secondary" v-on="on">
                      <v-icon>fas fa-wrench</v-icon>
                      &nbsp;Backend
                    </v-btn>
                  </template>
                  <changeBackendURL/>
                </v-dialog>
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
import changeBackendURL from '@/components/changeBackendURL'
import Vuex from 'vuex'
import axios from 'axios'

export default {
  components: {
    login,
    signIn,
    changeBackendURL
  },
  // props: ['update'],
  data: () => ({
    loadingRepos: false,
    selectedRepo: 'Loading Repositories',
    repoList: undefined
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
    // getRepositories: {
    //   get(state) {
    //     var backendURL = state.backendURL
    //     // var backendURL = this.backendURL
    //     // console.log(backendURL)
    //     this.loadingRepos = true
    //     axios.get(backendURL+'/api/rdf4j/management/listRepos')
    //       .then(response => {
    //         // console.log(response.data) // debug
    //         var repoList = response.data
    //         var repoListText = []
    //         repoList.forEach(elem => {
    //           repoListText.push(elem.title.value+" ID:"+elem.id.value)
    //         });
    //         this.repoList = repoListText.sort()
    //         if(this.$session.has("repoName")){ // NOTE: mudar de session pra VUEX
    //           // TODO verificar se o repo guardado ainda existe
    //           this.selectedRepo = this.$session.get("repoName")+" ID:"+this.$session.get("repoID")
    //           this.$repo = {
    //             id: this.$session.get("repoID"),
    //             name: this.$session.get("repoName"),
    //           }
    //         }
    //         else{
    //         // if(this.selectedRepo==="Loading Repositories"){
    //           this.selectedRepo = repoListText[0]
    //           this.$session.set("repoID",this.getRepoID(repoListText[0]))
    //           this.$session.set("repoName",this.getRepoName(repoListText[0]))
    //           this.$repo = {
    //             id: this.getRepoID(repoListText[0]),
    //             name: this.getRepoName(repoListText[0]),
    //           }
    //         }
    //       })
    //       .catch(alert => {
    //         // this.alert = error // debug
    //         this.selectedRepo = "No Repositories available" + alert
    //       })
    //       .finally(() => {
    //         this.loadingRepos = false
    //       })
    //     return this.repoList
    //   },
    //   set(newList){
    //     return newList
    //   },
    // },
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
    repoChange (id, name) {
      this.$repo = { id: id, name: name }
      // this.$repo.id = id
      // this.$repo.name = name
      // console.log(this.$store.state.$repo) // debug
      this.$session.set('repoID', id)
      this.$session.set('repoName', name)
      // this.$emit('repoChanged',name) # NOTE: isto funcionou
      this.$router.go(0)
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
          if (this.$session.has('repoName')) { // NOTE: mudar de session pra VUEX
            // TODO verificar se o repo guardado ainda existe
            this.selectedRepo = this.$session.get('repoName') + ' ID:' + this.$session.get('repoID')
            this.$repo = {
              id: this.$session.get('repoID'),
              name: this.$session.get('repoName')
            }
          } else {
          // if(this.selectedRepo==="Loading Repositories"){
            this.selectedRepo = repoListText[0]
            this.$session.set('repoID', this.getRepoID(repoListText[0]))
            this.$session.set('repoName', this.getRepoName(repoListText[0]))
            this.$repo = {
              id: this.getRepoID(repoListText[0]),
              name: this.getRepoName(repoListText[0])
            }
          }
        })
        .catch(alert => {
          // this.alert = error // debug
          this.selectedRepo = 'No Repositories available' + alert
        })
        .finally(() => {
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
