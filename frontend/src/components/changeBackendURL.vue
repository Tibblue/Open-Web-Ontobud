<template>
  <v-card class="pa-3">
    <v-text-field filled hide-details
      v-model="newHost"
      :placeholder="$backurl.host"
      label="Host"
    ></v-text-field>
    <div class="mb-4"></div>
    <v-text-field filled
      v-model="newPort"
      :placeholder="$backurl.port"
      label="Port"
      :rules="[rules.port]"
    ></v-text-field>
    <!-- <div class="mb-2"></div> -->
    <v-btn block color="primary" @click="changeBackendURL(newHost, newPort)">
      Update
    </v-btn>
    <div class="mb-4"></div>
    <v-btn block color="warning" @click="resetBackendURL()">
      Reset to Default
    </v-btn>
  </v-card>
</template>

<script>
import Vuex from 'vuex'

export default {
  data: () => ({
    newHost: "",
    newPort: "",
    rules: {
      port: value => {
        const pattern = /^()([1-9]|[1-5]?[0-9]{2,4}|6[1-4][0-9]{3}|65[1-4][0-9]{2}|655[1-2][0-9]|6553[1-5])$/
        return pattern.test(value) || 'Must be a valid port'
      },
    },
  }),
  // mounted: async function (){
  //   // console.log(process.env) # debug
  // },
  computed: {
    $backurl: {
      get: Vuex.mapState(['$backurl']).$backurl,
      set: Vuex.mapMutations(['update_backurl']).update_backurl,
    },
  },
  methods: {
    changeBackendURL(newHost, newPort){
      if(!newHost) newHost = this.$backurl.host
      if(!newPort) newPort = this.$backurl.port
      this.$backurl = {
        host: newHost,
        port: newPort
      }
      this.$router.go()
    },
    resetBackendURL(){
      this.newHost = ""
      this.newPort = ""
      this.$backurl = {
        host: process.env.VUE_APP_BACKEND_HOST,
        port: process.env.VUE_APP_BACKEND_PORT,
      }
      this.$router.go()
    },
  },
};
</script>
