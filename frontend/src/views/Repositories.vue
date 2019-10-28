<template>
  <v-container>
    <v-row>
      <!-- <span>algo tipo a lista de saved queries</span> -->
      <v-col cols="12">
        <!-- <repoCardList/> -->
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <createRepo/>
      </v-col>
      <v-col cols="6">
        <deleteRepo/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import createRepo from '@/components/createRepo'
import deleteRepo from '@/components/deleteRepo'
import axios from 'axios'
const rdf4j_url = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT

export default {
  components: {
    createRepo,
    deleteRepo,
  },
  data: () => ({
  }),
  // mounted: async function (){
  //   console.log(this.$props)
  //   console.log(process.env)
  // },
  methods: {
    // simplifyRepos: function (repo) {
    //   return {
    //     id: repo.id.value,
    //     title: repo.title.value
    //   }
    // }
  }
}
</script>
