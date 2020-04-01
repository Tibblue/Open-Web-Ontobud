<template>
<v-footer app padless inset>
  <v-col class="pa-2">
    <v-row align="center" justify="center">
      <v-btn
        v-for="icon in footer_icons"
        :key="icon[0]"
        class="mx-3"
        icon
      >
        <v-icon size="24px" @click="goTo(icon[1])">{{icon[0]}}</v-icon>
      </v-btn>
    </v-row>
    <div v-if="expandFooter || varIsAtBottom">
      <v-divider class="my-1"></v-divider>
      <v-row align="center" justify="center">
        <span class="text-center">
          2019/2020 — <strong>Francisco Oliveira</strong> —
          Dissertação em MIEI, Universidade do Minho
        </span>
      </v-row>
    </div>
  </v-col>
</v-footer>
</template>

<script>
export default {
  data: () => ({
    footer_icons: [
      // ['home','http://localhost:8080'],
      ['fab fa-github','http://www.github.com/Tibblue'],
      ['fab fa-linkedin','https://www.linkedin.com/in/kiko-oliveira/'],
      ['fas fa-university','https://www.uminho.pt'],
    ],
    varIsAtBottom: false,
  }),
  mounted: async function (){
    // this.isAtBottom("")
  },
  computed: {
    expandFooter: function () {
      switch (this.$route.name) {
        // this pages will have the complete footer
        case "home":
          return true
          break;
        // the others will have the short version
        default:
          return false
          break;
      }
    },
  },
  methods: {
    goTo: function (link) {
      // window.location = link; // opens in same tab
      window.open(link); // opens another tab
    },
    isAtBottom: function (event) {
      // console.log(window.pageYOffset) // debug
      // console.log(document.documentElement.scrollTop) // debug
      // console.log(document.body.scrollTop) // debug
      // console.log(window.innerHeight) // debug
      // console.log(document.documentElement.offsetHeight) // debug
      // console.log(Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight === document.documentElement.offsetHeight) // debug
      var currentTopPosition = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)
      var currentBottomPosition = currentTopPosition + window.innerHeight
      var maxBottom = document.documentElement.offsetHeight
      var condition = currentBottomPosition === maxBottom
      // console.log(currentTopPosition) // debug
      // console.log(currentBottomPosition) // debug
      // console.log(maxBottom) // debug
      // console.log(condition) // debug
      this.varIsAtBottom = condition
      return condition
    },
  },
  created: function () {
    window.addEventListener('scroll', this.isAtBottom);
  },
  destroyed: function () {
    window.removeEventListener('scroll', this.isAtBottom);
  }
}
</script>

<style>

</style>
