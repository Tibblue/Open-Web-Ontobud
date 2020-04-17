<template>
  <v-container>
    <alerts/>
    <feedback/>
  </v-container>
</template>

<script>
import alerts from '@/components/alerts'
import feedback from '@/components/feedback'

export default {
  components: {
    alerts,
    feedback
  }
  // data: () => ({
  // }),
  // mounted: async function (){
  //   console.log(process.env)
  // },
  // methods: {
  // }
}
</script>
