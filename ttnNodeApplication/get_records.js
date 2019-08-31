//JQUERY IMPORT
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = require('jquery')(window);

const moment = require('moment');
const config = require('./config.js');

const hostProvider = config.blockchainOptions.host;

var sensorDataContract = null;

var Web3 = require('web3');

const TruffleContract = require('truffle-contract');
//var waterfall = require('async-waterfall');


var web3 = new Web3(new Web3.providers.HttpProvider(hostProvider));
var web3Provider = null;

var firstAccount;

/*****************/

var sensorDataAbi = require(__dirname+"/build/contracts/SensorData");


initweb3().then (function (result) {
    setContracts().then(function(result){
        getInformationFromBlockchain();
    });
});


async function initweb3() {
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
}

async function setContracts () {
    console.log("start setContracts");

    sensorDataContract = TruffleContract(sensorDataAbi) //get truffle contract; function from truffle package - node
    sensorDataContract.setProvider(web3Provider)

    firstAccount = web3.eth.accounts[0];

    console.log("firstAccount = ", firstAccount);

    console.log("final setContracts");
}

async function getInformationFromBlockchain() {
    console.log("---getInformationFromBlockchain---");
    console.log("\n \n");

    sensorDataContract.deployed().then(async function (instance) {
        let dataId = await instance.dataId();


        console.log("dataId = ", dataId.toNumber());
        //console.log("dataFromSensorBC = ", dataFromSensorBC);

        // Fetch dataFromSensor on the blockchain
        for (var i = 1; i <= dataId; i++) {
            const task = await instance.dataFromSensorArray(i)
            const dataId = task[0]
            const temperatureContent = task[1]
            const lightContent = task[2]
            const battery = task[3]
            const sensorEvent = task[4]
            const devId = task[5]
            const date = task[6]

            console.log("----------------------------------------");
            console.log("dataId = " + dataId);
            console.log("temperature = " + temperatureContent);
            console.log("light = " + lightContent);
            console.log("battery = " + battery);
            console.log("sensorEvent = " + sensorEvent);
            console.log("devId = " + devId);
            console.log("date = " + date);
            console.log("----------------------------------------");
            console.log("\n \n");
        }
    }).then(function(result) {
        //console.log("getInformationFromBlockchain = ", result.toString());
        console.log("---final----")
    }, function (error) {
        console.log(error);
    });
}

function getDataFromSensorArray () {
    console.log("---getDataArray---");

    sensorDataContract.deployed().then(function(instance){
        return instance.dataFromSensorArray(1);
    }).then(function(result) {
        console.log("getDataArray = ", result.toString());
    }, function (error) {
        console.log(error);
    });
}



