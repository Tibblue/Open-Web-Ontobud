<template>
  <div>
    <v-snackbar top
      v-model="snackbarLogin"
      :color="snackbarLogin.color"
    >
      {{ this.snackbarLogin.msg }}
      <v-btn @click="snackbarLogin=false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data: () => ({
    snackbarLogin: null,
  }),
  mounted: async function (){
    this.snackbarLogin = this.$session.flash.get("login")
  },
  methods:{
  },
};
</script>
