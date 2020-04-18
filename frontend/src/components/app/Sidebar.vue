<template>
  <v-navigation-drawer app width="270"
    v-model="sidebarVisible"
    :mini-variant="sidebar_mini"
    :permanent="this.$vuetify.breakpoint.name==='xs' ? false : true"
  >
    <v-list-item link to="/" class="px-2">
      <v-list-item-icon class="mr-3">
        <v-btn fab small depressed color="grey darken-1">{{owo}}</v-btn>
        <!-- <v-btn fab outlined small depressed color="primary">{{owo}}</v-btn> -->
      </v-list-item-icon>
      <v-list-item-content class="py-2">
        <v-list-item-title class="title mb-0">
          Open Web Ontobud
        </v-list-item-title>
        <v-list-item-subtitle class="caption">
          an Open Source RDF4J Frontend
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <!-- <v-list-item link to="/" class="px-0">
      <v-list-item-icon class="my-1">
        <v-btn fab small depressed color="grey darken-2">
          <span class="yellow--text">{{owo[0]}}</span>
          <span class="black--text">{{owo[1]}}</span>
          <span class="yellow--text">{{owo[2]}}</span>
        </v-btn>
        <v-btn fab small depressed color="blue lighten-2">
          <span class="yellow--text">{{owo[0]}}</span>
          <span class="black--text">{{owo[1]}}</span>
          <span class="yellow--text">{{owo[2]}}</span>
        </v-btn>
        <v-btn fab small depressed color="blue darken-2">
          <span class="yellow--text">{{owo[0]}}</span>
          <span class="black--text">{{owo[1]}}</span>
          <span class="yellow--text">{{owo[2]}}</span>
        </v-btn>
        <v-btn fab small depressed color="grey darken-2">
          <span class="blue--text">{{owo}}</span>
        </v-btn>
        <v-btn fab outlined small depressed color="grey darken-2">
          <span class="yellow--text">{{owo[0]}}</span>
          <span class="black--text">{{owo[1]}}</span>
          <span class="yellow--text">{{owo[2]}}</span>
        </v-btn>
      </v-list-item-icon>
    </v-list-item>
    <v-list-item link to="/" class="px-0">
      <v-list-item-icon class="my-1">
        <v-btn fab small depressed color="grey">{{owo}}</v-btn>
        <v-btn fab small depressed color="grey darken-2">{{owo}}</v-btn>
        <v-btn fab small depressed color="primary">{{owo}}</v-btn>
        <span>|</span>
        <v-btn fab outlined small depressed color="primary">{{owo}}</v-btn>
        <v-btn fab outlined small depressed color="pink lighten-1">osu!</v-btn>
        <v-btn fab outlined small depressed color="grey darken-2 blue--text">{{owo}}</v-btn>
      </v-list-item-icon>
    </v-list-item> -->
    <!-- <v-list-item link to="/" class="px-0">
      <v-list-item-icon class="my-0">
        <v-btn fab small depressed color="grey lighten-2">
          <span class="yellow--text">{{owo[0]}}</span>
          <span class="black--text">{{owo[1]}}</span>
          <span class="yellow--text">{{owo[2]}}</span>
        </v-btn>
        <v-btn fab small depressed color="grey lighten-1">
          <span class="yellow--text">{{owo[0]}}</span>
          <span class="black--text">{{owo[1]}}</span>
          <span class="yellow--text">{{owo[2]}}</span>
        </v-btn>
        <v-btn fab small depressed color="grey">
          {{owo}}
        </v-btn>
        <v-btn fab small depressed color="grey">
          <span class="yellow--text">{{owo[0]}}</span>
          <span class="black--text">{{owo[1]}}</span>
          <span class="yellow--text">{{owo[2]}}</span>
        </v-btn>
        <v-btn fab small depressed color="grey darken-1">
          <span class="yellow--text">{{owo[0]}}</span>
          <span class="black--text">{{owo[1]}}</span>
          <span class="yellow--text">{{owo[2]}}</span>
        </v-btn>
        <v-btn fab small depressed color="grey darken-2">
          <span class="yellow--text">{{owo[0]}}</span>
          <span class="black--text">{{owo[1]}}</span>
          <span class="yellow--text">{{owo[2]}}</span>
        </v-btn>
      </v-list-item-icon>
    </v-list-item> -->
    <!-- <v-list-item link to="/" class="px-0">
      <v-list-item-icon class="my-0">
        <v-btn fab small depressed color="blue lighten-2">
          <span class="yellow--text">{{owo[0]}}</span>
          <span class="black--text">{{owo[1]}}</span>
          <span class="yellow--text">{{owo[2]}}</span>
        </v-btn>
        <v-btn fab small depressed color="blue lighten-1">
          <span class="yellow--text">{{owo[0]}}</span>
          <span class="black--text">{{owo[1]}}</span>
          <span class="yellow--text">{{owo[2]}}</span>
        </v-btn>
        <v-btn fab small depressed color="blue">
          {{owo}}
        </v-btn>
        <v-btn fab small depressed color="blue">
          <span class="yellow--text">{{owo[0]}}</span>
          <span class="black--text">{{owo[1]}}</span>
          <span class="yellow--text">{{owo[2]}}</span>
        </v-btn>
        <v-btn fab small depressed color="blue darken-1">
          <span class="yellow--text">{{owo[0]}}</span>
          <span class="black--text">{{owo[1]}}</span>
          <span class="yellow--text">{{owo[2]}}</span>
        </v-btn>
        <v-btn fab small depressed color="blue darken-2">
          <span class="yellow--text">{{owo[0]}}</span>
          <span class="black--text">{{owo[1]}}</span>
          <span class="yellow--text">{{owo[2]}}</span>
        </v-btn>
      </v-list-item-icon>
    </v-list-item> -->

    <v-list-item @click="goToBackend()">
      <v-list-item-icon>
        <v-icon>mdi-api</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="title">
          Backend API&nbsp;
          <v-icon>mdi-open-in-new</v-icon>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list-item @click="sidebar_mini = !sidebar_mini">
      <v-list-item-icon>
        <v-icon v-if="!sidebar_mini">fas fa-chevron-left</v-icon>
        <v-icon v-else>fas fa-chevron-right</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="title">
          Minimize Sidebar
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item @click="swapDarkMode()">
      <v-list-item-icon>
        <v-icon v-if="!this.$vuetify.theme.dark">fas fa-sun</v-icon>
        <v-icon v-else>fas fa-moon</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="title">
          Light/Dark Mode
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list-item
      v-for="item in sidebar_items"
      :key="item.text"
      link :to="item.link"
    >
      <v-list-item-icon>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="title">
          {{ item.text }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

  </v-navigation-drawer>
</template>

<script>
export default {
  data: () => ({
    owo: 'OwO',
    sidebarVisible: false,
    sidebar_mini: false,
    sidebar_items: [
      // Navigation
      { text: 'Home', icon: 'fas fa-home', link: '/' }, // FIXME: tirar??
      { text: 'Manage Repositories', icon: 'fas fa-boxes', link: '/repositories' },
      { text: 'Manage Repo', icon: 'fas fa-archive', link: '/manage' },
      { text: 'Repository Info', icon: 'fas fa-info-circle', link: '/info' },
      { text: 'SPARQL', icon: 'fas fa-pen', link: '/sparql' },
      { text: 'Resource', icon: 'fas fa-project-diagram', link: '/resource' },
      // { text: 'TODO Navigation', icon: 'fas fa-project-diagram', link: '/navigation'},
      { text: 'Feedback', icon: 'fas fa-comment-dots', link: '/feedback' }
      // { text: 'TODO Admin', icon: 'fas fa-user-shield', link: '/admin'},
    ]
  }),
  mounted: async function () {
    // this.owoShowcase()
    this.owo1sec()
    switch (this.$vuetify.breakpoint.name) {
      case 'xs':
        this.sidebar_mini = false
        break
      case 'sm':
        this.sidebar_mini = true
        break
      case 'md':
      case 'lg':
      case 'xl':
        this.sidebar_mini = false
        break
    }
  },
  computed: {
    // sidebarVisible: function() {
    //   return true
    // }
  },
  methods: {
    owoShowcase: function () {
      setInterval(() => {
        if (this.owo === 'OwO') { this.owo = 'UwU' } else if (this.owo === 'UwU') { this.owo = '>w<' } else if (this.owo === '>w<') { this.owo = '^w^' } else { this.owo = 'OwO' }
      }, 1000)
    },
    owo1sec: function () {
      setInterval(() => {
        var rand = Math.floor(Math.random() * 100)
        if (rand > 95) { this.owo = '^w^' } else if (rand > 90) { this.owo = '>w<' } else if (rand > 60) { this.owo = 'UwU' } else { this.owo = 'OwO' }
      }, 1000)
    },
    goTo: function (id) {
      this.$router.push(id)
    },
    goToBackend: function () {
      // window.open("http://epl.di.uminho.pt:8001");
      window.open('http://' + this.$store.state.$backurl.host + ':' + this.$store.state.$backurl.port)
    },
    swapDarkMode: function () {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
    }
  }
}
</script>

<style>

</style>
