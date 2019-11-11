<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="6">
        <clearRepoStatements/>
        <deleteCurrentRepo/>
        <v-divider></v-divider>
        <importRepo/>
      </v-col>
      <v-col cols="12" lg="6">
        <exportRepo/>
      </v-col>
      <v-col cols="12" lg="6">
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import importRepo from '@/components/importRepo'
import exportRepo from '@/components/exportRepo'
import clearRepoStatements from '@/components/clearRepoStatements'
import deleteCurrentRepo from '@/components/deleteCurrentRepo'
import axios from 'axios'
const rdf4j_url = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT

export default {
  components: {
    importRepo,
    exportRepo,
    clearRepoStatements,
    deleteCurrentRepo,
  },
  data: () => ({
  }),
  // mounted: async function (){
  //   console.log(this.$props)
  //   console.log(process.env)
  // },
  methods: {
  }
}
</script>
