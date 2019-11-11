<template>
  <v-container>
    <v-row>
      <!-- <span>algo tipo a lista de saved queries</span> -->
      <v-col cols="12">
        <!-- <repoCardList/> -->
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="6">
        <createRepo/>
      </v-col>
      <v-col cols="12" lg="6">
        <deleteRepo/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import createRepo from '@/components/createRepo'
import deleteRepo from '@/components/deleteRepo'

export default {
  components: {
    createRepo,
    deleteRepo,
  },
  // data: () => ({
  // }),
  // mounted: async function (){
  // },
  // methods: {
  // }
}
</script>
