<template>
  <div class="container">

    <v-btn
            color="primary"
            depressed
            v-on:click="datableRefresh"
    >
      <v-icon>mdi-refresh</v-icon>
      Refresh
    </v-btn>
<br/>
<br/>
    <v-btn
            color="error"
            depressed
            v-on:click="datableRefreshError"
    >
      <v-icon>mdi-refresh</v-icon>
      Refresh Error Data
    </v-btn>

    <v-client-table v-if="this.$store.state.dataFromBlockchain"
            :data="this.$store.state.dataFromBlockchain"
            :columns="columns"
            :options="options"
    >
    </v-client-table>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';

  export default {
    data() {
      return {
        columns: ['id', 'temperature', 'light', 'battery', 'sensorEvent', 'devId', 'date'],
        tableData: [],
        loader: '',
        options: {
          headings: {
            id: 'Id',
            temperature: 'Temperature',
            light: 'Light',
            battery: 'Battery',
            sensorEvent: 'Sensor Event',
            devId: 'Device Id',
            date: 'Date',
          },
          sortable: ['id', 'temperature', 'light', 'battery', 'sensorEvent', 'devId', 'date'],
          filterable: ['id', 'temperature', 'light', 'battery', 'sensorEvent', 'devId', 'date'],
        }
      }
    },
    computed: {
      ...mapState('store',['dataFromBlockchain']),
      loading () {
        return this.$store.state.loading
      }
    },
    watch: {
      loading (newValue) {
        if(newValue === 1) {
          this.$root.$emit('loaderOn')
        }
        else {
          this.$root.$emit('loaderOff')
        }
      }
    },
    beforeCreate() {
      const store = this.$store;
      // register a new module only if doesn't exist
      if (!(store && store.state && store.state['store'])) {
        store.registerModule('vueDataTable', 'store');
      }
    },
    mounted() {
      this.$store.dispatch("getBlockchainData");
    },
    methods: {
      ...mapActions(['getBlockchainData']),

      datableRefresh() {
        this.$store.dispatch("getBlockchainData");
      },
      datableRefreshError() {
        this.$store.dispatch("getBlockchainDataError");
      }
    },
  }
</script>

<style>
  #app {
    width: 95%;
    margin-top: 50px;
  }

  .VuePagination {
    text-align: center;
  }

  .vue-title {
    text-align: center;
    margin-bottom: 10px;
  }

  .vue-pagination-ad {
    text-align: center;
  }

  .glyphicon.glyphicon-eye-open {
    width: 16px;
    display: block;
    margin: 0 auto;
  }

  th:nth-child(3) {
    text-align: center;
  }

  .VueTables__child-row-toggler {
    width: 16px;
    height: 16px;
    line-height: 16px;
    display: block;
    margin: auto;
    text-align: center;
  }

  .VueTables__child-row-toggler--closed::before {
    content: "+";
  }

  .VueTables__child-row-toggler--open::before {
    content: "-";
  }

</style>