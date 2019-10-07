<template>
  <v-app-bar app color="primary">
    <v-btn icon @click="getRepositories()">
      <v-icon>fas fa-sync</v-icon>
    </v-btn>
    <v-toolbar-title v-bind:selectedRepo.sync="selectedRepo">
      {{selectedRepo}}
    </v-toolbar-title>

    <div class="flex-grow-1"></div>
      <v-combobox
        v-model="selectedRepo"
        no-data-text="No Repositories available"
        :items="repoList"
        label="Selected Repositoy"
        v-on:change="repoChange(selectedRepo,'ola')"
      >
      </v-combobox>
      <!-- <v-btn color="primary" @click="getRepositories()" class="mx-3">
        Refresh Repositories
      </v-btn> -->

    <!-- <v-menu left>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>fas fa-wifi</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="n in 3"
          :key="n"
          @click="() => {}"
        >
          <v-list-item-title>Option {{ n }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu> -->

    <!--
    <v-toolbar-title class="headline text-uppercase">
      <span>Temporary</span>
      <span class="font-weight-light">stuff</span>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn color="primary" @click="goToHome()">
      <h2>Home</h2>
      -->
  </v-app-bar>
</template>

<script>
import axios from 'axios'
const rdf4j_port = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT

export default {
  data: () => ({
    selectedRepo: "Loading Repositories",
    repoList: undefined,
  }),
  mounted: async function (){
    // console.log(process.env) # debug
    this.getRepositories()
  },
  methods: {
    repoChange(name, id) {
      // this.$emit('repoChanged',name) # NOTE: isto funcionou
      this.$router.replace({
        query: {
          repoID: id,
          repoName: name,
        }
      })
    },
    getRepositories: function () {
      this.selectedRepo = "Loading Repositories"
      axios.get(rdf4j_port+'/rdf4j-server/repositories')
        .then(response => {
          // this.alert = response.data // debug
          // console.log(response.data.head)

          var repoList = response.data.results.bindings
          console.log(response.data.results.bindings)
          var repoListText = []
          repoList.forEach(elem => {
            repoListText.push(elem.title.value)
          });
          // console.log(response.data) // debug
          this.selectedRepo = "Select a Repository"
          this.repoList = repoListText
        })
        .catch(alert => {
          // this.alert = error // debug
          this.selectedRepo = "No Repositories available"
          // this.repoList = "PEDIDO FALHOU!!! " + alert
        })
    },
    goTo: function (link) {
      // window.location = link; // opens in same tab
      window.open(link); // opens another tab
    },
    goToHome: function () {
      this.$router.push('/')
    },
  }
};
</script>
