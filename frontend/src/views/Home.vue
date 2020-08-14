<template>
  <v-container>
    <alerts/>
    <homepage v-bind="homepageProps" @changedCurrentRepo="updateCurrentRepo"/>
    <v-divider class="my-2"></v-divider>
    <debug v-bind:props="debugProps"/>
  </v-container>
</template>

<script>
import alerts from '@/components/alerts'
import homepage from '@/components/homepage'
import debug from '@/components/debug'

export default {
  components: {
    alerts,
    homepage,
    debug
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
    },
    debugProps () {
      return {
        currentRepo: this.currentRepo,
        repoList: this.repoList
      }
    }
  }
}
</script>
