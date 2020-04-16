<template>
  <div class="text-center">
    <!-- <v-snackbar top v-model="snackbarDEBUG">
      {{ this.$session.get("repoName") }} - {{ this.$session.get("repoID") }}
      <v-btn @click="snackbarDEBUG=false">Close</v-btn>
    </v-snackbar>
    <v-btn color="info" @click="snackbarDEBUG=true">
      Confirm current repo (DEBUG)
    </v-btn> -->
    <!-- <v-btn color="warning" @click="$session.clear()">
      Clear $session (DEBUG)
    </v-btn> -->

    <!-- <v-btn color="warning" @click="test='2'">
      test
    </v-btn>
    <v-btn color="warning" @click="$store.commit('reset')">
      reset
    </v-btn> -->

    <v-divider class="my-2"></v-divider>

    <!-- <h2>RANDOM TEMP</h2> -->
    <!-- <p>{{

    }}</p> -->
    <!-- <p>{{this.$route.name}}</p> -->
    <!-- <p>{{this.$vuetify.breakpoint.name}}</p> -->

    <!-- <v-divider class="my-1"></v-divider>
    <h2>REPO</h2>
    <p>{{this.$session.get("repoName")}}</p>
    <p>{{this.$session.get("repoID")}}</p> -->

    <v-divider class="my-1"></v-divider>
    <h2>USER</h2>
    <p>{{this.$session.get("userName")}}</p>
    <p>{{this.$session.get("userEmail")}}</p>
    <!-- <p>{{this.$session.get("userToken")}}</p> -->

    <v-divider class="my-1"></v-divider>
    <h2>VUEX STORE</h2>
    <p>{{this.$store.state}}</p>
    <!-- <p>{{this.$store.state.$repo}}</p> -->
    <!-- <p>{{this.$store.state.$backurl}}</p> -->

    <v-divider class="my-1"></v-divider>
  </div>
</template>

<script>
import alerts from '@/components/alerts'
import Vuex from 'vuex'

export default {
  components: {
    alerts,
  },
  data: () => ({
    snackbarDEBUG: false,
  }),
  mounted: async function (){
    // console.log(this.$route) // debug. may fail to print
    // console.log(this.$route.fullPath) // debug
    // console.log(this.$route.matched) // debug
    // console.log(this.$route.name) // debug
    // console.log(this.$route.path) // debug
  },
  computed: {
    $backurl: {
      get: Vuex.mapState(['$backurl']).$backurl,
      set: Vuex.mapMutations(['update_backurl']).update_backurl,
    },
    test: {
      get: Vuex.mapState(['test']).test,
      set: Vuex.mapMutations(['updatetest']).updatetest,
    },
  },
  methods:{
    // notesAboutPersistantState(){
    //   // $store.commit('reset') // commits work good
    //   // $store.commit('updatetest','nhe') // commits work good
    //   // $store.state.test='1' // direct changes dont work
    //   // test='2' // combined with a computed get/set it seems to work
    // },
  },
};
</script>

<style>
/* .wrap-text {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  white-space: normal;
  hyphens: auto;
} */
p {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}
</style>