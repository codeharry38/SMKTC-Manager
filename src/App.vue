<template>
  <v-app class="stockBackground">
    <Header/>
    <v-main><router-view></router-view></v-main>
  </v-app>
</template>

<script>
import Header from './components/inc/header.vue';

export default {
  name: 'App',

  components: {
    Header,
  },

  data: () => ({
    //
  }),
};
</script>
