//JQUERY IMPORT
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = require('jquery')(window);

const ttn = require('ttn');
//const mysql = require('mysql');
const moment = require('moment');
const config = require('./config.js');

const appID = config.TTNOptions.appID;
const accessKey = config.TTNOptions.accessKey;

const hostProvider = config.blockchainOptions.host;

var contracts = {};

var sensorDataContract = null;

var Web3 = require('web3');

const TruffleContract = require('truffle-contract');
//var waterfall = require('async-waterfall');


var web3 = new Web3(new Web3.providers.HttpProvider(hostProvider));
var web3Provider = null;

var firstAccount;

/*****************/

var sensorDataAbi = require(__dirname+"/build/contracts/SensorData");
var sensorDataAddress = null;
var sensorDataDeployed = null;
var sensorDataContractAddress;


initweb3().then (function (result) {
    setContracts().then(function(result){
        ttnClient();
    });
});


function ttnClient () {
    ttn.data(appID, accessKey)
        .then(function (client) {
            client.on("uplink", async function (devID, payload) {
                console.log("DevId", devID);
                console.log("paylodFields.battery = ", payload.payload_fields.battery);
                console.log("\n\n\n")

                let battery = payload.payload_fields.battery;
                let sensorEvent = payload.payload_fields.event;
                let light = payload.payload_fields.light;
                let temperature = Math.round(payload.payload_fields.temperature);
                let dataDate = payload.metadata.time;

                //getInformationFromBlockchain();
                setInformationInBlockchain(temperature, light, battery, sensorEvent, devID, dataDate);
            })
        })
        .catch(function (error) {
            console.error("Error", error)
            process.exit(1)
        });
}



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

    sensorDataContract.deployed().then(function(instance){
        return instance.dataId();
    }).then(function(result) {
        console.log("getInformationFromBlockchain = ", result.toString());
    }, function (error) {
        console.log(error);
    });
}


function setInformationInBlockchain (temperature, light, battery, sensorEvent, devId, dataDate) {
    console.log("init setInfo")
    sensorDataContract.deployed().then(function(instance){
        let currentDate = moment().toString();
        return instance.createDataSensor(temperature, light, battery, sensorEvent, devId, dataDate, {from: firstAccount});
    }).then(function(result) {
        console.log("setInfoFinish");
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

///NOT USED
function getInfoFromDeployedSmartContract(){

    /*let todoListPromise;
    if (todoListAddress !== null){
        console.log("entrei no if!!");
        todoListPromise = todoListContract.at(todoListAddress);
    }else{
        console.log("entrei no else!!!!");
        todoListPromise = todoListContract.deployed();
    }

     todoListPromise.then(async todoListDep=>{
         console.log("The deployed TodoList contract is at " + todoListDep.address)

         todoListContractAddress = todoListDep.address;
         todoListDeployed = todoListContract.at(todoListDep.address);
    }).catch((error) => {
        console.error(error);
    });*/
}



