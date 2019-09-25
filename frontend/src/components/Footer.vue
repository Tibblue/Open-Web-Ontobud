<template>
<v-footer app padless inset>
  <v-col>
    <v-row align="center" justify="center">
        <v-btn
          v-for="icon in footer_icons"
          :key="icon[0]"
          class="mx-4 white--text"
          icon
        >
          <v-icon size="24px" @click="goTo(icon[1])">{{icon[0]}}</v-icon>
        </v-btn>
    </v-row>
    <v-divider class="my-2"></v-divider>
    <v-row align="center" justify="center">
        <span class="text-center white--text">
          2019/2020 — <strong>Francisco Oliveira</strong> —
          Dissertação em MIEI, Universidade do Minho
        </span>
    </v-row>
  </v-col>
</v-footer>
</template>

<script>
export default {
  data: () => ({
    footer_icons: [
      // ['home','http://localhost:8080'],
      // ['mdi mdi-mdiGithubCircle','http://www.github.com/Tibblue'],
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
  }
}
</script>

<style>

</style>
