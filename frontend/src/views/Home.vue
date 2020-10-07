<template>
  <v-container class="pb-8">
    <alerts/>
    <homepage v-bind="homepageProps" @changedCurrentRepo="updateCurrentRepo"/>
    <!-- <debug v-bind:props="debugProps"/> -->
  </v-container>
</template>

<script>
import alerts from '@/components/alerts'
import homepage from '@/components/homepage'
// import debug from '@/components/debug'

export default {
  components: {
    alerts,
    homepage
    // debug
  },
  props: ['currentRepo', 'repoList'],
  data: () => ({
  }),
  // mounted: async function (){
  //   console.log(process.env)
  // },
  methods: {
    updateCurrentRepo (id, name) {
      this.$emit('changedCurrentRepo', id, name)
    }
  },
  computed: {
    homepageProps () {
      return {
        currentRepo: this.currentRepo,
        repoList: this.repoList
      }
    }
    // debugProps () {
    //   return {
    //     currentRepo: this.currentRepo,
    //     repoList: this.repoList
    //   }
    // }
  }
}
</script>
