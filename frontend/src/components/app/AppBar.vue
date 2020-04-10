<template>
  <v-app-bar app color="primary"
    :hide-on-scroll="this.$vuetify.breakpoint.name==='xs' ? true : false"
    scroll-threshold="5"
    :prominent="this.$vuetify.breakpoint.name==='xs' ? true : false"
  >
    <v-row dense align="center" class="mx-n4">
      <v-col class="grow">
        <v-row dense align="center">
          <v-col class="grow">
            <v-combobox dense hide-details outlined
              v-model="selectedRepo"
              no-data-text="No Repositories available"
              :items="repoList"
              label="Selected Repository"
              v-on:change="repoChange(getRepoID(selectedRepo),getRepoName(selectedRepo))"
            ></v-combobox>
          </v-col>
          <v-col class="shrink">
            <v-btn icon small :loading="loadingRepos" @click="getRepositories()">
              <v-icon>fas fa-sync</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col :cols="this.$vuetify.breakpoint.name==='xs' ? 12 : ''">
        <v-row dense align="center" justify="end" class="flex-nowrap"
          v-if="!this.$session.get('userToken')"
        >
          <v-col class="shrink">
            <v-dialog
              v-model="dialogSaveQuery"
              max-width="600px"
              overlay-opacity="0.85"
            >
              <template v-slot:activator="{ on }">
                <v-btn rounded large depressed color="secondary" v-on="on">
                  Login&nbsp;
                  <v-icon>fas fa-sign-in-alt</v-icon>
                  <!-- <v-icon>mdi-login-variant</v-icon> -->
                </v-btn>
              </template>
              <login/>
            </v-dialog>
          </v-col>
          <v-col class="shrink">
            <v-dialog v-model="dialogSaveQuery" max-width="600px">
              <template v-slot:activator="{ on }">
                <v-btn fab depressed color="secondary" v-on="on">
                  <v-icon>fas fa-user-plus</v-icon>
                  <!-- <v-icon>mdi-account-plus</v-icon> -->
                </v-btn>
              </template>
              <signIn/>
            </v-dialog>
          </v-col>
        </v-row>
        <v-row dense align="center" justify="end" v-else class="flex-nowrap">
          <v-col class="shrink">
            <v-btn rounded large depressed color="secondary" link to="/auth/user">
              {{this.$session.get('userName')}}&nbsp;
              <v-icon>fas fa-user-cog</v-icon>
              <!-- <v-icon>mdi-cog</v-icon> -->
            </v-btn>
          </v-col>
          <v-col class="shrink">
            <v-btn fab depressed color="secondary" @click="logout()">
              <v-icon>fas fa-sign-out-alt</v-icon>
              <!-- <v-icon>mdi-logout-variant</v-icon> -->
            </v-btn>
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
// const rdf4j_url = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT
const backend_url = "http://"+process.env.VUE_APP_BACKEND_HOST+":"+process.env.VUE_APP_BACKEND_PORT

export default {
  components: {
    login,
    signIn,
  },
  // props: ['update'],
  data: () => ({
    loadingRepos: false,
    selectedRepo: "Loading Repositories",
    repoList: undefined,
  }),
  mounted: async function (){
    // console.log(process.env) // debug
    this.getRepositories()
  },
  computed: {
    $repo: {
      get: Vuex.mapState(['$repo']).$repo,
      set: Vuex.mapMutations(['update$repo']).update$repo,
    },
  },
  methods: {
    logout: function () {
      this.$session.remove("userToken")
      this.$session.remove("userEmail")
      this.$session.flash.set("login", {msg: "Logout Success!!!", color: "success"})
      this.$router.go()
    },
    repoChange(id, name) {
      this.$repo = {id: id, name: name}
      // this.$repo.id = id
      // this.$repo.name = name
      // console.log(this.$store.state.$repo) // debug
      this.$session.set("repoID",id)
      this.$session.set("repoName",name)
      // this.$emit('repoChanged',name) # NOTE: isto funcionou
      this.$router.go(0)
    },
    getRepositories() {
      this.loadingRepos = true
      axios.get(backend_url+'/api/rdf4j/management/listRepos')
        .then(response => {
          // console.log(response.data) // debug
          var repoList = response.data
          var repoListText = []
          repoList.forEach(elem => {
            repoListText.push(elem.title.value+" ID:"+elem.id.value)
          });
          this.repoList = repoListText.sort()
          if(this.$session.has("repoName")){ // NOTE: mudar de session pra VUEX
            // TODO verificar se o repo guardado ainda existe
            this.selectedRepo = this.$session.get("repoName")+" ID:"+this.$session.get("repoID")
            this.$repo = {
              id: this.$session.get("repoID"),
              name: this.$session.get("repoName"),
            }
          }
          else{
          // if(this.selectedRepo==="Loading Repositories"){
            this.selectedRepo = repoListText[0]
            this.$session.set("repoID",this.getRepoID(repoListText[0]))
            this.$session.set("repoName",this.getRepoName(repoListText[0]))
            this.$repo = {
              id: this.getRepoID(repoListText[0]),
              name: this.getRepoName(repoListText[0]),
            }
          }
        })
        .catch(alert => {
          // this.alert = error // debug
          this.selectedRepo = "No Repositories available" + alert
        })
        .finally(() => {
          this.loadingRepos = false
        })
    },
    getRepoName(string) {
      return string.split(" ID:")[0]
    },
    getRepoID(string) {
      return string.split(" ID:")[1]
    },
  },
};
</script>
