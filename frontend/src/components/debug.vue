<template>
  <div class="text-center">
    <v-snackbar top v-model="snackbarDEBUG">
      {{ this.$session.get("repoName") }} - {{ this.$session.get("repoID") }}
      <v-btn @click="snackbarDEBUG=false">Close</v-btn>
    </v-snackbar>
    <v-btn color="info" @click="snackbarDEBUG=true">
      Confirm current repo (DEBUG)
    </v-btn>
    <!-- <v-btn color="warning" @click="$session.clear()">
      Clear $session (DEBUG)
    </v-btn> -->

    <v-divider class="my-2"></v-divider>

    <h2>RANDOM TEMP</h2>
    <p>{{this.$route.name}}</p>
    <p>{{}}</p>
    <!-- <p>{{this.$vuetify.breakpoint.name}}</p> -->

    <!-- <v-divider class="my-1"></v-divider>
    <h2>REPO</h2>
    <p>{{this.$session.get("repoName")}}</p>
    <p>{{this.$session.get("repoID")}}</p> -->

    <v-divider class="my-1"></v-divider>
    <h2>USER</h2>
    <p>{{this.$session.get("userName")}}</p>
    <p>{{this.$session.get("userEmail")}}</p>
    <p>{{this.$session.get("userToken")}}</p>

    <v-divider class="my-1"></v-divider>
    <h2>VUEX STORE</h2>
    <p>{{this.$store.state.$repo}}</p>
    <p>{{this.$store.state}}</p>

    <v-divider class="my-1"></v-divider>
  </div>
</template>

<script>
import alerts from '@/components/alerts'

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
  methods:{
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