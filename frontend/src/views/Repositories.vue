<template>
  <v-container>
    <alerts/>
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
import alerts from '@/components/alerts'
import createRepo from '@/components/createRepo'
import deleteRepo from '@/components/deleteRepo'

export default {
  components: {
    alerts,
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
