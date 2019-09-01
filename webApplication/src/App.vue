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
    </v-content>
  </v-app>
</template>

<script>
import VueDataTable from "./components/VueDataTable";

export default {
  name: 'App',
  components: {
    VueDataTable
  },
  data: () => ({
    //
  }),
};
</script>
