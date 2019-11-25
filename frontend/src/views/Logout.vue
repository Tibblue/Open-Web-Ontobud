<template>
</template>

<script>
export default {
  mounted: async function (){
    // console.log(this.$session.get("userToken")) // debug
    // console.log(this.$session.get("userEmail")) // debug
    this.$session.remove("userToken")
    this.$session.remove("userEmail")
    this.$router.go(-1)
  },
}
</script>
