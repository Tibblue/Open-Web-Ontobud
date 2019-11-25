<template>
  <v-container>
  </v-container>
</template>

<script>
export default {
  // data: () => ({
  // }),
  mounted: async function (){
    // console.log(this.$session.get("userToken")) // debug
    // console.log(this.$session.get("userEmail")) // debug
    this.$session.remove("userToken")
    this.$session.remove("userEmail")
    this.$router.go(-1)
  },
  // methods: {
  // }
}
</script>
