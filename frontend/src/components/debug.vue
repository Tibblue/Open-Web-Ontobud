<template>
  <div class="text-center">
    <v-btn color="info" @click="snackbarDEBUG=true">
      Confirm current repo (DEBUG)
    </v-btn>
    <v-btn color="warning" @click="$session.clear()">
      Clear $session (DEBUG)
    </v-btn>
    <v-snackbar top v-model="snackbarDEBUG">
      {{ this.$session.get("repoName") }} - {{ this.$session.get("repoID") }}
      <!-- {{this.$route.query.repoID}} - {{this.$route.query.repoID}} -->
      <v-btn @click="snackbarDEBUG=false">Close</v-btn>
    </v-snackbar>
    <br/>
    <span>{{this.$store.state.$repo}}</span>
    <br/>
    <span>{{this.$session.get("repoName")}}</span>
    <span>{{this.$session.get("repoID")}}</span>
    <br/>
    <v-divider></v-divider>
  </div>
</template>

<script>
export default {
  data: () => ({
    snackbarDEBUG: false,
  }),
};
</script>
