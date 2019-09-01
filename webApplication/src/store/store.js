import Vue from 'vue'
import Vuex from 'vuex'
//import {getTtnInfo} from '../../src/getTtnInfo'
const moment = require('moment');

const hostProvider = 'http://localhost:7545';

var sensorDataContract = null;

var Web3 = require('web3');

const TruffleContract = require('truffle-contract');


var web3 = new Web3(new Web3.providers.HttpProvider(hostProvider));
var web3Provider = null;

var firstAccount;

/*****************/
//const config = require('../../config.js');
//const sensorDataLocation = config.blockchainOptions.sensorDataLocation;

//var sensorDataAbi = require("111");
var sensorDataAbi = require("/Users/marcosequeira/ttn-to-blockchain/ttnNodeApplication/build/contracts/SensorData.json");


Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    flavor: '',
    dataFromBlockchain: [],
    //testGet: getTtnInfo
  },
  mutations: {
    change(state, flavor) {
      state.flavor = flavor
    },
    setDataFromBlockchain (state, payload) {
      console.log("setDataFromBlockchain = ", payload);
      state.dataFromBlockchain = payload
    },
  },

  getters: {
    flavor: state => state.flavor,
    dataFromBlockchain: state => state.dataFromBlockchain,
  },


  actions: {
    //getBlockchainData({ dispatch, commit }, payload) {
    getBlockchainData({ dispatch}) {
      dispatch('initweb3').then (function () {
        dispatch('setContracts').then(function(){
          dispatch('getInformationFromBlockchain');
        });
      });
    },

    async initweb3() {
      try {
        //To make sure not to overwrite the already set provider when in mist, check first if the web3 is available
        if (typeof web3 !== 'undefined') {
          web3Provider = web3.currentProvider;
          console.log("webProvider = ", web3Provider);

          web3 = await new Web3(web3.currentProvider);
          console.log("inside if");
        } else {
          // create an instance of web3 using the HTTP provider
          web3 = await new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
          console.log("inside else");
        }
      }
      catch(err) {
        console.log(err);
      }
    },
    async setContracts () {
      console.log("start setContracts");

      sensorDataContract = TruffleContract(sensorDataAbi) //get truffle contract; function from truffle package - node
      sensorDataContract.setProvider(web3Provider)

      firstAccount = web3.eth.accounts[0];

      console.log("firstAccount = ", firstAccount);

      console.log("final setContracts");
    },
    async getInformationFromBlockchain({commit}) {
      console.log("---getInformationFromBlockchain222---");
      console.log("\n \n");

      sensorDataContract.deployed().then(async function (instance) {
        let dataId = await instance.dataId();


        console.log("dataId = ", dataId.toNumber());
        //console.log("dataFromSensorBC = ", dataFromSensorBC);

        var toReturn = [];

        // Fetch dataFromSensor on the blockchain
        for (var i = 1; i <= dataId; i++) {
          const task = await instance.dataFromSensorArray(i)
          const dataId = task[0]
          const temperatureContent = task[1]
          const lightContent = task[2]
          const battery = task[3]
          const sensorEvent = task[4]
          const devId = task[5]
          const dateFromBlockchain = task[6]

          var dateUtc = moment.utc(dateFromBlockchain.toString());
          var localDate = moment(dateUtc).local();


          let auxToReturn = {
            id: dataId.toString(),
            temperature: temperatureContent.toString(),
            light: lightContent.toString(),
            battery: battery.toString(),
            sensorEvent: sensorEvent.toString(),
            devId: devId,
            date: localDate.toString()
          };

          toReturn.push(auxToReturn);

          console.log("toReturn = ", toReturn);
        }
        commit('setDataFromBlockchain', toReturn);
        return toReturn;
      }).then(function(result) {
        //console.log("getInformationFromBlockchain = ", result.toString());
        console.log("---final----")
        return result;
      }, function (error) {
        console.log(error);
        return error;
      });
    }
  }
})