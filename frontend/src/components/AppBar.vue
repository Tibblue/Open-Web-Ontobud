<template>
  <v-app-bar app
    color="primary"
  >
    <v-toolbar-title v-bind:selectedRepo.sync="selectedRepo">
      {{selectedRepo}}
    </v-toolbar-title>

    <div class="flex-grow-1"></div>

    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>

        <v-row>
          <v-combobox
            v-model="selectedRepo"
            no-data-text="No Repositories available"
            :items="repoList"
            :search-input.sync="repoSearch"
            label="Selected Repositoy"
            v-on:change="repoChange(selectedRepo)"
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    No results matching "<strong>{{ repoSearch }}</strong>"
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-combobox>
          <v-btn color="primary" @click="getRepositories()" class="mx-3">
            Refresh Repositories
          </v-btn>
        </v-row>

    <v-menu
      left
      bottom
    >
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="n in 5"
          :key="n"
          @click="() => {}"
        >
          <v-list-item-title>Option {{ n }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import axios from 'axios'
const rdf4j_port = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT

export default {
  data: () => ({
    selectedRepo: "No Repository Selected",
    repoSearch: "",
    repoList: undefined,
  }),
  mounted: async function (){
    console.log(process.env)
    this.getRepositories()
  },
  methods: {
    repoChange(repo) {
      this.$emit('repoChanged',repo)
      this.$router.replace({ query: { repo: repo } })
    },
    getRepositories: function () {
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
          this.selectedRepo = "Selected Repositry"
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
