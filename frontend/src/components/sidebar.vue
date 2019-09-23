<template>
  <v-flex fill-height>
    <v-navigation-drawer
      color="indigo"
      :mini-variant="sidebar_mini"
      permanent
    >
      <v-btn @click.stop="sidebar_mini = !sidebar_mini"
        block flat>
        <v-icon v-if="!sidebar_mini">chevron_left</v-icon>
        <v-icon v-else>chevron_right</v-icon>
      </v-btn>
      <v-btn @click="goTo('/')" block color="indigo darken-2">
        <h2>Home</h2>
      </v-btn>
      <v-divider/>
      <v-list nav dense>
        <v-btn @click="goTo('/')" block color="indigo darken-2">
          <v-icon>home</v-icon>
          <h2 v-if="!sidebar_mini">Home BTN</h2>
        </v-btn>
      </v-list>
      <v-divider/>
      <v-btn class="ma-2" outlined color="indigo">
        Outlined Button
      </v-btn>

      <v-divider/>

      <v-item-group>
        <v-item
          v-slot:default="{ active, toggle }"
          v-for="(item, i) in sidebar_items"
          :key=i
        >
          <v-card>
            <v-card
              :color="active ? 'primary' : ''"
              class="d-flex align-center"
              height="64"
              @click="toggle"
            >
              <v-flex class="d-flex align-center">
                <v-icon large v-text="item.icon"></v-icon>
                <div
                  class="display-1 flex-grow-1 text-center"
                  v-if="!sidebar_mini"
                  v-text="item.text"
                ></div>
              </v-flex>
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
                    <v-flex class="d-flex align-center">
                      <v-icon large v-text="item.icon"></v-icon>
                      <div
                        class="display-1 flex-grow-1 text-center"
                        v-if="!sidebar_mini"
                        v-text="item.text"
                      ></div>
                    </v-flex>
                  </v-card>
                </v-item>
              </v-item-group>
            </v-card>
          </v-card>
        </v-item>
      </v-item-group>

    </v-navigation-drawer>

  </v-flex>
</template>

<script>
  export default {
    data: () => ({
      model: 1,
      sidebar_mini: false,
      sidebar_items: [
        { text: 'Import', icon: 'account_circle' },
        { text: 'SPARQL', icon: 'account_circle' },
        { text: 'Settings', icon: 'account_circle' ,
            subgroup: [
              { text: 'Repositories', icon: 'chevron_right', link: '/testing/button1/repos' },
              { text: 'My Settings', icon: 'chevron_right', link: '/testing/button2/settings' }
            ]
        },
      ],
    }),
    methods: {
      goTo: function (id) {
        this.$router.push(id)
      }
    }
  }
</script>

<style>

</style>
