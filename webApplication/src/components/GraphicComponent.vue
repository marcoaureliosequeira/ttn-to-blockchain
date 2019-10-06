<template>
  <div class="container">
      <GChart
          type="LineChart"
          :data="chartData"
          :options="chartOptions"
      />
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  //const moment = require('moment');
  let x = mapActions;
  let y = mapState;
  console.log(x,y);
  export default {

      data () {
          return {
              // Array will be automatically processed with visualization.arrayToDataTable function
              chartData: [
              ],
              chartOptions: {
                  chart: {
                      title: 'Company Performance',
                      subtitle: 'Sales, Expenses, and Profit: 2014-2017',
                  }
              }
          }
      },

      beforeCreate() {
          const store = this.$store;
          // register a new module only if doesn't exist
          if (!(store && store.state && store.state['store'])) {
              store.registerModule('graphicComponent', 'store');
          }
      },
      computed: {
          ...mapState('store',['dataFromBlockchain']),
          dataFromBlockchain () {
              return this.$store.state.dataFromBlockchain;
          }
      },
      watch: {
          dataFromBlockchain (newValue) {
              let chartDataAux = [];
              chartDataAux.push(['#Record', 'Battery', 'Light', 'Temperature']);

              for(let i = 0; i < newValue.length; i++) {
                  chartDataAux.push([parseInt(newValue[i]["id"]), parseInt(newValue[i]["battery"]), parseInt(newValue[i]["light"]), parseInt(newValue[i]["temperature"])]);
              }

              this.chartData = chartDataAux;

              console.log("chartDataAux = ", chartDataAux);

              console.log("chartData = ", this.chartData);
          }
      },
      mounted() {
          //this.$store.dispatch("getBlockchainData");
      },
      methods: {
          ...mapActions(['getBlockchainData']),
      },
  }
</script>

<style>

</style>