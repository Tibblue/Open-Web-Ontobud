<template>
  <v-container>
    <!-- <h2>{{this.top5}}</h2> -->
    <!-- <h2>{{this.top5[0]}}</h2> -->

    <!-- <v-img src="https://scontent.flis7-1.fna.fbcdn.net/v/t1.15752-9/64254159_1160771190768776_3881768412510158848_n.png?_nc_cat=111&_nc_ht=scontent.flis7-1.fna&oh=4a72fae691d351ca18f02e05904afbc3&oe=5D969ABD"></v-img> -->
    <v-toolbar dark color="indigo darken-2" flat>
      <v-flex text-xs-center><h1>Top 5 Anime</h1></v-flex>
    </v-toolbar>


    <v-layout>
      <v-flex xs6 pa-2>
        <v-textarea
          v-model="this.text"
          outlined
          auto-grow
          rows="10"
          row-height="16"
          label="Last request response"
          placeholder="Run something"
          hint="HINT: Run something"
          :persistent-hint="false"
        ></v-textarea>
      </v-flex>

      <v-flex xs6 pa-2>
        <v-layout wrap>
          <v-btn flat @click="getRepositories()">
            <h3>Get Repositories</h3>
          </v-btn>
        </v-layout>
        <!-- <v-layout wrap>
          <v-flex xs4>
            <v-btn flat @click="newRepo()">
              <h3>Create Repo (TODO)</h3>
            </v-btn>
          </v-flex>
          <v-flex xs8>
            <v-text-field
              label="New Repo Name"
            ></v-text-field>
          </v-flex>
        </v-layout> -->
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
  import axios from 'axios'
  const lhost = "http://localhost:8080"

  export default {
    data: () => ({
      // top5: []
      text: ""
    }),
    mounted: async function (){
      // try{
      //   // // top5 list
      //   var response = await axios.get(lhost+'/rdf4j-server/repositories');
      //   this.top5 = response.data.results.bindings
      // }
      // catch(e){
      //   return(e);
      // }
    },
    methods: {
      cardClicked: function (id) {
        this.$router.push('/animes/'+id)
      },
      getRepositories: function () {
        // var response = await axios.get(lhost+'/rdf4j-server/repositories');
        // this.text = response
        axios.get(lhost+'/rdf4j-server/repositories')
          .then(response => {
            // this.alert = response.data // debug
            // var responseHead = response.data.head
            // console.log(responseHead)

            var repoList = response.data.results.bindings
            var repoListText = "Lista de Repositorios: \n(ID: Name)\n"
            repoList.forEach(elem => {
              repoListText += elem.id.value + ": " + elem.title.value + "\n"
            });

            console.log(response.data)
            this.text = repoListText
          })
          .catch(alert => {
            // this.alert = error // debug
            this.text = "PEDIDO FALHOU!!! " + alert
          })
      },
      // simplifyRepos: function (repo) {
      //   return {
      //     id: repo.id.value,
      //     title: repo.title.value
      //   }
      // }
    }
  }
</script>

<style>

</style>
