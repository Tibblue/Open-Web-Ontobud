<template>
  <v-container>
    <alerts/>
    <v-row dense>
      <v-col cols="12" lg="6">
        <importRepo/>
      </v-col>
      <v-col cols="12" lg="6">
        <exportRepo/>
      </v-col>
      <v-col cols="12">
        <v-divider></v-divider>
        <clearRepoStatements/>
        <deleteCurrentRepo/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import alerts from '@/components/alerts'
import importRepo from '@/components/importRepo'
import exportRepo from '@/components/exportRepo'
import clearRepoStatements from '@/components/clearRepoStatements'
import deleteCurrentRepo from '@/components/deleteCurrentRepo'

export default {
  components: {
    alerts,
    importRepo,
    exportRepo,
    clearRepoStatements,
    deleteCurrentRepo
  }
  // data: () => ({
  // }),
  // mounted: async function (){
  //   console.log(this.$props)
  //   console.log(process.env)
  // },
  // methods: {
  // }
}
</script>
