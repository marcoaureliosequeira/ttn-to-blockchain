//JQUERY IMPORT
var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = require('jquery')(window);

const ttn = require('ttn');
const moment = require('moment');
const config = require('./config.js');

//TTN CONFIGURATIONS
const appID = config.TTNOptions.appID;
const accessKey = config.TTNOptions.accessKey;

//BLOCKCHAIN CONFIGURATIONS
const hostProvider = config.blockchainOptions.host;

//INITIALIZE SMART CONTRACT VARIABLE
var sensorDataContract = null;

//GET WEB3.js
var Web3 = require('web3');

//GET TRUFFLE CONTRACT
const TruffleContract = require('truffle-contract');

//CREATE WEB3 OBJECT TO BLOCKCHAIN
var web3 = new Web3(new Web3.providers.HttpProvider(hostProvider));
var web3Provider = null;

var firstAccount;

/*****************/
//SMART CONTRACT'S ABI - Application Binary Interface, is basically how you call functions in a contract and get data back
var sensorDataAbi = require(__dirname+"/build/contracts/SensorData");

//**************************
//******MAIN EXECUTION******
//**************************

initweb3().then (function (result) { //INIT WEB3
    setContracts().then(function(result){ //WHEN INITIALIZED WEB3, SET CONTRACTS
        ttnClient(); //WHEN ALL DATA IS PREPARED, LISTENING DATA FROM TTN SENSOR
    });
});

//**************************
//******AUX FUNCTIONS*******
//**************************

//LISTENING DATA FROM TTN SENSOR
function ttnClient () {
    ttn.data(appID, accessKey) //TTN OBJECT FOR CONFIGURED APP/SENSOR
        .then(function (client) {
            client.on("uplink", async function (devID, payload) { //WHEN SENSOR SEND DATA
                console.log("DevId", devID);
                console.log("payload = ", payload);
                //console.log("paylodFields.battery = ", payload.payload_fields.battery);
                console.log("\n\n\n")

                //BATTERY DATA
                let battery = payload.payload_fields.battery;

                //SENSOR EVENT
                let sensorEvent = payload.payload_fields.event;

                //LIGHT DATA
                let light = payload.payload_fields.light;

                //TEMPERATURE DATA
                let temperature = Math.round(payload.payload_fields.temperature);

                //DATE
                let dataDate = payload.metadata.time;

                //SEND DATA TO BLOCKCHAIN FUNCTION
                setInformationInBlockchain(temperature, light, battery, sensorEvent, devID, dataDate);
            })
        })
        .catch(function (error) {
            console.error("Error", error)
            process.exit(1)
        });
}


//SET WEB3 CONFIGURATIONS
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

//SET SMART CONTRACTS CONFIGURATIONS
async function setContracts () {
    console.log("start setContracts");

    //CREATE SMART CONTRACT OBJECT FROM ABI AND SET WEB3 PROVIDER
    sensorDataContract = TruffleContract(sensorDataAbi) //get truffle contract; function from truffle package - node
    sensorDataContract.setProvider(web3Provider)

    //SET NODE TO COMMUNICATE - FIRST ACCOUNT
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

//SEND DATA TO BLOCKCHAIN
function setInformationInBlockchain (temperature, light, battery, sensorEvent, devId, dataDate) {
    console.log("init setInformationInBlockchain")
    sensorDataContract.deployed().then(function(instance){ //WHEN SMART CONTRACT IS DEPLOYED, CALL SMART CONTRACT'S METHOD
        return instance.createDataSensor(temperature, light, battery, sensorEvent, devId, dataDate, {from: firstAccount});
    }).then(function(result) {
        console.log("setInformationInBlockchain");
    }, function (error) {
        console.log(error);
    });
}


///NOT USED
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



