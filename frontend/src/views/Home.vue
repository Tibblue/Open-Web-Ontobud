<template>
  <v-container>
    <alerts/>
    <debug/>
  </v-container>
</template>

<script>
import alerts from '@/components/alerts'
import debug from '@/components/debug'

export default {
  components: {
    alerts,
    debug,
  },
  // data: () => ({
  // }),
  // mounted: async function (){
  //   console.log(process.env)
  // },
  // methods: {
  // }
}
</script>
