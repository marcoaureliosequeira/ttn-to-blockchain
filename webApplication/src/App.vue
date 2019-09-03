<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>BLOCKCHAIN</span><v-icon>mdi-leak</v-icon>
        <span class="font-weight-light">THE THINGS NETWORK</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <vue-data-table></vue-data-table>
      <loading-component></loading-component>
    </v-content>
  </v-app>
</template>

<script>
import VueDataTable from "./components/VueDataTable";
import LoadingComponent from "./components/LoadingComponent";

export default {
  name: 'App',
  components: {
    VueDataTable,
    LoadingComponent
  },
  data: () => ({
    //
  }),
};
</script>
