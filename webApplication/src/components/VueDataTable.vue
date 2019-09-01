<template>
  <div class="container">
    <v-client-table v-if="this.$store.state.dataFromBlockchain"
            :data="this.$store.state.dataFromBlockchain"
            :columns="columns"
            :options="options">
    </v-client-table>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';

  export default {
    data() {
      return {
        columns: ['id', 'temperature', 'light', 'battery', 'sensorEvent', 'devId', 'date'],
        tableData: []
        ,
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
    },
    beforeCreate() {
      const store = this.$store;
      // register a new module only if doesn't exist
      if (!(store && store.state && store.state['store'])) {
        store.registerModule('vueDataTable', 'store');
      }
    },
    mounted() {
      console.log("entrei!!");
      console.log(this.$store);
      //this.$store.dispatch('mainStore/getDataFromBlockchain');
      this.$store.dispatch("getBlockchainData");


      //this.getClientPendingPayments();

      console.log("this.tableData = ", this.tableData);
    },
    methods: {
      ...mapActions(['getBlockchainData']),

      async getClientPendingPayments() {
        await this.$store.dispatch("getBlockchainData").then(response => {
          console.log("PROMISE FINAL");
          this.tableData = response;
          return true;
        }, error => {
          console.error("Got nothing from server. Prompt user to check internet connection and try again", error)
        })
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