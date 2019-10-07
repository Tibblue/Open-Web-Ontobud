<template>
  <v-navigation-drawer app permanent
    :mini-variant.sync="sidebar_mini"
  >
    <!-- <v-btn block @click.stop="sidebar_mini = !sidebar_mini">
      <v-icon v-if="!sidebar_mini">fas fa-chevron-left</v-icon>
      <v-icon v-else>fas fa-chevron-right</v-icon>
    </v-btn>
    <v-btn block @click="swapDarkMode()">
      <v-icon v-if="!this.$vuetify.theme.dark">fas fa-sun</v-icon>
      <v-icon v-else>fas fa-moon</v-icon>
      <span v-if="!sidebar_mini">Light/Dark Mode</span>
    </v-btn>
    <v-btn block color="primary" @click="goTo('/')">
      <v-icon>fas fa-home</v-icon>
      <h2 v-if="!sidebar_mini">Home</h2>
    </v-btn> -->

    <v-divider></v-divider>

    <!-- <v-item-group>
      <v-item
        v-slot:default="{ active, toggle }"
        v-for="(item, i) in sidebar_items"
        :key=i
      >
        <v-card>
          <v-card
            :color="active ? 'accent' : ''"
            class="d-flex align-center justify-center"
            height="64"
            @click="toggle"
          >
            <v-col class="d-flex align-center justify-center">
              <v-icon large v-text="item.icon"></v-icon>
              <div
                class="display-1 flex-grow-1 text-center"
                v-if="!sidebar_mini"
                v-text="item.text"
              ></div>
            </v-col>
          </v-card>
          <v-card v-if="item.subgroup && active">
            <v-item-group>
              <v-item
                v-for="(item, i) in item.subgroup"
                :key=i
              >
                <v-card
                  color="info"
                  class="d-flex align-center"
                  height="64"
                  @click="goTo(item.link)"
                >
                  <v-col class="d-flex align-center">
                    <v-icon large v-text="item.icon"></v-icon>
                    <div
                      class="display-1 flex-grow-1 text-center"
                      v-if="!sidebar_mini"
                      v-text="item.text"
                    ></div>
                  </v-col>
                </v-card>
              </v-item>
            </v-item-group>
          </v-card>
        </v-card>
      </v-item>
    </v-item-group> -->

    <v-list-item>
      <v-list-item-icon>
        <v-icon>fas fa-flag</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="title">
          RDF4J Frontend
        </v-list-item-title>
        <!-- <v-list-item-subtitle>
          subtitle
        </v-list-item-subtitle> -->
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

    <v-list nav>
      <v-list-item
        v-for="item in sidebar_items"
        :key="item.text"
        link :to="item.link"
        color="accent"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="title">{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

  </v-navigation-drawer>
</template>

<script>
  export default {
    data: () => ({
      model: 1,
      sidebar_mini: false,
      sidebar_items: [
        { text: 'Home', icon: 'fas fa-home', link: '/'},
        { text: 'Import', icon: 'fas fa-file-import', link: '/import'},
        { text: 'SPARQL', icon: 'fas fa-pen', link: '/sparql'},
        { text: 'Settings', icon: 'fas fa-cog', link: '/settings' ,
          subgroup: [
            { text: 'Repositories', icon: 'fas fa-chevron_right', link: '/testing/button1/repos'},
            { text: 'My Settings', icon: 'fas fa-chevron_right', link: '/testing/button2/settings'}
          ]
        },
      ],
    }),
    methods: {
      goTo: function (id) {
        this.$router.push(id)
      },
      swapDarkMode: function () {
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      },
    }
  }
</script>

<style>

</style>
