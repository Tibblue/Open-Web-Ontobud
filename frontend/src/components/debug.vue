<template>
  <div class="text-center">
    <v-btn color="info" @click="snackbarDEBUG=true">
      Confirm current repo (DEBUG)
    </v-btn>
    <v-snackbar top v-model="snackbarDEBUG">
      {{ this.$session.get("repoName") }} - {{ this.$session.get("repoID") }}
      <v-btn @click="snackbarDEBUG=false">Close</v-btn>
    </v-snackbar>
    <!-- <v-btn color="warning" @click="$session.clear()">
      Clear $session (DEBUG)
    </v-btn> -->
    <br/>
    <br/>
    <span>{{this.$session.get("repoName")}}</span>
    <span>{{this.$session.get("repoID")}}</span>
    <!-- <br/>
    <span>{{this.$store.state.$repo}}</span> -->
    <br/>
    <br/>
    <span>{{this.$store.state}}</span>
    <br/>
    <v-divider></v-divider>
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
  },
  methods:{
  },
};
</script>
