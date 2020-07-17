<template>
  <v-container>
    <alerts/>
    <debug v-bind:props="debugProps"/>
  </v-container>
</template>

<script>
import alerts from '@/components/alerts'
import debug from '@/components/debug'

export default {
  components: {
    alerts,
    debug
  },
  props: ['currentRepo', 'repoList'],
  data: () => ({
  }),
  // mounted: async function (){
  //   console.log(process.env)
  // },
  // methods: {
  // }
  computed: {
    debugProps () {
      return {
        currentRepo: this.currentRepo,
        repoList: this.repoList
      }
    }
  }
}
</script>
