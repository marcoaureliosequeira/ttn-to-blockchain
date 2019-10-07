<template>
  <div class="container">
      <template>
          <v-card
                  flat
                  class="py-12"
          >
              <v-card-text>
                  <v-row
                          align="center"
                          justify="center"
                  >
                      <v-col cols="12">
                          <p class="text-center">Rounded</p>
                      </v-col>
                      <v-btn-toggle
                              v-model="filterChart"
                              rounded
                      >
                          <v-btn>
                              General
                          </v-btn>
                          <v-btn>
                              Battery
                          </v-btn>
                          <v-btn>
                              Light
                          </v-btn>
                          <v-btn>
                              Temperature
                          </v-btn>
                      </v-btn-toggle>
                  </v-row>
              </v-card-text>
          </v-card>
      </template>
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
                      //title: 'Company Performance',
                      //subtitle: 'Sales, Expenses, and Profit: 2014-2017',
                  }
              },
              filterChart: 0
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
          },
          /*filterChart () {
              return this.filterChart;
          }*/
      },
      watch: {
          dataFromBlockchain (newValue) {
              this.refreshChart(newValue);
          },
          filterChart (newValue) {
              if(typeof(newValue) !== 'undefiend') {
                  this.refreshChart(this.$store.state.dataFromBlockchain);
              }
          }

      },
      mounted() {
          //this.$store.dispatch("getBlockchainData");
      },
      methods: {
          ...mapActions(['getBlockchainData']),

          refreshChart(newValue) {
              //let filter = this.$store.state.filterChart;
              let chartDataAux = [];
              if(this.filterChart === 0) {
                  chartDataAux.push(['#Record', 'Battery', 'Light', 'Temperature']);

                  for(let i = 0; i < newValue.length; i++) {
                      chartDataAux.push([new Date(newValue[i]["date"]), parseInt(newValue[i]["battery"]), parseInt(newValue[i]["light"]), parseInt(newValue[i]["temperature"])]);
                  }
              }

              if(this.filterChart === 1) {
                  chartDataAux.push(['#Record', 'Battery']);

                  for(let i = 0; i < newValue.length; i++) {
                      chartDataAux.push([new Date(newValue[i]["date"]), parseInt(newValue[i]["battery"])]);
                  }
              }

              if(this.filterChart === 2) {
                  chartDataAux.push(['#Record', 'Light']);

                  for(let i = 0; i < newValue.length; i++) {
                      chartDataAux.push([new Date(newValue[i]["date"]), parseInt(newValue[i]["light"])]);
                  }
              }

              if(this.filterChart === 3) {
                  chartDataAux.push(['#Record', 'Temperature']);

                  for(let i = 0; i < newValue.length; i++) {
                      chartDataAux.push([new Date(newValue[i]["date"]), parseInt(newValue[i]["temperature"])]);
                  }
              }

              this.chartData = chartDataAux;

//              console.log("chartDataAux = ", chartDataAux);

  //            console.log("chartData = ", this.chartData);
          }
      },
  }
</script>

<style>

</style>