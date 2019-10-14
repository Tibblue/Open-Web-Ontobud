<template>
  <v-container>
    <debug/>
  </v-container>
</template>

<script>
import debug from '@/components/debug'
import axios from 'axios'
const rdf4j_url = "http://localhost:"+process.env.VUE_APP_RDF4J_PORT

export default {
  components: {
    debug,
  },
  data: () => ({
    snackbarDEBUG: false,
  }),
  // mounted: async function (){
  //   console.log(this.$props)
  //   console.log(process.env)
  // },
  methods: {
  }
}
</script>
