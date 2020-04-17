<template>
  <div>
    <v-snackbar top
      v-model="this.snackbarLogin"
      :color="this.snackbarLoginColor"
    >
      {{ this.snackbarLoginMsg }}
      <v-btn @click="snackbarLogin=false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data: () => ({
    snackbarLogin: false,
    snackbarLoginValue: null,
    snackbarLoginColor: '',
    snackbarLoginMsg: ''
  }),
  mounted: async function () {
    this.snackbarLoginValue = this.$session.flash.get('login')
    if (this.snackbarLoginValue) {
      this.snackbarLoginColor = this.snackbarLoginValue.color
      this.snackbarLoginMsg = this.snackbarLoginValue.msg
      this.snackbarLogin = true
    }
  },
  methods: {
  }
}
</script>
