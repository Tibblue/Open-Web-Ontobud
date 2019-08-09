<template>
  <v-app dark>
    <v-toolbar dark>
      <v-toolbar-items>
        <v-btn color="indigo darken-2" @click="goToHome()"><h2>Home</h2></v-btn>
        <v-btn flat @click="goToTable('animes')"><h3>Anime</h3></v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <!-- <v-flex ma-5> -->
      <router-view/>
    <!-- </v-flex> -->

    <v-footer dark height="auto">
      <v-card-text class="text-xs-center">
        <v-btn icon v-for="icon in icons" :key="icon[0]">
          <v-icon size="24px" @click="goTo(icon[1])">{{icon[0]}}</v-icon>
        </v-btn>
        <v-divider></v-divider>
        <v-card-text>
          2019 — <strong>Francisco Oliveira</strong> —
          Projeto de PRC (Perfil PLC), Universidade do Minho
        </v-card-text>
      </v-card-text>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    name: 'App',
    data: () => ({
      icons: [
        // ['home','http://localhost:8080'],
        ['fab fa-github','http://www.github.com/Tibblue'],
        ['fab fa-linkedin','https://www.linkedin.com/in/kiko-oliveira/'],
        ['fas fa-university','https://www.uminho.pt'],
      ]
    }),
    methods: {
      goTo: function (link) {
        // window.location = link; // opens in same tab
        window.open(link); // opens another tab
      },
      goToHome: function () {
        this.$router.push('/')
      },
      goToTable: function (table) {
        this.$router.push('/'+table)
      }
    }
  }
</script>
