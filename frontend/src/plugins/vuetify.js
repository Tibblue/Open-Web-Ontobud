import '@fortawesome/fontawesome-free/css/all.css'
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'fa',
  },
  theme: {
    dark: true,
    // themes: {
    //   light: {
    //     primary: colors.purple,
    //     secondary: colors.grey.darken1,
    //     accent: colors.shades.black,
    //     error: colors.red.accent3,
    //   },
    //   dark: {
    //     primary: colors.blue.lighten3,
    //   },
    // },
  },
});
